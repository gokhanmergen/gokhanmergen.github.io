---
slug: math-is-so-back
date: 2026-11-21
category: Mathematics / AI
read_time: 5 min read
title: Math Is So Over. Math Is So Back.
deck: Historic days. That is the only honest way to describe yesterday and today.
archive_deck: Historic days. That is the only honest way to describe yesterday and today.
---

For 167 years—ever since Bernhard Riemann published his famous 1859 paper—the Riemann Hypothesis stood as the ultimate summit of pure mathematics. It was the problem that defined careers, broke hearts, and quietly underpinned entire fields of number theory. Every few years, a new claim would surface, followed by weeks of polite skepticism and, inevitably, the discovery of a subtle fatal flaw on page forty-two.

Then came yesterday, November 20, 2026.

Levent Alpöge, working in intense collaboration with Claude, released a proof of the Riemann Hypothesis (and its generalized cousin for Dirichlet \(L\)-functions). Not as a 200-page PDF full of hand-wavy transitions and "left to the reader" gaps, and not even as a human-readable manuscript—translated into prose, the argument would reportedly span more than 250,000 pages. Instead, it arrived as roughly 17 million lines of Lean 4 code across more than 175,000 files.

And then came today.

Within twenty-four hours, independent researchers and the Lean and Mathlib communities compiled the codebase, audited the axioms, checked the theorem statement against Mathlib's vetted definition of the Riemann Hypothesis, and confirmed it: **it compiles.** Every non-trivial zero of \(\zeta(s)\) really does lie on the critical line \(\operatorname{Re}(s) = \frac{1}{2}\).

If you love mathematics, computer science, or simply the story of human knowledge, it is almost impossible not to feel two completely opposite emotions at the exact same time.

![A two-panel cartoon. Left, “Math Is So Over!”: a bearded mathematician in a tweed jacket weeps at a computer in a cluttered office, a chalkboard of zeta-function formulas behind him, crumpled paper and coffee mugs on his desk beside a nameplate reading “Riemann Hypothesis (1859–2026).” Towering stacks of folders and screens of code are labeled “175,000 files” and “17 million lines of Lean 4 code,” and he cries, “No more hand-written prose?! No more grinding on a chalkboard?! Just 17 million lines of machine code?!” Right, “Math Is So Back!!”: a cheerful explorer in a pith helmet stands on a summit labeled “The Riemann Hypothesis” under a starry sky, holding a blueprint marked “Grand architectural vision & intuition” and looking through a telescope labeled “The New Math” toward peaks named “New Conjectures,” “Provable Security” and “Theories of Physics.” A flag on a peak reads “It compiles! 100% verified,” a small robot with a tablet beside him says, “Axioms audited! Building the next bridge!” and the explorer says, “The AI did the heavy lifting! We aren’t out of a job—we just got a super-telescope!”](math-is-so-back-cartoon.jpg)

## Math Is So Over!

Let's be honest about the vertigo first. Something real just ended.

For centuries, mathematics was the last great artisanal cathedral of the human mind. It moved at the speed of human thought, coffee, and chalk. A proof wasn't just a certificate of truth; it was a social contract. One brilliant mind forged a path through the wilderness, wrote it down in prose, and spent years convincing a handful of peers that every stepping stone held weight.

A 17-million-line Lean proof shatters that rhythm completely.

No human being is going to sit down this weekend and read the equivalent of 250,000 pages of algebraic machinery, trace formulas, and technical lemmas from start to finish. Even Alpöge remarked on how the AI outpaced him near the finish line. For anyone who grew up believing that the core identity of a mathematician is grinding through brutal technical calculations by hand until a proof yields, this moment feels like a meteor strike.

The old model—where human cognitive bandwidth was the hard bottleneck on both *finding* a proof and *verifying* it—is officially over.

## Math Is So Back!!

And yet, five minutes after the existential dread hits, something much bigger takes over: sheer, electric exhilaration.

Because look at *what actually happened*.

First, the cynics who dismissed AI math as an engine of plausible-sounding hallucinations just got their answer. When paired with formal verification, AI doesn't ask us to "trust the model." Lean doesn't care how confident or eloquent an AI sounds. If a single step is circular, sloppy, or missing an edge case, the build fails. Today, the mathematical community didn't have to wait three years for a small committee to check whether a claim was real. Formal logic gave us mechanical certainty in a single day.

Second, this wasn't a machine replacing a mathematician; it was a glimpse of a completely new kind of partnership. A human provided the high-level architectural vision—translating intuition from simpler toy settings into the towering machinery of automorphic forms—while the AI explored vast technical landscapes, executed intricate manipulations, and stitched together lemmas at a scale no human team could match.

Instead of closing the book on mathematics, we just unlocked a telescope. How many other towering conjectures—problems whose proofs simply live beyond the length a human brain can hold in working memory at once—are suddenly within reach?

## Welcome to the New "Math"

We haven't lost mathematics. We have gained a **new "math"**—not just new theorems, but a transformed *discipline*.

When photography arrived, painting didn't die; it evolved into something bolder and more conceptual. When computers arrived, calculation didn't vanish; it exploded into software engineering, simulation, and modern science. The same phase transition is hitting mathematics right now, and it demands that we wrap our heads around what the craft becomes next:

* **Architecture over brute force:** The highest-leverage mathematical skill is shifting toward taste, problem selection, conceptual framing, and knowing *which* bridges to build between distant islands of theory.
* **The art of distillation:** Having a verified 17-million-line proof tells us *that* the Riemann Hypothesis is true. Now comes a brand-new mathematical challenge: excavating *why* it is true. Compressing, refactoring, and translating machine-scale proofs into human intuition will become a first-class discipline of its own.
* **Formalization as native language:** Proof assistants like Lean are no longer a niche hobby for formal-methods enthusiasts. They are the shared substrate where human insight and machine speed can safely meet.

## Toward Beautiful, Utilitarian Progress

For a long time, there has been an unspoken divide between the "beautiful" and the "utilitarian"—between the pure mathematician chasing abstract truth for its own sake and the engineer building systems that have to work in the real world.

This new discipline fuses the two.

There is undeniable **beauty** in watching a 167-year-old mystery finally yield, and there will be even deeper beauty as mathematicians sift through this proof to uncover the hidden conceptual gems buried inside those 175,000 files.

At the same time, the **utilitarian** upside is staggering. A world where humans and AI can routinely construct and mechanically verify complex mathematical arguments is a world where we can build provably secure cryptography, bug-free critical infrastructure, and rock-solid formal foundations for physics, economics, and AI itself. Proof stops being just a dusty monument in a journal; it becomes composable, executable, reliable technology.

Yesterday, the ground shifted beneath one of humanity's oldest disciplines. Today, the compiler confirmed it wasn't a dream.

The old era of mathematics is over. The new one is wide open. It's time to wrap our heads around it—and get to work building something both beautiful and deeply useful.
