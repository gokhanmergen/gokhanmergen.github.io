/**
 * Email subscriptions for My Blog: Post AGI.
 *
 * A Google Apps Script web app that runs as the blog owner, so every message
 * is sent from the owner's Gmail. Subscribers live in a private Google Sheet.
 *
 * - The blog's sign-up form POSTs an address here (doPost). The address is
 *   stored as pending and a confirmation link is emailed (double opt-in).
 * - Confirmation and unsubscribe links come back here as GETs (doGet).
 * - An hourly trigger reads the blog's RSS feed (checkFeed) and emails each
 *   new post to every confirmed subscriber, one message per person.
 *
 * Setup: paste this file into an Apps Script project, run setup() once and
 * approve the permissions, then Deploy > New deployment > Web app with
 * "Execute as: Me" and "Who has access: Anyone". Put the /exec URL in
 * SUBSCRIBE_URL in build_blog.py.
 *
 * In the sheet, unsubscribe someone by setting their status to
 * "unsubscribed". Don't delete rows while a post is being sent.
 */

const BLOG_NAME = 'My Blog: Post AGI';
const AUTHOR = 'Gökhan Mergen';
const SITE_URL = 'https://www.gokhanmergen.com';
const FEED_URL = SITE_URL + '/feed.xml';
const SHEET_NAME = 'Subscribers';
const HEADERS = ['email', 'status', 'token', 'subscribed_at', 'confirmed_at', 'confirmation_sent_at'];
const COL = { EMAIL: 1, STATUS: 2, TOKEN: 3, SUBSCRIBED: 4, CONFIRMED: 5, SENT: 6 };
// At most one confirmation email per address per hour, so the form can't be
// used to flood someone's inbox from the owner's Gmail.
const RESEND_AFTER_MS = 60 * 60 * 1000;
// More new feed items than this at once means the feed changed (for example,
// a new domain changed every link), not that several posts were published.
// Those are marked as sent without emailing anyone.
const MAX_NEW_POSTS = 3;
const EMAIL_PATTERN = /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[^\s@<>()",;:]+$/;
const TOKEN_PATTERN = /^[0-9a-f-]{36}$/;

const props = PropertiesService.getScriptProperties();

function setup() {
  if (!props.getProperty('SHEET_ID')) {
    const spreadsheet = SpreadsheetApp.create('Blog subscribers');
    const sheet = spreadsheet.getSheets()[0].setName(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    props.setProperty('SHEET_ID', spreadsheet.getId());
  }
  // Posts already in the feed count as sent; subscribers only hear about new ones.
  if (!props.getProperty('SEEN')) {
    props.setProperty('SEEN', JSON.stringify(fetchFeed_().map(item => item.guid)));
  }
  ScriptApp.getProjectTriggers()
    .filter(trigger => trigger.getHandlerFunction() === 'checkFeed')
    .forEach(trigger => ScriptApp.deleteTrigger(trigger));
  ScriptApp.newTrigger('checkFeed').timeBased().everyHours(1).create();
  Logger.log('Subscribers sheet: ' + SpreadsheetApp.openById(props.getProperty('SHEET_ID')).getUrl());
}

function doPost(e) {
  rememberWebAppUrl_();
  const params = (e && e.parameter) || {};
  const email = String(params.email || '').trim().toLowerCase();
  // "website" is a hidden field that only bots fill in. Leading = + - @ would
  // be read as a formula by Sheets.
  if (params.website || email.length > 254 || !EMAIL_PATTERN.test(email) || /^[=+\-@]/.test(email)) {
    return text_('invalid');
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  let token;
  try {
    const sheet = sheet_();
    const row = findRow_(sheet, COL.EMAIL, email);
    const now = new Date();
    if (row) {
      const values = sheet.getRange(row, 1, 1, HEADERS.length).getValues()[0];
      const lastSent = values[COL.SENT - 1];
      if (values[COL.STATUS - 1] === 'confirmed') return text_('ok');
      if (lastSent && now - new Date(lastSent) < RESEND_AFTER_MS) return text_('ok');
      token = values[COL.STATUS - 1] === 'pending' ? values[COL.TOKEN - 1] : Utilities.getUuid();
      sheet.getRange(row, COL.STATUS, 1, 5).setValues([['pending', token, now, '', now]]);
    } else {
      if (MailApp.getRemainingDailyQuota() < 1) return text_('busy');
      token = Utilities.getUuid();
      sheet.appendRow([email, 'pending', token, now, '', now]);
    }
  } finally {
    lock.releaseLock();
  }

  sendConfirmation_(email, token);
  return text_('ok');
}

function doGet(e) {
  rememberWebAppUrl_();
  const params = (e && e.parameter) || {};
  const action = params.action;
  const token = String(params.token || '');
  if (!['confirm', 'unsubscribe'].includes(action) || !TOKEN_PATTERN.test(token)) {
    return page_('Link not recognized', 'This link is incomplete or has expired.');
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = sheet_();
    const row = findRow_(sheet, COL.TOKEN, token);
    if (!row) return page_('Link not recognized', 'This link is incomplete or has expired.');

    if (action === 'confirm') {
      if (sheet.getRange(row, COL.STATUS).getValue() === 'pending') {
        sheet.getRange(row, COL.STATUS).setValue('confirmed');
        sheet.getRange(row, COL.CONFIRMED).setValue(new Date());
      }
      return page_("You're subscribed", "Thanks for subscribing. You'll get an email when a new post is published.");
    }

    sheet.getRange(row, COL.STATUS).setValue('unsubscribed');
    return page_("You've been unsubscribed", "You won't receive any more emails from " + BLOG_NAME + '.');
  } finally {
    lock.releaseLock();
  }
}

function checkFeed() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) return;
  try {
    const seen = new Set(JSON.parse(props.getProperty('SEEN') || '[]'));
    const fresh = fetchFeed_().filter(item => !seen.has(item.guid)).reverse();  // oldest first
    if (fresh.length > MAX_NEW_POSTS) {
      Logger.log('Skipping %s new feed items; marking them as sent.', fresh.length);
      fresh.forEach(item => seen.add(item.guid));
      props.setProperty('SEEN', JSON.stringify([...seen]));
      return;
    }
    for (const item of fresh) {
      if (!sendPost_(item)) return;  // Out of quota; the next run resumes.
      seen.add(item.guid);
      props.setProperty('SEEN', JSON.stringify([...seen]));
    }
  } finally {
    lock.releaseLock();
  }
}

function sendPost_(item) {
  const baseUrl = props.getProperty('WEB_APP_URL');
  const progressKey = 'PROGRESS:' + item.guid;
  const rows = sheet_().getDataRange().getValues().slice(1);
  for (let i = Number(props.getProperty(progressKey) || 0); i < rows.length; i++) {
    if (rows[i][COL.STATUS - 1] === 'confirmed') {
      if (MailApp.getRemainingDailyQuota() < 1) return false;
      const unsubscribeUrl = baseUrl + '?action=unsubscribe&token=' + rows[i][COL.TOKEN - 1];
      MailApp.sendEmail({
        to: rows[i][COL.EMAIL - 1],
        name: AUTHOR,
        subject: item.title,
        body: [
          'A new post on ' + BLOG_NAME + ':',
          '',
          item.title,
          item.description,
          '',
          'Read it: ' + item.link,
          '',
          'Unsubscribe: ' + unsubscribeUrl,
        ].join('\n'),
        htmlBody: emailHtml_(
          '<p style="margin:0 0 12px;color:#667085;font-size:13px">A new post on ' + escape_(BLOG_NAME) + '</p>' +
          '<h1 style="margin:0 0 12px;font-size:24px;line-height:1.2"><a href="' + escape_(item.link) + '" style="color:#172033;text-decoration:none">' + escape_(item.title) + '</a></h1>' +
          '<p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:#4c5360">' + escape_(item.description) + '</p>' +
          '<p style="margin:0"><a href="' + escape_(item.link) + '" style="color:#2447b5;font-weight:bold">Read the post &rarr;</a></p>',
          'You subscribed to new posts at ' + SITE_URL.replace('https://', '') + '. ' +
          '<a href="' + escape_(unsubscribeUrl) + '" style="color:#667085">Unsubscribe</a>'
        ),
      });
    }
    props.setProperty(progressKey, String(i + 1));
  }
  props.deleteProperty(progressKey);
  return true;
}

function sendConfirmation_(email, token) {
  const confirmUrl = props.getProperty('WEB_APP_URL') + '?action=confirm&token=' + token;
  MailApp.sendEmail({
    to: email,
    name: AUTHOR,
    subject: 'Confirm your subscription to ' + BLOG_NAME,
    body: [
      'Please confirm that you want new posts from ' + BLOG_NAME + ' by email:',
      '',
      confirmUrl,
      '',
      "If you didn't ask for this, ignore this email and you won't hear from us again.",
    ].join('\n'),
    htmlBody: emailHtml_(
      '<p style="margin:0 0 20px;font-size:16px;line-height:1.6">Please confirm that you want new posts from <strong>' + escape_(BLOG_NAME) + '</strong> by email.</p>' +
      '<p style="margin:0"><a href="' + escape_(confirmUrl) + '" style="display:inline-block;padding:11px 18px;border-radius:999px;background:#3563e9;color:#ffffff;font-weight:bold;text-decoration:none">Confirm subscription</a></p>',
      "If you didn't ask for this, ignore this email and you won't hear from us again."
    ),
  });
}

function fetchFeed_() {
  const response = UrlFetchApp.fetch(FEED_URL, { muteHttpExceptions: true });
  if (response.getResponseCode() !== 200) {
    throw new Error('Feed returned HTTP ' + response.getResponseCode());
  }
  const channel = XmlService.parse(response.getContentText()).getRootElement().getChild('channel');
  return channel.getChildren('item').map(item => ({
    guid: item.getChildText('guid'),
    title: item.getChildText('title'),
    link: item.getChildText('link'),
    description: item.getChildText('description'),
  }));
}

// ScriptApp.getService().getUrl() is only reliable inside a web app request,
// so it is captured there for the emails sent by the hourly trigger.
function rememberWebAppUrl_() {
  const url = ScriptApp.getService().getUrl();
  if (url && /\/exec$/.test(url) && props.getProperty('WEB_APP_URL') !== url) {
    props.setProperty('WEB_APP_URL', url);
  }
}

function sheet_() {
  return SpreadsheetApp.openById(props.getProperty('SHEET_ID')).getSheetByName(SHEET_NAME);
}

function findRow_(sheet, column, value) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;
  const cell = sheet.getRange(2, column, lastRow - 1, 1)
    .createTextFinder(value).matchEntireCell(true).findNext();
  return cell ? cell.getRow() : null;
}

function emailHtml_(content, footer) {
  return '<div style="max-width:560px;margin:0 auto;padding:24px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;color:#172033">' +
    content +
    '<p style="margin:32px 0 0;padding-top:16px;border-top:1px solid #dfe5ee;color:#667085;font-size:12px;line-height:1.5">' + footer + '</p>' +
    '</div>';
}

function page_(title, message) {
  const html = '<!doctype html><meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<div style="max-width:520px;margin:15vh auto;padding:0 16px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;color:#172033">' +
    '<h1 style="font-size:28px">' + escape_(title) + '</h1>' +
    '<p style="color:#667085;font-size:16px;line-height:1.6">' + escape_(message) + '</p>' +
    '<p><a href="' + SITE_URL + '/blog.html" target="_top" style="color:#2447b5">Back to ' + escape_(BLOG_NAME) + '</a></p>' +
    '</div>';
  return HtmlService.createHtmlOutput(html).setTitle(title);
}

function text_(value) {
  return ContentService.createTextOutput(value);
}

function escape_(value) {
  return String(value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
