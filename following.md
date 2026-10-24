# The following page: prompts, progress and principles

This file records how `following.html` came about. Part 1 is the author's
prompts, word for word. Parts 2 and 3 are Claude's: what was built and the
principles it followed. How to maintain the page is in
[BLOG_WORKFLOW.md](BLOG_WORKFLOW.md), under "The following page".

## 1. The author's prompts

### Prompt 1 (2026-10-24)

> I am thinking of a building a continuously updated recommendations page or
> something of that flavor for my blog. Keep it unlinked from any of the main
> pages (for now). Help me design it -- remember auto updated requirement
> regarding topics that interest me. Here's a starting point.

The starting point pasted with it, an earlier chat answer to "how should i
best follow Scott Aaronson?":

```text
how should i best follow Scott Aaronson?

Searched the web
Almost everything Aaronson puts out goes through his blog, so that’s the core of following him. The rest is optional depending on how deep you want to go.

The blog (main channel). Shtetl-Optimized is at scottaaronson.blog and has an RSS feed. Add it to a feed reader so you don’t depend on remembering to check. He posts several times a month. A typical mix is quantum computing, complexity theory, AI, guest posts, and conference news like STOC accepted-paper roundups. Read the comment threads too. He replies at length there, and some of his sharpest arguments are in those replies rather than in the posts.
minifeed
scottaaronson
Filtering by topic. The blog has category archives, for example a Complexity category. WordPress blogs usually offer a separate feed for each category, so if you only want his AI posts or only his complexity posts, you can subscribe to just those.
scottaaronson
Talks and podcasts. He does a lot of these, and they’re often the clearest statement of where his views stand. Two recent examples:
A March 2026 interview with Yuval Boger covering the state of quantum hardware, the narrowing case for quantum skepticism, and the path to fault-tolerant machines.
quera
A public talk arguing that recent experiments have largely settled whether large-scale quantum computing is possible in principle.
msu
A Google Alert or a YouTube search on his name will catch new ones.
Papers. Follow him on Google Scholar to get an email when he posts a new paper, or set up an arXiv author alert.
Social media. As far as I know he doesn’t post on X or Bluesky in any meaningful way. The blog is where he actually publishes.
If you’re starting fresh, two things are worth reading first:

Quantum Computing Since Democritus. The book grew out of a course he taught.
Wikipedia
His long essay “Why Philosophers Should Care About Computational Complexity.” It’s probably the single best introduction to how he thinks.
Since you work and write on AI, his AI posts are worth prioritizing. He spent a sabbatical at OpenAI working on AI safety and watermarking, and that background shows in what he writes. His recent ones have been fairly stark, for example “Dispatches from the possibly last days of human relevance” (May 2026).
longtermwiki
minifeed

Sources:

Shtetl-Optimized feed listing (minifeed)
Shtetl-Optimized — Complexity category
QuEra podcast with Scott Aaronson
FRIB public talk
Scott Aaronson — Wikipedia
Long-Term Wiki entry
```

### Prompt 2 (2026-10-24)

> Do it

### Prompt 3 (2026-10-24)

> can you put a following.md file outlining the my prompts, your progress,
> your principles -- separate them from my prompt? Then we can commit and
> push for testing?

## 2. Progress (Claude)

### Design, proposed after prompt 1

The pasted answer is a template for one person: why they matter, where they
publish, and what to read first. The page repeats that card for each person
worth following, grouped by the blog's topics, under a stream of their new
work that updates itself.

- **Two layers.** The author writes the cards. A daily job adds only the
  titles, links and dates of new work, never anything in the author's voice.
- **Daily GitHub Action, no AI.** It reads each person's feeds (blogs,
  Substacks, arXiv, YouTube, podcasts), tags items by topic, and commits only
  when something changed.
- **Weekly Claude pass, later.** It would open a pull request with picks,
  appearances on other people's podcasts that no feed catches, and new
  people when the blog takes up a new topic. The pull request is the gate:
  nothing appears in the author's voice until it is merged.
- **Topics come from the posts.** Each post category maps to a topic, and
  the build warns about one that maps to none.

### Decisions taken when the author said "Do it"

The design ended with three questions. "Do it" accepted the recommended
answers:

1. Build the daily Action and the cards first; add the weekly Claude pass
   once the list of people settles.
2. Call it "People worth following", at `following.html`.
3. People only. Books stay in the reading-list post.

### Built on 2026-10-24

- `build_following.py`: the generator, using only Python's standard library
  like `build_blog.py`. `--fetch` reads the feeds first.
- `following/sources.toml`: 19 people and 21 feeds.
- `following/interests.toml`: six topics, their keywords, and the post
  categories each covers. All 26 posts' categories are covered.
- `following/picks.toml`: empty, for hand-written picks.
- `following/items.json`: the stored items. Only the fetch writes it.
- `following.html` and `following.opml`: the page, and all the feeds for a
  feed reader.
- `.github/workflows/following.yml`: runs every day at 05:17 UTC and on
  pushes that change the sources.
- Styles at the end of `styles.css`, and notes in `BLOG_WORKFLOW.md` and
  `README.md`.

### Checks

- Every feed was fetched before it went in; 21 work and are in use. The
  Institute for the Study of War, the Committee for a Responsible Federal
  Budget and Cato block automated readers, so they are left out. Alex
  Nowrasteh's own Substack stands in for Cato's feed.
- A second fetch with nothing new left every file unchanged, so the Action
  makes no empty commits.
- Screenshots at desktop width and at 390 px. The topic filter was tested
  in headless Chrome.
- `blog.html` and `feed.xml` are unchanged, so email subscribers never see
  the page.
- A separate agent checked every bio and "start here" link. It found these
  corrections, all applied:
  - Matt Kaeberlein left Optispan in April 2026. His card now follows his
    Longevity Science podcast.
  - Derek Lowe's feed is RSS 1.0, which the parser did not read at first.
    It does now.
  - Timothy Snyder is at the University of Toronto.
  - Jessica Riedl is at Brookings.
  - METR retitled its paper "Measuring AI Ability to Complete Long Software
    Tasks".
  - Aaronson's arXiv author page was dead, and Google Scholar replaced it.
  - Two book links were unverified and now use publisher DOIs.

### Tested on GitHub, 2026-10-24

The page went live at `https://www.gokhanmergen.com/following.html`, with
`noindex`. The first run of the Action on GitHub's servers worked and
committed, and its push started a Pages build by itself.

That run also showed that Substack refuses every request from GitHub's
servers, whatever the user agent or client. Seven feeds got HTTP 403 there,
though all had worked from a home connection. Substacks on their own
domains, such as Noahpinion, were unaffected. A temporary test branch
confirmed it, and was deleted afterwards. Three of the seven now read
mirrors of the same work:

- Zvi Mowshowitz: `thezvi.wordpress.com`
- Import AI: `jack-clark.net`
- Epoch AI: `epoch.ai/atom.xml`

The second run read 17 of the 21 feeds. The other four (Eric Topol, Timothy
Snyder, Anne Applebaum and Phillips P. O'Brien) publish only on Substack.
Their cards and stored items stay, but the Action can't update them.

### Open

- The "why" line on each card, and the page's intro, are Claude's drafts in
  the author's voice. They are factual, but they need the author's rewrite
  wherever they don't sound like the author.
- After the first push, confirm the Action runs and that its commits
  redeploy the site. The workflow also requests a Pages build, in case a
  push with the workflow token doesn't start one.
- Decide how the four Substack-only feeds get updated.
- The weekly Claude pass is not built yet.
- The page stays unlinked until the author decides otherwise.

## 3. Principles (Claude)

- **Judgment stays with the author.** Automation adds only facts: titles,
  links and dates. Anything in the author's voice (picks, notes, "why"
  lines) is written or approved by the author.
- **The page follows the blog's interests.** Topics come from the post
  categories. A post on a new subject raises a warning, so the page cannot
  quietly drift from what the blog is about.
- **Unlinked means unlinked.** The page is not in the navigation, in
  `blog.html` or in `feed.xml`, and it carries `noindex`. It still sits in
  a public repository, as does this file.
- **Same tools as the rest of the site.** It uses only the Python standard
  library, like `build_blog.py`, with plain HTML and the site's own styles.
  It is a separate script, so the blog build is unaffected.
- **Rebuilds are deterministic.** The page has no timestamps and the items
  are sorted stably, so a rebuild with nothing new leaves the files
  unchanged and the history stays clean.
- **One broken feed can't break the page.** A failing feed is logged with
  the date it started failing, and the others carry on. Items stay stored
  after they scroll off their feed.
- **The stream should be readable at a glance.** It covers 30 days, shows
  at most three items per feed by default, filters busy blogs to the
  blog's topics by keyword, and leaves out noise such as livestream
  recordings. Filters apply again at every build, so a change to them takes
  effect at once.
- **Nothing unverified.** Every feed was fetched and every link checked. A
  fact that couldn't be confirmed was dropped, not guessed.
- **Small first.** The daily feed job comes before the AI layer, so the
  list of people can settle before anything writes on the author's behalf.
