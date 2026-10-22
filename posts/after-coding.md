---
slug: after-coding
date: 2026-09-23
category: Agents / Economy
read_time: 9 min read
title: The Frontier Keeps Moving: What Comes After Coding?
archive_title: What Comes After Coding?
deck: Intelligence is getting cheap fast, and each capability it saturates stops being the frontier. What comes next after chat and coding?
archive_deck: Intelligence is getting cheap fast, and each capability it saturates stops being the frontier. What comes next after chat and coding?
---

The least useful way to read the AI industry is to look at whoever sits atop the benchmarks this month and assume they will own the future. The more important trend points the other way: intelligence is getting cheap, fast.

Epoch AI's *The Plunging Price of Thought* makes the dynamic explicit. The cost of reaching a fixed level of model performance has been collapsing, often by an order of magnitude or more per year. What only a frontier model could do at a premium price becomes, a short time later, something a smaller and cheaper model does routinely.

The implication matters more than any single leaderboard: **intelligence is becoming a commodity.** What is scarce today is abundant tomorrow, and once a capability becomes abundant, the frontier moves somewhere else.

We have already watched this happen with chat. We are watching it happen now with coding. The interesting question is where the frontier goes next. My answer is that it moves in two steps. First to **agency**: systems that do things rather than explain how to do them. Then to **organization**: large groups of specialized agents that coordinate like a team, a department, and eventually a company.

## What saturation looks like

General-purpose chat is close to saturated for ordinary users. That does not mean progress has stopped. Models still differ in mathematics, writing, research, and multimodal reasoning. But for summarizing a document, drafting an email, explaining a concept, or translating a paragraph, several models are simply good enough.

Once five systems can all produce an acceptable answer, being 10% better on a benchmark matters far less commercially than it did when only one or two could do the task at all. Saturation does not mean improvement ends. It means marginal improvement becomes less visible and less valuable to the typical customer, and competition moves up a level.

## Coding is the frontier of 2026

Coding is where model differences still matter most, because code is unforgiving. A model cannot get by on plausible language. It has to understand a codebase, trace a bug across files, make changes, run tests, interpret failures, and recover from its own mistakes over long chains of steps. That makes coding an unusually demanding test of reasoning, tool use, memory, and persistence.

But the direction is clear. Within a year or so, I expect the gap between the leading coding models and the rest to narrow sharply, and most major models to handle the bulk of everyday software work.

"Coding will be solved" does not mean software engineering disappears. Architecture, product judgment, ambiguous requirements, security, and system design remain hard. The claim is narrower and economic: **what we now treat as premium AI coding ability will become a standard feature.** Building features, fixing bugs, writing tests, refactoring, and navigating a repository will stop differentiating one model from another. Asking which model is the best coder will start to sound like asking which model can write a decent email.

Coding matters for a second reason, too. Code is how software gains leverage over the digital world. A model that programs well can build its own tools and reshape the environment it operates in. Coding is less a destination than a bridge.

## Frontier one: from intelligence to agency

The basic pattern of the chatbot era was *prompt → answer*. Coding agents moved us to *task → work → result*. The next step is *intent → action → outcome*.

You no longer ask how to plan a trip; you ask for the trip to be planned and booked. You no longer ask which laptop to buy; you state a budget and preferences and approve the purchase at the end. You no longer ask for a draft reply to a customer; the system reads the account history, resolves the issue, updates the records, responds, and follows up.

Chat products sell intelligence. Agents sell **completed work**.

Once models are smart enough, the bottleneck becomes reliability in the world. Can the system operate software and websites? Hold context across hours or days? Recover when something breaks? Recognize when it needs human approval? Handle money, identity, permissions, and private data safely? Ultimately: can you trust it enough to delegate?

These are systems problems more than intelligence problems, and they compound. An agent that is 99% reliable per step is only about 37% reliable across a hundred steps. That arithmetic is why a few benchmark points matter less than error detection, verification, and graceful recovery.

## Frontier two: from agents to organizations

Autonomous agents may themselves be an intermediate step. The more consequential shift comes when we stop picturing one agent helping one person and start picturing hundreds or thousands of agents working together.

A single agent has the limits any individual has: finite context, finite attention, finite specialization. Human organizations exist to get around exactly those limits. No company runs on one infinitely capable employee. It runs on specialists in engineering, sales, finance, legal, and operations, coordinated by managers and directed by executives who allocate resources and decide what matters.

AI does not have to stay organized as a single assistant. It can be organized like a firm.

Ask such a system to *launch a product for this customer segment*. One agent researches the market. Another analyzes customer data and tests positioning against simulated buyers. Engineering agents build prototypes while adversarial agents try to break them and a security agent audits the design. A finance agent models unit economics, a marketing agent drafts campaigns, a legal agent reviews regulatory exposure. Manager agents reconcile conflicting outputs, reassign work, and escalate uncertain decisions. At the top, something keeps asking whether the project is still worth doing.

That is not one agent with many tools. It is an organization.

There is a useful economic lens here. The economist Ronald Coase argued that firms exist because coordinating through a hierarchy is sometimes cheaper than contracting through the market. In his view, the size of a firm is set by where those two costs balance. Swarms of agents change both costs at once. If the cost of an additional "employee" falls toward the cost of inference (running the model), and coordination itself can be automated, the natural size and shape of the firm could change in ways we have barely begun to think about.

This is also where the two halves of the argument connect. The plunging price of thought is what makes swarms viable. When intelligence is expensive, you ration it into a single assistant. When it is cheap, you can afford to run five hundred agents, have them check each other's work, and throw away most of what they produce.

## Why architecture may beat IQ

Suppose Model A is 10% better than Model B at individual reasoning. Now suppose a system built on Model B can run 500 specialized agents in parallel, cross-verify their output, route each subproblem to the model best suited for it, and escalate what it is unsure about. It is not obvious that Model A wins.

The human economy works this way. The most productive companies are not the ones whose every employee is the smartest person in the market. They are the ones that best coordinate people, capital, information, and incentives into a working system.

If AI follows the same pattern, the relevant unit of intelligence shifts: first from the model to the agent, then from the agent to the **organization of agents**. Today's benchmark culture would then look like measuring the IQ of individual employees while the real competition is between companies.

The benchmark of the future might look less like a leaderboard and more like a profit-and-loss statement. Can a group of agents run an e-commerce business for a month? Grow revenue without destroying margin? Acquire customers, handle support, negotiate with suppliers, catch fraud, stay within budget, and notice when its own strategy is failing? The ultimate test may not be whether a system can answer a hard question, but whether it can run a business.

## Why picking winners is so hard

The AI market today resembles the internet of the mid-1990s more than a mature industry. It was easy then to see that the internet would be enormous and very hard to see who would win. Portals looked dominant and vanished. Browsers rose and collapsed. Categories that seemed strategic became commodities, while companies whose importance was not obvious became some of the largest in history.

Knowing that AI matters is not the same as knowing who will capture it. If intelligence keeps getting cheaper, model quality may be a surprisingly weak moat.

The recent history of AI search is instructive. For a while, a language model that searched the web, pulled together what it found, and cited its sources felt like its own product category. The startup Perplexity rose on exactly that difference. The broader lesson is that **successful AI features tend to become platform features.** Once a capability proves valuable, every major platform absorbs it. It happened with chat, it is happening with coding, and it will likely happen with agents.

## If intelligence is abundant, what stays scarce?

This is the central economic question. If the price of thought keeps falling, value migrates to whatever intelligence still depends on:

- **Distribution and attention**: being where users already are.
- **Context and memory**: knowing enough about a person or organization to act well on their behalf.
- **Permission and trust**: the right to spend money, sign in, send messages, and make commitments for someone.
- **Access**: to proprietary data, tools, customers, capital, and payment systems.
- **Verification and coordination**: the ability to run many agents and confirm their work is correct.

Seen this way, the incumbents look different: they already hold much of what stays scarce. Google has Search, Android, Chrome, Workspace, YouTube, Maps, payments, and deep user context. Meta has social graphs, messaging, creators, and advertisers at the scale of billions. Microsoft has enterprise identity, Office, GitHub, Azure, and corporate workflows. Apple controls one of the most valuable personal computing surfaces in existence.

Agents need somewhere to act, and on someone's authority. The model may become replaceable. The system around it may not.

## From copilots to companies

The progression can be put simply:

- **2023–2025:** AI answers questions.
- **2025–2027:** AI completes tasks.
- **After that:** AI coordinates work.

Along the way, the line between software and labor begins to blur. Today, a company that needs ten times the output usually needs many more people. In a world of agent organizations, the marginal worker may be another software instance. A five-person startup could operate with the capacity of fifty; a fifty-person company like five hundred. Eventually we may see businesses whose "employees" are almost entirely artificial, with humans supplying capital, goals, relationships, governance, and final authority.

How fast this happens is genuinely uncertain. Reliability, liability, and trust may slow it more than capability does. But the direction matters, because it changes the question we should be asking.

It is no longer *can the model write the software?* It is *can the system use software, build software, coordinate other agents, allocate resources, and pursue an objective over long periods?* And beyond that: *how large an organization can a single person effectively direct through AI?*

That may be one of the defining economic questions of the next decade. If it is, the most important measure of AI will not be how intelligent a single model seems in conversation. It will be how much of the economy a coordinated system of models can actually run.
