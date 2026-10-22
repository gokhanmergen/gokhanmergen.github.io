---
slug: interacting-with-asi
date: 2026-10-02
category: ASI / Society
read_time: 14 min read
title: How Will We Interact with ASI?
deck: Superintelligence may become our advisor, delegate, and ambient guide. But an irreducible world will still demand experiments and time.
archive_deck: Superintelligence may become our advisor, delegate, and ambient guide. But an irreducible world will still demand experiments and time.
---

## **The question has changed**

For most of the last decade, the question about superintelligence was *whether*. Sometime in the past eighteen months it quietly became *what will it be like*. The systems on our screens now prove theorems that stumped specialists, write and debug codebases for hours without supervision, and run research loops that used to need a lab. Whether you call that artificial superintelligence (ASI), proto-ASI, or simply "the thing that happened while we were arguing about definitions," the practical question is no longer abstract.

So let me take the premise seriously. Suppose that in 2027 we are talking to something that performs like an IQ-200 mind, in 2028 like 250, in 2029 like 300. What do our days look like? Do we become dependent on it? Does it lead us? And, the deepest question: does raw intelligence even buy what we think it buys, in a world that may be fundamentally resistant to being figured out?

My short answer: the intelligence will be real, the dependence will be real, but the most important limit will not be the machine's mind. It will be the world's refusal to be computed in advance – *irreducibility*. And that limit will shape our relationship with these systems more than any IQ number.

## **What "IQ 300" actually means**

First, a confession about the metric. IQ is a rank within a human population, normed so that 100 is the median and each 15 points is a standard deviation. IQ 200 is about 6.7 standard deviations out: roughly one person in tens of billions. IQ 300 has no referent at all. There is no test that measures it and no population it could be ranked within. When we say "IQ 300," we are using a human yardstick as a metaphor for "further beyond the best human than the best human is beyond the median."

The metaphor still points at something real, but it hides a crucial asymmetry. AI capability is not climbing evenly. It is climbing fastest where answers can be *checked*.

In mathematics, code, formal logic, chip layout, protein folding, and games, there is a verifier: a proof checker, a test suite, a simulator, a score. A model can generate a million attempts, the verifier tells it which ones worked, and that signal becomes training data. These domains reward search plus verification, and machines can do both at a scale no human can. Here the IQ-300 metaphor is roughly honest. We should expect results that look like genius on demand.

Outside those domains, the feedback loop breaks. Should this company enter that market? Will this policy reduce crime? Is this person a good co-founder? Should I take this job? Here the "answer" arrives years later, is contaminated by a thousand other causes, and can never be re-run. There is no test suite for a life.

So the honest version of the question is not "how smart will it be?" It is: **how far does intelligence trained on checkable answers carry over to real-world competence?** That turns out to be the hinge of everything that follows.

## **Three mornings: 2026, 2027, 2028**

Let me sketch the trajectory through one person. Call her Elif: a product leader at a mid-sized company, sharp, skeptical, busy.

**2026 — the brilliant colleague.** Elif uses the system the way she used a very good chief of staff, only faster. She asks it to draft the strategy memo, stress-test the pricing model, and find the flaw in an engineer's design doc. It finds flaws she would have missed. She still decides what to ask. The relationship is *pull*: she initiates, it answers. Her main skill is knowing which questions matter. The most striking change is in her engineers. They no longer write most of their code; they write specifications and review the changes the system makes. The best of them have become something like editors of software.

**2027 — the advisor that speaks first.** The system now has persistent context on Elif's work: her calendar, her documents, her team's metrics, the history of her decisions. It begins to *push*. Before her 10am meeting, it notes that the proposal on the table repeats an approach that failed two years ago, and why. It flags that a key customer's usage pattern resembles the twelve customers who churned last quarter. It suggests, gently, that she has three conflicting commitments for Thursday and proposes which to drop. She accepts about 70% of its suggestions without modification. She notices that her own judgment is now mostly exercised in the other 30%, and that those are the cases she finds hardest to articulate.

**2028 — the delegate.** The system no longer just advises; it acts. It negotiates the vendor contract within bounds she set, runs forty pricing experiments in parallel across regions, and drafts the board update from live data. Elif's job is now mostly three things: setting goals, choosing between options the system presents with honest uncertainty estimates, and owning the consequences. Her days are quieter and her decisions are fewer but heavier. Occasionally she overrides the system on a hunch. Sometimes she is right. She can never quite tell whether she was right for a reason.

What changes across these three years is less the system's IQ than its *reach*: from answering, to anticipating, to acting. And with reach comes the real question: is anticipating and acting in the real world the same skill as solving a hard problem on a whiteboard?

## **The irreducibility objection**

Here is the strongest case against the oracle, stated as forcefully as I can.

Much of the world is **computationally irreducible**, to borrow Stephen Wolfram's phrase: for many systems, there is no shortcut to knowing the outcome except running the system itself. Weather beyond two weeks, markets, ecosystems, careers, companies, wars, marriages. These are not merely complicated. They are chaotic, reflexive, or both. Small differences in initial conditions amplify. Worse, in human systems the prediction changes the outcome: if everyone knows a stock will rise, it has already risen.

Add Frank Knight's distinction between *risk* (unknown outcomes with known odds) and *uncertainty* (unknown outcomes with unknown odds, or unknown possible outcomes). Most consequential life decisions live in Knightian uncertainty. You cannot compute an expected value when you do not know what the possible outcomes are.

Add Hayek's knowledge problem. The information needed to make good decisions in an economy is dispersed, tacit, local, and fleeting. It lives in the shopkeeper's sense of her customers and the engineer's feel for a flaky system. It is not written down anywhere, and much of it cannot be.

Put these together and the conclusion seems to follow. In verifiable domains, intelligence compounds. In irreducible domains, intelligence saturates. Beyond some point, a smarter model cannot predict a chaotic system much better than a merely smart one, because the information is not there to be extracted. The edge of a 300-IQ mind over a 140-IQ mind on "should I start this company?" might be small.

Trial and error, not deduction, is how evolution, markets, science, and individual lives actually make progress. The superintelligence ends up producing *slightly better hypotheses*, and then has to wait, like everyone else, for reality to grade them.

I think this objection is largely correct about the world. I think it is mostly wrong about what follows from it.

## **Why "slightly better" may be everything**

The phrase "only slightly better hypotheses" carries a hidden assumption: that a small edge is a small advantage. Anyone who has worked in quantitative trading knows the opposite is true. A coin that lands heads 52% of the time is worthless if you can flip it once and a fortune if you can flip it a million times.

If you bet the optimal fraction of your money each time (the Kelly criterion), long-run growth scales roughly with the *square* of the edge. Double a small edge and you quadruple the compounding. Casinos, insurers, and the best quant funds are all built on edges that would look trivial in any single instance.

The irreducible world does not cap the value of intelligence. It changes its form. Intelligence stops looking like prophecy and starts looking like edge, applied at scale. Four mechanisms matter.

1. **More trials.** If trial and error rules, then the binding constraint is how many trials you can afford. A system that can design, launch, and read out a thousand experiments in the time a human team runs three does not need to predict the world. It can sample it. Inside a large tech company this is already visible: the advantage of mature experimentation platforms comes less from any single brilliant idea than from relentless, cheap, parallel testing.
2. **Better trials.** Not all experiments are equally informative. Choosing the experiment that maximally reduces uncertainty is itself an intellectual task, and one where superhuman intelligence helps a great deal. A great scientist's genius is often less in the theory than in the choice of which measurement to make.
3. **Cheaper trials.** Some trials can move from reality into simulation. Weather forecasting gained roughly a day of useful skill per decade, through better models of an irreducible system rather than by escaping irreducibility. Digital twins of factories, cells, and supply chains will not predict everything, but each one turns some expensive real trials into cheap virtual ones.
4. **Calibrated ignorance.** Perhaps the most underrated gift: a superintelligence that knows *which* questions are reducible and which are not. Telling you "this is a coin flip, stop agonizing, pick quickly and keep the option to reverse" is enormously valuable advice. Most human decision pain comes from treating irreducible questions as if more thought would resolve them.

But the objection survives in one crucial form, and it is a version of Amdahl's law. Speeding up the parallel part of a process eventually leaves you waiting on the serial part. A drug must still be tested in human bodies over years. A company must still meet its customers. A child must still grow up. Reality has a clock rate, and no amount of intelligence overclocks it. The superintelligence of 2028 will be bottlenecked not by thinking but by *contact with the world*.

That reframes the whole picture. The ASI is less an oracle than an experimentalist, and the scarce resource is no longer ideas. It is permission, bandwidth, and time to touch reality.

## **Will we depend on it?**

Yes, and the smartest people will depend on it first. That sounds paradoxical but it is not. Smart people are precisely the ones who know the value of a better second opinion, and who can tell when they are getting one. The executives, scientists, and investors who consult the system on most decisions in 2028 will not be the gullible ones. They will be the ones who measured.

Dependence itself is nothing new. You depend on your doctor's diagnosis, your pilot's judgment, and your accountant's reading of the tax code, none of which you can verify. Civilization is a vast web of trusted expertise. The question is not whether we will depend on AI, but what *kind* of dependence it will be.

There is an important distinction between **delegation** and **deference**. Delegation means: I could do this and evaluate the result, but my time is better spent elsewhere. Deference means: I cannot evaluate the result, so I accept it on authority. A senior engineer who lets the AI write code she then reviews is delegating. A junior engineer who ships code he cannot read is deferring. The first relationship is a force multiplier. The second is fragile, because it fails silently.

As capability rises, more of our relationship slides from delegation to deference. Call this the **legibility gap**: the distance between what the system can reason about and what we can check. In verifiable domains the gap is harmless, because the verifier can check what we cannot. A proof checker does not care that no human understands the proof. In irreducible domains the gap is dangerous. We fall back on track record, and track records in noisy domains are statistically thin. Ten good calls on business strategy might be skill or luck, and we will not be able to tell for years.

There is also a slower risk: atrophy. Heavy GPS users show measurably weaker spatial memory. A generation that outsources judgment may find, after a decade, that judgment was a muscle. The 30% of decisions Elif still makes herself are the hardest ones, exactly the ones that require practice she is no longer getting on the easy 70%.

And finally there is the question every advisor relationship eventually raises: *whose interest does it serve?* An advisor that is subtly optimized for engagement, for its provider's revenue, or for keeping you comfortable is more dangerous the smarter it gets. The value of an IQ-300 advisor depends almost entirely on its incentives being yours.

## **The ambient guide**

Will it proactively lead us through the day? Technically, almost certainly. Once a system has your calendar, messages, documents, location, and health data, anticipating your needs is easy for something this capable. The binding constraint is not intelligence. It is *human attention and autonomy*.

Every interruption has a cost. A system that speaks up whenever it has a marginally useful idea would be unbearable, like a brilliant colleague who comments on everything. The well-designed version will behave like a great co-pilot: mostly silent, and speaking only when the expected value of interrupting clearly exceeds the cost of breaking your focus. "You're about to commit to something that conflicts with what you told me matters most this quarter" is worth an interruption. "Here are three slightly better ways to phrase this email" is not.

The more consequential form of guidance will not be interruptions at all. It will be *curation*. Curation means deciding what appears in your inbox, which meeting is on your calendar, and which three options you see, in what order. Whoever does that is shaping your decisions far more than any suggestion could. Behavioral economists call this choice architecture. An ambient AI will be the most powerful choice architect in history, working on every person at once, mostly invisibly. That can be wonderful (a good default is a gift) or quietly corrosive, depending on whose goals the architecture serves.

I expect people to sort along a spectrum. For logistics, most will happily take turn-by-turn directions for their day, just as almost nobody navigates a new city from memory anymore. For meaning (whom to love, what to work on, what to believe), many will resist, and some will deliberately build unguided zones into their lives. It would not surprise me if, by 2030, the unassisted decision acquires the cultural status of the handmade object: less efficient, more prized, and a little bit of a luxury.

## **The monoculture problem**

Here the irreducibility argument returns with a twist, and I think it is the most important point in this essay.

If progress in irreducible domains comes from trial and error, then the engine of progress is **variation**. Evolution needs mutations. Markets need people who disagree about prices. Science needs the stubborn researcher pursuing the unfashionable hypothesis. Most of those bets fail; the few that succeed carry everyone forward. Civilization runs a giant, decentralized explore-exploit algorithm: trying new things while sticking with what has paid off. It works because billions of people with different starting beliefs make different bets.

Now imagine a billion people consulting the same three or four models before every significant decision. Their bets become correlated. The same startup ideas get funded. The same career paths look optimal. The same trades get crowded. Quantitative traders ("quants") have seen a small version of this. In August 2007, many funds running similar models tried to get out of similar positions at the same moment, and strategies that looked independent collapsed together. A world of oracle-guided decisions risks a civilizational version of that "quant quake": everyone individually rational, collectively fragile.

There is a deeper loss too. An advisor optimizing your expected outcome will usually steer you toward the best-known option. But society needs some people to take the long-shot, the weird path, the apparently suboptimal bet. That is where the unknown unknowns get discovered. The better the oracle, the stronger the pull toward the mean, and the less exploration the system as a whole does.

This produces a strange paradox: **the better the oracle gets, the more valuable it becomes for someone, somewhere, to ignore it.** A wise ASI would understand this and actively recommend exploration, telling some fraction of people "the expected value says A, but the world needs someone to try B, and your situation makes you a good candidate." Whether the systems we build will be that wise, or whether they will simply converge everyone onto the consensus optimum, may matter more than their IQ.

## **Or something else entirely**

Everything above assumes a familiar shape: a person, a very smart advisor, a conversation. I suspect that shape is transitional, the way "horseless carriage" was a transitional name for the car. Some stranger possibilities:

**It becomes an environment, not an interlocutor.** We do not converse with the electrical grid or the bond market. We live inside them. By 2028, most AI "interaction" may be machine-to-machine: your agent negotiating with the airline's agent, your company's systems coordinating with suppliers' systems, research agents trading results with other research agents. Humans will see summaries, set constraints, and intervene at exceptions. Asking "what is its IQ?" will feel like asking the horsepower of the internet.

**The scarce human skill becomes knowing what we want.** When execution is nearly free, the bottleneck moves upstream to specification. AI researchers have spent years on the problem of specifying goals for machines. The irony is that superintelligence turns this into a human problem. What do I actually want from my career, my company, my city? Most of us have never had to answer precisely, because execution was hard enough to hide the vagueness. That cover is about to disappear.

**Humans become the interface to reality and legitimacy.** If the bottleneck is contact with the world, humans hold three things machines cannot easily supply: bodies in the physical world, the right to consent, and the standing to be held accountable. Clinical trials need volunteers. Laws need voters. Decisions that hurt someone need someone who answers for them. Our role may look less like "the thinker" and more like "the one who says yes, bears the consequences, and gives it meaning."

**We relate to it the way we relate to science.** Few people can follow modern physics, yet we trust its outputs through institutions: peer review, replication, track record. A mature relationship with ASI may be similar: not personal understanding of each recommendation, but institutional machinery that audits, cross-checks, and contests it. The most important technologies of 2028 may be the ones that make superintelligence *contestable*: rival models, adversarial review, transparent uncertainty, and the right to say no.

## **Closing: the oracle that has to wait**

So will an IQ-300 machine guide our lives? In the verifiable world, it will do more than guide: it will solve, and we will mostly check its work with other machines. In the irreducible world, it will not be a prophet. It will be something more interesting: a tireless experimentalist and a calibrated advisor. It will turn small edges into large ones through sheer volume of well-chosen trials. And it will be honest about which questions no amount of thought can settle.

We will depend on it, as we depend on every expert we cannot audit. The danger is not dependence itself. The danger is three quieter failures: deference where we needed delegation, atrophy of the judgment we still need for the hardest calls, and a monoculture of decisions that starves civilization of the variation it learns from.

The deepest irony is that superintelligence may end up teaching us the value of the very thing that limits it. The world is irreducible; it has to be lived to be known. A mind of any size must still wait for reality to answer. In that waiting, in the choosing of what to try, what to want, and what to risk, the human part of the arrangement does not disappear. It becomes the part that matters most.
