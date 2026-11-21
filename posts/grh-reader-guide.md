---
slug: grh-reader-guide
date: 2026-11-20
time: 22:00
category: Mathematics / AI
read_time: 2 min read + 43-page guide
title: Inside the Claimed Lean 4 Proof of the Generalized Riemann Hypothesis: A Reader's Guide
archive_title: A Reader's Guide to the Claimed Lean Proof of GRH
deck: Levent Alpöge and Claude released a machine-checkable proof of the Riemann Hypothesis with no paper to read. I asked an AI to read the code and explain it.
archive_deck: Levent Alpöge and Claude released a machine-checkable proof of the Riemann Hypothesis with no paper to read. I asked an AI to read the code and explain it.
---

In November 2026, the mathematician [Levent Alpöge](https://alpo.ge/), who now works at Anthropic, announced that working with Claude he had found a proof of the Riemann Hypothesis, and that the same method resolves the Generalized Riemann Hypothesis for Dirichlet L-functions. In a short companion note, he describes steering the work toward a descendant of Stepanov's argument for curves over finite fields, while Claude supplied much of the technical machinery, including the idea of chaining roughly √X theta lifts to imitate the "multiplicity" that the function-field proof relies on. Rather than post what he called a massive unreadable document, he released only the formal proof: a Lean 4 archive of 175,187 files and 17.37 million lines.

That left those of us who are curious with a proof no human can read. So I downloaded the archive and the note and asked Google's Antigravity agent, running Gemini Neon, to read the Lean source and explain it. The result is the 43-page guide below. It reconstructs the argument's architecture from static inspection of the code, starting each section in plain English with analogies and small worked examples before giving the exact statements and inequalities found in the Lean files. It was not written, reviewed or endorsed by Alpöge, and the code has not been compiled here: a text scan found no `sorry`, no custom axioms and no `native_decide`, but the full kernel check (`lake build Main`, `#print axioms`, `lean4checker`) still has to run on a large machine. Read it as an AI-written map of a claimed proof, not as a verification.

![The cover of the guide: “Inside the Claimed Lean 4 Proof of the Generalized Riemann Hypothesis. A Non-Specialist Reader's Guide to the Ideas, Analogies, and Key Proof Steps of Levent Alpöge and Claude's Lean 4 Formalization,” with a note that it was reconstructed from static inspection of the November 20, 2026 Lean 4 archive and was not written, reviewed, or endorsed by L. Alpöge.](grh-reader-guide-cover.png)

**[Read the guide (PDF, 43 pages)](/pubs/grh-reader-guide/GRH_Reader_Friendly_Guide.pdf)**

*— triple checked by several AIs (Gemini Neon High x 2, Claude Opus High) for rigor and correctness.*
