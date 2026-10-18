---
name: turkish-translation
description: Principles and house conventions for translating a blog post into Turkish or revising a Turkish translation (posts/<slug>-tr.md). Use whenever creating, reviewing, or editing a Turkish version of a post.
---

# Turkish translation principles

Every post in `posts/` has a Turkish version, `posts/<slug>-tr.md`. These
principles come from translating all of them and then rewriting them, because
the first, sentence-faithful pass read like a translation.

## 1. The goal

Write Turkish that a Turkish reader would take for something originally
written in Turkish, with the same arguments as the English.

- **Flow beats equivalence.** Sentence-by-sentence correspondence with the
  English is not the goal. Restructure freely.
- **Substance does not move.** Every argument, claim, example, number, date,
  name, caveat, link and conclusion survives, with the same strength.
- **Register:** a good contemporary Turkish essayist or columnist writing for
  a general audience. Clear, lively, precise modern Turkish. Not academic or
  officialese, not slangy, not flowery.
- **Voice:** the author's first person ("ben"), wry and direct. Hedges stay
  hedges and strong claims stay strong. Address the reader as "siz". A
  personal letter or an aphorism may use "sen".

## 2. What you may change

- Sentence structure. Use Turkish order (verb last, focus just before the
  verb), split long English-style sentences, and merge choppy ones.
- Paragraphs, within the same section. Split them, merge them, or reorder
  their sentences.
- Idioms. Replace calques with natural Turkish expressions; vary repeated
  words; cut filler.
- The title, deck and headings. Make them sound like Turkish headlines rather
  than word-for-word renderings.
- English glosses in parentheses. Drop them unless readers need the English
  term to recognise a technical concept. Prefer the word Turkish tech,
  finance or medical writers actually use, even if it is an established
  loanword (benchmark, prompt, token, startup).

## 3. What must not change

- **Arguments and facts:** no dropped, added or distorted claims, examples,
  numbers or caveats. Keep the scope ("most" vs "all") and keep causation
  distinct from correlation.
- **Quotes and attribution:** reported speech stays reported speech. Do not
  turn a paraphrase into a direct quote, and do not name an actor the English
  leaves unnamed.
- **Markdown structure:**
  - the same headings (count and level; the wording may change);
  - the same list items, blockquote lines and table rows/columns;
  - every image file (translate the alt text);
  - all math (only Turkish words inside `\text{...}` change);
  - every link URL, the same number of times (the link text may change).
- **Front matter:** `date`, `time` and the numeric part of `read_time` match
  the English.

## 4. Translationese to hunt

These patterns all appeared in early drafts:

- **"bir" before almost every noun.**
  - Before: "Yalnızca bir öncü modelin yüksek bir fiyata yapabildiği şey,
    kısa süre sonra daha küçük ve daha ucuz bir modelin rutin olarak yaptığı
    bir işe dönüşüyor."
  - After: "Bugün yalnızca öncü modellerin yüksek maliyetle yapabildiği bir
    iş, kısa süre sonra daha küçük ve ucuz modeller için sıradanlaşıyor."
- **English frames:**
  - "Bu, X'in hikâyesi"
  - "Bu, ... anlamına geliyor"
  - "...-dığı gerçeği"
  - "Çekinceler önemli:"
  - "Asıl ilginç soru, ..."
  - "günün sonunda"
  - "mantıklı" for "makes sense"
- **Overused constructions:**
  - "hale gelmek/getirmek", "sahip olmak", the "tarafından" passive,
    "-mekte/-makta";
  - chains of "olan" and "ki";
  - "söz konusu", "bu bağlamda";
  - "aslında" and "gerçekten" sprinkled everywhere.
- **Long English sentences carried over whole,** built with commas and
  semicolons. Give them Turkish sentence boundaries, but don't make the text
  choppy.
- **Literal openings.**
  - Before: "insan bir serbest çalışan değil, ..."
  - After: "Adı serbest çalışanı çağrıştırıyor ama ortada bir insan yok: ..."
- **Redundant pronouns and possessives:** "ben", "onların" and "bizim" where
  the suffix already says it.
- **Odd register:** "namıdiğer", or "iskân etmek" where "yerleşmek" is meant.
- **English units read the English way.**
  - Before: "26B'lik model"
  - After: "26 milyar parametreli model"
- **Headings rendered word for word.**
  - Before: "Yeteneğe Karşı Çıktı"
  - After: a real Turkish heading.

## 5. House conventions

**Front matter**

```markdown
---
slug: <slug>-tr
translation_of: <slug>
lang: tr
date: <same as the English>
time: <only if the English has one; same value>
category: <from the table below>
read_time: <N> dk okuma
title: <Turkish title>
deck: <Turkish deck>
archive_deck: <same as deck if the English deck and archive_deck match>
archive_title: <only if the English has one>
---
```

Write titles in Turkish title case, as in "Verilmeye Değer Tek Savaş".
Conjunctions and particles such as ve, ile, mi and ki stay lowercase.

**Categories**

| English | Turkish |
| --- | --- |
| AI / Safety | Yapay Zekâ / Güvenlik |
| Agents / Economy | Ajanlar / Ekonomi |
| ASI / Society | Süper Zekâ / Toplum |
| Books / Markets | Kitaplar / Piyasalar |
| Career / AI | Kariyer / Yapay Zekâ |
| Culture / AI | Kültür / Yapay Zekâ |
| Culture / Discovery | Kültür / Keşif |
| Economy / Agents | Ekonomi / Ajanlar |
| Economy / Politics | Ekonomi / Siyaset |
| Futures / AI | Gelecek / Yapay Zekâ |
| Humanity / AI | İnsanlık / Yapay Zekâ |
| Ideas / AI futures | Fikirler / Yapay Zekânın Geleceği |
| Ideas / Quotations | Fikirler / Alıntılar |
| Longevity / AI | Uzun Ömür / Yapay Zekâ |
| Longevity / Biotech | Uzun Ömür / Biyoteknoloji |
| Longevity / Medicine | Uzun Ömür / Tıp |
| Mathematics / AI | Matematik / Yapay Zekâ |
| Truth / Society | Hakikat / Toplum |
| Work / AI | Çalışma Hayatı / Yapay Zekâ |

For a new English category, translate it in the same style and add it to this
table and to `CATEGORIES` in `check_translation.py`.

**Terminology**

- AI → **yapay zekâ**, always with the circumflex. Spell it out rather than
  writing "YZ". An AI agent is a "yapay zekâ ajanı".
- AGI → "yapay genel zekâ (AGI)" at first mention, then "AGI".
- ASI → "yapay süper zekâ (ASI)" at first mention, then "ASI".
- superintelligence → süper zekâ.
- LLM → "büyük dil modeli (LLM)" at first mention, then "LLM" or "dil modeli".
- agent → ajan.
- autonomous → otonom.
- singularity → tekillik.
- alignment → hizalama.
- compute → hesaplama gücü.
- open-weight → açık ağırlıklı.
- inference → çıkarım.
- labor market → işgücü piyasası.
- Gold Rush → Altına Hücum.
- longevity → uzun ömür.
- healthspan → sağlıklı yaşam süresi.
- life expectancy → beklenen yaşam süresi.
- randomized controlled trial → randomize kontrollü çalışma.
- all-cause mortality → tüm nedenlere bağlı ölüm.
- Drug names: use the Turkish INN spelling (rapamisin, semaglutid).
- Study, product and programme names stay in English (SPRINT, Shingrix).

**Spelling and typography**

- Follow TDK, with one house exception: write "hale" and "haline" without the
  circumflex. Do write "zekâ" and "hâlâ".
- Write "de/da" and "ki" separately when they are conjunctions, and write the
  question particle "mi" separately.
- Suffixes on a proper noun follow its pronunciation, after an apostrophe:
  - OpenAI'ın, Google'ın, GPT-4'ün;
  - AGI'ın, AGI'ya, ASI'ya (acronyms are read the English way);
  - Hinton'un, Calment'ın.
- Numbers:
  - decimal comma: 46,1;
  - thousands separator: 10.000;
  - percent sign before the number: %40;
  - currency after the number, in words: "5 milyar dolar".
- Months: capitalize with a date ("18 Ekim 2026", "Ekim 2026'da"); write
  them in lowercase otherwise ("eylülde").
- Quotes: match the English file. If it uses curly quotes, use “ ” and ’,
  including for suffix apostrophes. If it uses straight quotes, use " and '.
- Names of people, companies and products stay in their original form, and
  so do titles of books, papers, films and albums. The exception is a work
  with a standard Turkish title (Savaş ve Barış, Şen Bilim).
- Turkish-born names use Turkish spelling: Daron Acemoğlu.

**Links and figures**

- A link to another post on this blog points to its Turkish version,
  `blog-<other>-tr.html`, when that version exists.
- Charts and figures keep their English image files; only the alt text is
  translated.

## 6. Process

1. Read the English once, for its arguments, examples and tone.
2. Write or revise the Turkish as Turkish. Ask of every paragraph "would a
   good Turkish writer put it this way?" Look at the English only to keep the
   argument intact. Work section by section on long posts.
3. Read the whole result top to bottom, in Turkish only, and smooth anything
   still stiff, choppy or repetitive.
4. **An independent second pass** checks substance. A second agent or editor
   lists every claim, number, caveat and link in the English and confirms
   each survives with the same meaning and strength. They also check the
   flow, and must not pull the wording back toward the English. When agents
   do the work, use one writer and a separate checker per post.
5. Validate the structure from the repository root:

   ```bash
   python3 -B .claude/skills/turkish-translation/check_translation.py <slug> --loose
   ```

   `--loose` lets paragraph counts differ; everything else must match the
   English. A post that deliberately differs needs a note explaining why. For
   example, quotations-tr drops the English gloss under its Turkish quote, so
   it has one fewer blockquote line. The English-word warning on reading-list
   comes from book titles.
6. Build and check as `BLOG_WORKFLOW.md` describes: `python3 build_blog.py`,
   `git diff --check`.

## 7. Publishing notes

- Translations are not in `feed.xml`, so publishing one sends no subscriber
  email.
- The Turkish posts are not cross-posted to Substack.
