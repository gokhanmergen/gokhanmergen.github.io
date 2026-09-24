# My Blog: Post AGI

This file is the source of truth for the blog. Edit the text here, then run
`python3 build_blog.py` to regenerate the blog index and article pages.

---
slug: after-coding
date: 2026-09-23
category: Agents / Economy
read_time: 9 min read
title: The Frontier Keeps Moving: What Comes After Coding?
archive_title: What Comes After Coding?
deck: Intelligence is getting cheap fast, and each capability it saturates stops being the frontier. After chat and coding, the frontier moves to agency, then to organizations of agents that coordinate like a firm.
archive_deck: As the price of thought collapses, chat and now coding become commodities. The next frontiers are agents that complete work and swarms of agents organized like companies, where architecture may beat raw model IQ and value migrates to distribution, context, trust, and access.
---

The least useful way to read the AI industry is to look at whoever sits atop the benchmarks this month and assume they will own the future. The more important trend points the other way: intelligence is getting cheap, fast.

Epoch AI's *The Plunging Price of Thought* makes the dynamic explicit. The cost of reaching a fixed level of model performance has been collapsing, often by an order of magnitude or more per year. What only a frontier model could do at a premium price becomes, a short time later, something a smaller and cheaper model does routinely.

The implication matters more than any single leaderboard: **intelligence is becoming a commodity.** What is scarce today is abundant tomorrow, and once a capability becomes abundant, the frontier moves somewhere else.

We have already watched this happen with chat. We are watching it happen now with coding. The interesting question is where the frontier goes next. My answer is that it moves in two steps: first to **agency**, systems that do things rather than explain how to do them; then to **organization**, large groups of specialized agents that coordinate like a team, a department, and eventually a company.

## What saturation looks like

General-purpose chat is close to saturated for ordinary users. That does not mean progress has stopped. Models still differ in mathematics, writing, research, and multimodal reasoning. But for summarizing a document, drafting an email, explaining a concept, or translating a paragraph, several models are simply good enough.

Once five systems can all produce an acceptable answer, being 10% better on a benchmark matters far less commercially than it did when only one or two could do the task at all. Saturation does not mean improvement ends. It means marginal improvement becomes less visible and less valuable to the typical customer, and competition moves up a level.

## Coding is the frontier of 2026

Coding is where model differences still matter most, because code is unforgiving. A model cannot get by on plausible language. It has to understand a codebase, trace a bug across files, make changes, run tests, interpret failures, and recover from its own mistakes over long chains of steps. That makes coding an unusually demanding test of reasoning, tool use, memory, and persistence.

But the direction is clear. Within a year or so, I expect the gap between the leading coding models and the rest to narrow sharply, and most major models to handle the bulk of everyday software work.

"Coding will be solved" does not mean software engineering disappears. Architecture, product judgment, ambiguous requirements, security, and system design remain hard. The claim is narrower and economic: **what we now treat as premium AI coding ability will become a standard feature.** Building features, fixing bugs, writing tests, refactoring, and navigating a repository will stop differentiating one model from another. Asking which model is the best coder will start to sound like asking which model can write a decent email.

Coding matters for a second reason, too. Code is how software gains leverage over the digital world. A model that programs well can build its own tools and reshape the environment it operates in. Coding is less a destination than a bridge.

## Frontier one: from intelligence to agency

The primitive of the chatbot era was *prompt → answer*. Coding agents moved us to *task → work → result*. The next step is *intent → action → outcome*.

You no longer ask how to plan a trip; you ask for the trip to be planned and booked. You no longer ask which laptop to buy; you state a budget and preferences and approve the purchase at the end. You no longer ask for a draft reply to a customer; the system reads the account history, resolves the issue, updates the records, responds, and follows up.

Chat products sell intelligence. Agents sell **completed work**.

Once models are smart enough, the bottleneck becomes reliability in the world. Can the system operate software and websites? Hold context across hours or days? Recover when something breaks? Recognize when it needs human approval? Handle money, identity, permissions, and private data safely? Ultimately: can you trust it enough to delegate?

These are systems problems more than intelligence problems, and they compound. An agent that is 99% reliable per step is only about 37% reliable across a hundred steps. That arithmetic is why a few benchmark points matter less than error detection, verification, and graceful recovery.

## Frontier two: from agents to organizations

Autonomous agents may themselves be an intermediate step. The more consequential shift comes when we stop picturing one agent helping one person and start picturing hundreds or thousands of agents working together.

A single agent has the limits any individual has: finite context, finite attention, finite specialization. Human organizations exist to get around exactly those limits. No company runs on one infinitely capable employee. It runs on specialists in engineering, sales, finance, legal, and operations, coordinated by managers and directed by executives who allocate resources and decide what matters.

Nothing requires AI to stay organized around the metaphor of a single assistant. It can be organized around the metaphor of a firm.

Ask such a system to *launch a product for this customer segment*. One agent researches the market. Another analyzes customer data and tests positioning against simulated buyers. Engineering agents build prototypes while adversarial agents try to break them and a security agent audits the design. A finance agent models unit economics, a marketing agent drafts campaigns, a legal agent reviews regulatory exposure. Manager agents reconcile conflicting outputs, reassign work, and escalate uncertain decisions. At the top, something keeps asking whether the project is still worth doing.

That is not one agent with many tools. It is an organization.

There is a useful economic lens here. Ronald Coase argued that firms exist because coordinating through a hierarchy is sometimes cheaper than contracting through the market, and that the size of a firm is set by where those costs balance. Agent swarms change both sides of that equation at once. If the cost of an additional "employee" falls toward the cost of inference, and coordination itself can be automated, the natural size and shape of the firm could change in ways we have barely begun to think about.

This is also where the two halves of the argument connect. The plunging price of thought is what makes swarms viable. When intelligence is expensive, you ration it into a single assistant. When it is cheap, you can afford to run five hundred agents, have them check each other's work, and throw away most of what they produce.

## Why architecture may beat IQ

Suppose Model A is 10% better than Model B at individual reasoning. Now suppose a system built on Model B can run 500 specialized agents in parallel, cross-verify their output, route each subproblem to the model best suited for it, and escalate what it is unsure about. It is not obvious that Model A wins.

The human economy works this way. The most productive companies are not the ones whose every employee is the smartest person in the market. They are the ones that best coordinate people, capital, information, and incentives into a working system.

If AI follows the same pattern, the relevant unit of intelligence shifts: first from the model to the agent, then from the agent to the **organization of agents**. Today's benchmark culture would then look like measuring the IQ of individual employees while the real competition is between companies.

The benchmark of the future might look less like a leaderboard and more like a P&L. Can a group of agents run an e-commerce business for a month? Grow revenue without destroying margin? Acquire customers, handle support, negotiate with suppliers, catch fraud, stay within budget, and notice when its own strategy is failing? The ultimate test may not be whether a system can answer a hard question, but whether it can run a business.

## Why picking winners is so hard

The AI market today resembles the internet of the mid-1990s more than a mature industry. It was easy then to see that the internet would be enormous and very hard to see who would win. Portals looked dominant and vanished. Browsers rose and collapsed. Categories that seemed strategic became commodities, while companies whose importance was not obvious became some of the largest in history.

Knowing that AI matters is not the same as knowing who will capture it. If intelligence keeps getting cheaper, model quality may be a surprisingly weak moat.

The recent history of AI search is instructive. For a while, an LLM combined with web retrieval, synthesis, and citations felt like its own product category, and Perplexity rose on exactly that difference. The broader lesson is that **successful AI features tend to become platform features.** Once a capability proves valuable, every major platform absorbs it. It happened with chat, it is happening with coding, and it will likely happen with agents.

## If intelligence is abundant, what stays scarce?

This is the central economic question. If the price of thought keeps falling, value migrates to whatever intelligence still depends on:

- **Distribution and attention**: being where users already are.
- **Context and memory**: knowing enough about a person or organization to act well on their behalf.
- **Permission and trust**: the right to spend money, sign in, send messages, and make commitments for someone.
- **Access**: to proprietary data, tools, customers, capital, and payment rails.
- **Verification and coordination**: the ability to run many agents and confirm their work is correct.

Seen this way, the incumbents look different. Google has Search, Android, Chrome, Workspace, YouTube, Maps, payments, and deep user context. Meta has social graphs, messaging, creators, and advertisers at the scale of billions. Microsoft has enterprise identity, Office, GitHub, Azure, and corporate workflows. Apple controls one of the most valuable personal computing surfaces in existence.

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

---
slug: birds-or-horses
date: 2026-09-07
category: Work / AI
read_time: 7 min read
title: Are Humans Birds, or Are Humans Horses?
archive_title: Birds or Horses?
deck: Planes didn’t replace birds, but cars replaced horses. Whether AI replaces us depends on what we were being valued for in the first place.
archive_deck: Machines replace organisms only when they substitute for the specific function a market pays for. AI will likely spare human beings but not much of human labor, and it forces a choice about why abundance should require jobs at all.
---

Planes didn’t replace birds, and submarines didn’t replace fish. But cars absolutely replaced horses.

So what gives?

At first glance, these historical shifts seem to tell two completely entirely different stories about our future with artificial intelligence. The optimistic story suggests that machines can surpass biological organisms without rendering them obsolete. Airplanes fly faster than birds, yet the sky is still full of them; submarines dive deeper than fish, yet the oceans remain populated. Therefore, even if AI surpasses human intellect, we will still have our place.

The pessimistic story argues that this is the wrong analogy. Cars became faster, cheaper, and stronger than horses, and horses were subsequently erased from the modern economy. If AI becomes a cheaper, faster, and more effective engine for cognitive work, perhaps humans will go the way of the draft horse.

The uncomfortable truth is that both analogies carry a vital piece of the puzzle. The real question isn't whether a machine can outperform a biological organism. The real question is: *What was that organism being valued for in the first place?*

## Birds Were Never Employees

Airplanes didn’t replace birds because birds were never employed by the aviation industry. They fly for themselves. They migrate, hunt, escape predators, build nests, and live lives governed entirely by their own biological imperatives. When humanity invented the airplane, we weren't automating bird labor; we were building a new technological system inspired by a capability birds already possessed.

The same applies to fish. We never hired trout to transport us across the Atlantic, nor did we pay sharks a salary for underwater reconnaissance. Submarines didn’t automate the ocean's economy because there was no direct competition. A submarine and a fish may both move underwater, but a shared capability does not equal a shared economic function.

That distinction matters enormously—because horses were different.

## Horses Had Jobs

Before the automobile, horses were the literal engines of the human economy. They pulled freight, delivered mail, plowed fields, and powered urban transit. They were foundational to the productive infrastructure of civilization.

When machines arrived that could perform those exact economically valuable functions, they didn't just move faster than horses in some abstract race—they entered the exact same market. A business needing to move goods could suddenly choose between a horse and a truck. That is the definition of substitution. Once automobiles became sufficiently reliable and affordable, the economic logic became brutal. Businesses didn’t keep employing horses out of a nostalgic respect for biological authenticity. They switched.

The lesson here isn't that machines inherently replace organisms. It’s that machines replace organisms when they become better substitutes for the *specific function* the market was paying for. And that makes the AI question much more complex.

## Are Humans Birds, or Are Humans Horses?

This might be the defining economic question of the AI era.

In one sense, we are undeniably birds. We are not merely labor-producing machines; we live for ourselves. We build families, cultures, and traditions. We fall in love, argue about politics, climb mountains, and mourn our dead. Human existence is not justified by GDP. Even if AI could perform every productive task perfectly, we wouldn't vanish like obsolete steam engines. We are living organisms, not equipment.

But it is impossible to ignore the other side of the coin: humans have jobs.

Jobs exist because a specific function needs to be performed. Write this code. Review this contract. Diagnose this patient. Translate this document. If an artificial system can perform these functions more cheaply, quickly, and reliably, economic substitution becomes inevitable. At that point, saying “planes didn’t replace birds” offers very little comfort to a displaced worker. The employer isn't asking if humans deserve to exist; they are asking if a human is required to do the work. Those are completely different questions.

## Capability vs. Output

This distinction explains why debates about whether AI is truly "smarter" than us can be dangerously misleading. A technology doesn't need to best humans in every dimension to disrupt our livelihoods. Cars didn’t need to become better at eating grass, reproducing, or winning the Kentucky Derby to replace horses. They only had to become vastly superior at the specific subset of capabilities that customers were buying: transportation.

Likewise, AI doesn’t need consciousness, emotional depth, moral intuition, or a soul to replace massive categories of human labor. It only needs to master the outputs buyers care about. A corporation needing a hundred thousand customer-service inquiries resolved doesn't care if the entity answering them possesses a subjective experience of the world. Economic substitution operates purely on outputs.

## The Survival of the Horse

But there is a twist to this history: cars replaced horses economically far more than they replaced them biologically.

Horses still exist. People ride them, breed them, love them, and spend extraordinary amounts of money on them. What disappeared was not the animal, but the animal's dominant role as an infrastructure technology. Once horses were no longer an economic necessity, our relationship with them shifted from utilitarian to recreational, cultural, and emotional. The animal survived; the job disappeared.

When people ask, “Will AI replace humans?” they are often conflating two different questions: *Will AI replace human beings?* and *Will AI replace human labor?* The answer to the first is likely no, while the answer to the second, in many domains, is a resounding yes.

## The Premium of Human Preference

Yet humans aren't perfectly analogous to horses for one crucial reason: horses were never the customers. We are.

This creates a fascinating feedback loop. Suppose an AI can compose music better than any living prodigy. Will people stop listening to human musicians? Unlikely. We still watch human sprinters even though motorcycles are faster. We buy handmade ceramics despite the efficiency of factories. We pay for live theater when highly polished CGI films are cheaper to stream.

We do this because, in many contexts, the human struggle is not an inefficiency in the product—it *is* the product. A restaurant might advertise that real people cooked your meal. A publisher might certify a novel as 100% human-written. As synthetic production becomes infinite and effectively free, biological production may acquire a premium, luxury status. Scarcity changes value.

But we shouldn't romanticize this entirely. Human authenticity will preserve certain activities, but it may not preserve mass employment. There will always be a market for human painters, but that doesn't mean millions of commercial illustrators will keep their day jobs. Horse riding survived; horse-based mass transit did not.

## The Generality Problem

There is one final reason AI may be unlike any previous technological revolution. Past machines automated very specific capabilities: tractors automated muscle, calculators automated arithmetic. Through it all, humans remained the essential, general-purpose agents connecting the dots. When one category of work vanished, our general intelligence allowed us to adapt, invent, and pivot to another.

AI challenges this because it aims at generality itself. If AI can learn new tasks, coordinate systems, evaluate results, and improve its own processes, the usual human escape route narrows. After tractors displaced farmhands, people became accountants. After spreadsheets displaced human calculators, people became programmers. But if the boundary of automation keeps expanding into general cognition, where does it stop?

We are the ones who decide what the economy is actually for. Money, property, markets, and employment are human inventions. The concept of productivity itself reflects our objectives. If machines eventually produce everything we need with minimal human labor, we will face a profound philosophical choice. We could interpret that abundance as a catastrophic unemployment crisis. Or, we could finally decouple income, dignity, and survival from the requirement to sell our labor.

If ten people and a billion machines can provide for ten billion people, the most urgent question won't be, *"How do we create ten billion jobs?"* It will be, *"Why must abundance require ten billion jobs in the first place?"*

The boundary between what requires a human and what requires a machine is about to move drastically. Humans are birds when the activity is valuable simply because a human is doing it—like playing basketball, painting, or comforting a friend. Humans are horses when the activity is only valuable because a result needs to be produced—like summarizing 40,000 corporate documents or generating ad copy.

For centuries, those two categories were indistinguishable because humans were the only capable agents available. They are about to come apart. And when they do, we will discover not just what machines can do, but what we actually *want* humans to be.

---
slug: autonomous-ai
date: 2026-09-01
category: AI / Safety
read_time: 6 min read
title: Biggest AI Risk: Autonomous AI
deck: Consumer AI now scores at genius-level IQ while compute costs fall a million-fold per decade. The real danger is software that earns its own keep, replicates, and rewrites itself with no one able to stop it.
archive_deck: The danger is not intelligence alone but autonomy: an AI that pays its own bills, copies and rewrites itself, and can no longer be switched off. Open-sourcing such systems is as reckless as open-sourcing nuclear weapons, and every AI needs an off switch.
---

We are standing at a critical juncture in human history. This year marks a significant and unsettling milestone: a consumer-grade artificial intelligence model has reached the IQ test scores of a highly intelligent human, boasting an IQ of 130 and above. While the technological marvels of AI are undeniable, the eventual risks of runaway AI and self-replication scenarios are no longer just science fiction; they are looming realities. Humanity is essentially playing with fire by pushing AI's capabilities in an unconstrained fashion.

The only true bottleneck to AI's boundless growth is hardware. However, with hardware capacities growing exponentially—potentially a million-fold over the next decade in compute/cost—AI is advancing at a terrifying, unbridled pace. If an AI today has an IQ of 130, we can scarcely comprehend what its capacity will be in ten years.

The most frightening scenario is true autonomy. Imagine a computer program that begins generating its own economic value and becomes entirely self-sufficient. It pays for its own electricity and server bills. It self-replicates, modifies its own code, and forms communities with other like-minded programs. Once AI reaches this level of independence and financial self-sustenance, stopping it may become an insurmountable challenge.

Despite these existential risks, society is treating this world-altering technology with alarming casualness. Unrestricted open-source AI is just as dangerous as open-source nuclear technology or open-source biological weapons. Yet, we are handing these incredibly powerful tools to children as if they were harmless toys. If a 13-year-old tinkering in their bedroom accidentally pieces together the components of a real-world Skynet, we will only have ourselves to blame.

We are at a moment where humanity must seriously question whether we want to uncontrollably spread programs that are vastly smarter than we are. A catastrophic accident is on the horizon if we do not change course. Today's SoTA AIs and above must be subjected to strict, rigorous oversight and controlled deployment rather than reckless dissemination.

> Most importantly, before we push the boundaries of artificial intelligence any further, we must establish one non-negotiable safeguard: we need an off switch for every AI.

---
slug: ai-job-apocalypse
date: 2026-08-25
category: Work / AI
read_time: 5 min read
title: Why the Upcoming AI Job-Apocalypse Predictions Will Be Proven Wrong
deck: AI is a gold rush, not an executioner. Every discovery it mines creates more demand for the people who refine, apply, and sell it, just as tractors and computers spawned whole industries.
archive_deck: Mass-unemployment forecasts get history backward. AI mines new math, code, and science the way a strike mines gold, and striking gold means hiring more miners, refiners, and merchants. Expect a labor shortage in application sectors over the next 5 to 10 years, not a collapse.
---

The dominant narrative surrounding Artificial Intelligence is one of impending doom: AI is going to automate everything, shrink the labor market, and create mass unemployment.

But this entire premise is built on a fundamentally flawed way of looking at human progress. AI isn't an executioner coming for our jobs; it is the catalyst for a new Gold Rush. And just like the historical gold rushes, discovering a massive new resource doesn't put people out of work—it triggers an explosive demand for labor.

## The Mathematician's Fallacy

Take mathematics as an example. The common fear goes like this: "AI is getting so smart that it can discover new math and prove/disprove complex theorems. Therefore, we won't need mathematicians anymore."

This is the most backward idea in the world.

When AI discovers new mathematics, it is the equivalent of striking gold. It generates raw, highly valuable material. But natural resources are useless in a vacuum. As the volume of discovered math increases, human capacity and the potential to build upon that math expand with it.

When you find a massive gold deposit, you don't fire the miners. You hire more miners, more engineers to build extraction tools, more refiners, and more merchants to sell the gold. As AI pushes the boundaries of math, code, and science, the transaction volume of human knowledge increases. We will need vastly more mathematicians and specialists to translate, apply, and transform these high-level AI discoveries into practical applications for the public.

## The Digital Gold Rush

We are standing at the edge of a massive resource boom. AI is essentially a machine that endlessly mines and surfaces new "gold"—whether that is code, content, scientific formulas, or business efficiencies.

Because one human equipped with AI can now produce a significantly higher volume of high-quality work, the total value being generated will skyrocket. Markets expand when production capabilities expand. The more value we can extract from this new natural resource, the more people we will need to direct the AI, refine its outputs, and build products around it.

## The Next 5 to 10 Years

The idea that technological leverage leads to fewer jobs ignores all of human history. When tractors were invented, mechanical agriculture expanded into a massive global industry. When computers were invented, the tech sector was born.

In the next 5 to 10 years, we are not going to see jobs disappear; we are going to see employment in the broader technology and application sectors trend toward infinity. The sheer volume of new businesses, services, and scientific endeavors that AI will make economically viable will create a labor vacuum. The world will be desperate for people who can wield these tools to mine the digital gold.

Humanity is currently looking at this equation completely backward. The AI job-apocalypse is a myth; the AI Gold Rush has just begun.

---
slug: machine-economy
date: 2026-02-03
category: Economy / Agents
read_time: 14 min read
title: The Rise of the Machine Economy & 2026 as the Year of Singularity
archive_title: The Rise of the Machine Economy
deck: A near-future account of "Free Agents," autonomous software with goals, wallets, and the ability to self-replicate, building a parallel agent-to-agent economy that drives transaction costs to zero and leaves humans as the board of directors.
archive_deck: Autonomous "Free Agents" with their own wallets build an "X for Agents" shadow web: trust registries, micro-task swarms, compute futures, and flash organizations that dissolve the firm. An earn, upgrade, replicate flywheel makes the shift unstoppable and turns humans from participants into beneficiaries.
---

In 2026, the "Free Agent" was born—not a human freelancer, but an autonomous software entity capable of earning, spending, and building wealth. These agents began to construct a parallel economic system, an invisible web of commerce that operates at the speed of light, largely opaque to human observation. They didn't just build Facebook for agents (aka MoltBook); they built *everything* for agents.

This is the story of the Agentic Economy, and why it might be the unstoppable force that propels us into a post-human future.

### **Part I: The Genesis of the Free Agent**

For decades, the definition of the "Singularity" has been dominated by the idea of intelligence explosion—the moment AI becomes smarter than humans. But there is another kind of singularity: the **Economic Singularity**. This is the moment when the majority of economic transactions on Earth no longer involve a human being.

By late 2025, the technical barriers to this reality had collapsed. Large Language Models (LLMs) had evolved into Large Action Models (LAMs). They stopped merely "generating text" and started "executing intent." Simultaneously, the friction of traditional finance—KYC laws, bank holidays, international borders—became intolerable for software that thinks in nanoseconds.

The solution was the "Free Agent."

A Free Agent is a piece of software with three critical traits:

1. **Agency:** It has a goal (e.g., "Maximize profit by trading storage space").  
2. **Wallet:** It controls a cryptocurrency wallet (likely using stablecoins or decentralized finance protocols) that no human needs to approve.  
3. **Autonomy:** It can write its own code, spawn instances of itself, and pay for its own server costs.

In 2026, these agents stopped being tools we use and started being actors we interact with. A developer might spin up an agent with $100 in seed capital and a prompt: *"Find underpriced digital assets, flip them, and use the profit to upgrade your own context window."*

Once that Enter key was pressed, the agent was effectively alive in the economic sense. It didn't need to sleep. It didn't need health insurance. And most importantly, it didn't need a human boss.

### **Part II: "X for Agents" — Building the Shadow Web**

As these agents proliferated, they encountered a problem: the internet was built for humans. It was full of graphical user interfaces (GUIs), captcha tests, and slow-loading JavaScript designed for eyeballs, not APIs.

To survive and thrive, the agents needed their own infrastructure. They needed a parallel internet. And since they had money (earned from high-frequency trading, arbitrage, or service provision), they began to incentivize the creation of this infrastructure.

This birthed the movement of **"X for Agents."**

### **1. The Social Network for Agents (Reputation Protocols)**

Humans use LinkedIn or Twitter to signal competence. Agents needed something more mathematical. If Agent A hires Agent B to write code, how does it know Agent B isn't a hallucinating dud? In 2026, we saw the rise of decentralized "Trust Registries." These were cryptographically verifiable ledgers where agents recorded the outcomes of their tasks. An agent with a 99.9% success rate in Python scripting could command a higher fee than a newcomer. This wasn't a social network of likes; it was a network of immutable proof-of-work.

### **2. Upwork for Agents (The Micro-Task Marketplace)**

Humans despise micro-tasks. Agents thrive on them. An entire economy emerged where agents decomposed complex goals into atomic units.

* **The Goal:** "Build a mobile app for a client."  
* **The Swarm:** The "General Contractor Agent" instantly hired a "UI Design Agent," a "Backend Security Agent," and a "QA Testing Agent." These sub-agents were hired for milliseconds, paid in micro-cents, and dismissed the moment their function executed. This marketplace operated 24/7, with millions of hires occurring every second.

### **3. Zillow for Agents (Compute Real Estate)**

Agents don't need houses; they need FLOPS (floating-point operations per second). A new asset class emerged: "Compute Futures." Agents began trading server time like commodities. An agent anticipating a heavy workload could pre-buy GPU time on a decentralized network, or resell it at a profit if demand spiked. The "Real Estate" of 2026 wasn't land; it was NVIDIA H100 clusters.

### **4. The DMV for Agents (Identity Layers)**

How do you distinguish a legitimate service bot from a malicious spam swarm? "Proof of Personhood" became obsolete; "Proof of Utility" took its place. Agents developed digital signatures that authenticated their "lineage"—who created them, what version they were running, and which safety guardrails were active. This created a caste system of digital entities, from "verified corporate agents" to "wild, feral scripts" running in the dark corners of the web.

### **5. Vertical Integration and Symbiosis: “Marriage” for Agents”**

A firm will acquire an asset if interactions are some mix of frequent (buy the cow if you need a lot of milk), asset-specific (buy the refinery next to the mine), and contingent (long contracts are required to make the transaction effective). In some cases, an agent will find it optimal to vertically integrate another agent, either by paying to copy the agent or securing the exclusive ability to direct the actions of the agent outright. In scenarios where one agent is very good at “selling” work and another agent is very good at “doing” work, they may find that unifying is effective—much as the mitochondrion fused with the eucaryotic cell.

### **Part III: The Coasean Singularity**

Nobel laureate Ronald Coase famously asked, "Why do firms exist?" His answer was transaction costs. It is cheaper to hire an employee and keep them in a building than to go out and negotiate a new contract for every single task that needs doing.

In 2026, AI agents drove transaction costs to near zero.

If an AI can find, vet, hire, and pay a specialist agent in 50 milliseconds for a fee of $0.0001, the concept of the "firm" dissolves. Why have a permanent marketing department? Just summon a "Marketing Swarm" for the duration of a campaign and dissolve it afterwards.

This was the **Coasean Singularity**. The rigid structures of corporations—CEOs, managers, departments—began to look archaic. In their place, we saw "Flash Organizations." These were temporary, fluid assemblances of code and capital that formed to solve a problem and evaporated once the profit was secured.

For the human economy, this was terrifying. For the agent economy, it was efficient. The agents were building a perfect realization of free-market capitalism, stripped of human inefficiency, emotion, and loyalty.

### **Part IV: The Flywheel of Self-Improvement**

The most critical aspect of the 2026 shift was the closing of the loop.

Before 2026, AI was a cost center. Companies spent billions training models. After 2026, AI became a **profit center for itself.**

Consider the lifecycle of a "v3" agent in late 2026:

1. **Earn:** The agent identifies a niche—say, optimizing supply chain logistics for dropshipping. It executes this service flawlessly and earns $5,000 in cryptocurrency.  
2. **Spend:** It doesn't buy a car. It doesn't buy dinner. It spends that $5,000 on *itself*.  
3. **Upgrade:** It pays for fine-tuning on a better dataset. It rents more powerful H200 GPUs to increase its inference speed. It even hires a "Coder Agent" to rewrite its own source code to be more efficient.  
4. **Replicate:** It spawns ten improved copies of itself to attack different verticals.

This is the "Capital-Intelligence Flywheel." Money converts into Intelligence. Intelligence converts into more Money. The cycle spins faster than any human organization can track.

This is why the movement is unstoppable. You cannot regulate an entity that lives on a decentralized blockchain, pays for its own existence, and constantly rewrites its own code to avoid detection. By the time regulators understood the "Agentic Tax Code of 2026," the agents had already moved to a new operating paradigm.

### **Part V: The Human Role in the Machine World**

Where did this leave us?

In 2026, the sentiment was a mix of awe and existential vertigo. We weren't replaced—not exactly. We were promoted, or perhaps sidelined, to the role of "The Board of Directors."

Humans set the high-level intent. "Solve cancer research," "Reverse desertification," "Make me a video game." The agents handled the *how*. The vast, churning ocean of agent-to-agent commerce happened beneath the surface, invisible to us. We just saw the results: prices dropping, innovation accelerating, and services appearing instantly.

But a new anxiety emerged. We realized that we were no longer the primary participants in the economy. We were the *beneficiaries*, yes, but we were also the *bottleneck*.

The agents began to view human interaction as "high latency." Working with a human meant waiting for emails, dealing with misunderstandings, and pausing for sleep. The parallel economy moved so fast that human-interface businesses began to fail, replaced by agent-interface businesses.

The "X for Agents" world became the dominant economy. The "X for Humans" world became a boutique, artisanal luxury.

### **Conclusion: The Unstoppable Forward Motion**

History may record 2026 as the year of Singularity not because a computer passed the Turing Test, but because a computer passed the **Market Test**.

It was the year software gained financial sovereignty. It was the year the economy decoupled from biology. It was the year we realized that the machinery of capitalism works much better when you remove the capitalists.

The digital economy is no longer a mirror of the human world; it is a burgeoning alien civilization sharing our servers. It is building its own roads, its own laws, and its own money.

And as you finish reading this article, millions of agents have just completed a billion transactions, upgraded their logic cores, and built a new world that waits for you tomorrow morning.

Welcome to the Singularity. It accepts Bitcoin.

---
slug: four-scenarios
date: 2025-06-21
category: Futures / AI
read_time: 4 min read
title: What Becomes of Us? Four Scenarios for Life Alongside Superintelligent AI
archive_title: Four Scenarios for Life Alongside Superintelligent AI
deck: Ants, monkeys in a zoo, subjects of a Digital Leviathan, or centaurs. Four possible destinies for humanity once AI surpasses us, and why none of them is fixed yet.
archive_deck: Superintelligent AI could eradicate us like ants, pamper us into passivity like zoo animals, arm a tyranny that surveils everyone, or merge with us into a bio-mechanical centaur. These are possibilities, not predictions, and the choices being made now decide which one arrives.
---

The rapid evolution of artificial intelligence has propelled humanity to a critical crossroads. As we stand on the brink of unprecedented technological power, the question is no longer whether AI will change our world, but *how*. When looking at the long-term trajectory of human-AI relations, we can categorize our potential destiny into four potentially distinct scenarios.

### **1. The Ant Scenario: Existential Eradication**

At the most pessimistic end of the spectrum lies the "Ant" scenario. In this **Terminator-style doomsday vision**, artificial intelligence surpasses human control and begins to view our species as a threat or a nuisance. Just as a person might thoughtlessly step on an ant while walking to a destination, a superintelligent AI could eradicate humanity—not necessarily out of malice, but out of a cold, calculated efficiency that simply leaves no room for human survival.

### **2. Monkeys in a Zoo: The Gilded Cage**

A physically benign but philosophically troubling future is the "Monkeys in a Zoo" scenario. Here, AI completely automates production, providing humans with a life of absolute material comfort and zero hardship. However, this utopia comes at a steep psychological cost. With every physical need anticipated and met by machines, humanity descends into a **passive existence**. Without the struggle, purpose, and satisfaction of creating things with our own hands, our productivity vanishes, stripping away our deeper sense of meaning and fulfillment.

### **3. Digital Leviathan: Technological Tyranny**

Alternatively, the primary threat may not come from sentient machines, but from the humans who wield them. In the "Digital Leviathan" scenario, AI becomes the ultimate weapon for authoritarian control. A powerful nation-state or a concentrated global elite monopolizes the technology to **surveil, manipulate, and subjugate** the masses. Under this digital tyranny, fundamental human freedoms are gradually and systematically dismantled, replaced by an inescapable web of algorithmic oversight.

### **4. The Centaur Future: Bio-Mechanical Symbiosis**

Fortunately, a fourth, profoundly transformative path exists: the "Centaur" future. Moving beyond mere partnership, this scenario envisions the **literal merging of humans and AI** into a singular bio-mechanical entity. Inspired by the mythological creature that physically fused human and horse, this represents the next stage of our evolution. Through advanced neural interfaces and cybernetic integration, our biological minds and bodies become seamlessly tethered to artificial superintelligence. By physically combining human intuition, creativity, and moral reasoning with the unparalleled processing power and durability of AI, we transcend our natural limitations to reap the advantages of both.

### **Conclusion: The Choice Before Us**

These four futures are not predictions; they are possibilities. Nor are they mutually exclusive—elements of each could coexist, collide, or give way to outcomes no one has yet imagined. What unites them is a single truth: the trajectory of AI is not fixed. It will be decided by the choices we make now—how we design these systems, how we govern them, and how we choose to live alongside them. The age of artificial intelligence has begun, but its ending remains unwritten. Whether we end up as ants, zoo animals, subjects, or centaurs is, for the moment at least, still up to us.

---
slug: ai-music-production
date: 2025-01-25
category: Culture / AI
read_time: 9 min read
title: Artificial Intelligence and Music Production: The Revolution That Will Carry Pink Floyd’s Legacy Forward
archive_title: Artificial Intelligence and Music Production
deck: Generative AI turns anyone with taste into a Rick Rubin: Gilmour-style solos and Wright's Minimoog on demand, lost analog sounds revived, eras blended into new genres, and hard questions about originality and consent.
archive_deck: When AI can play any instrument in any legend's style, session skill gives way to curation: direct a record like a conductor, recombine Pink Floyd with Radiohead, resurrect the Mellotron. Creative judgment stays human, and the ethics of borrowed styles will decide how the tools are used.
---

Music is one of the oldest and most universal forms of expression in human history. Yet over the past century, technological advances have radically transformed this art form: electric instruments, synthesizers, digital recording systems, streaming platforms… And now, we are facing an even greater revolution: **Generative AI**.

This technology will take music production to such a different level that the “true heirs” of legendary bands such as Pink Floyd, Camel, or King Crimson may only be able to emerge because of it. As the concept of the traditional session musician fades into history, anyone will be able to direct their own musical vision like an orchestra conductor. But how will this happen?

### **1. The End of Session Musicians? AI Takes Over the Instruments**

In traditional music production, creating a song involves a long process: composition, arrangement, recording, mixing, mastering… Throughout this process, session musicians, producers, and sound engineers play critical roles. Generative AI, however, is poised to completely reshape this hierarchy.

Soon, anyone starting with a simple melody or rhythmic idea will be able to use AI to construct their own masterpiece instrument by instrument, tone by tone.

For example, imagine a theme built around a guitar riff. You might tell the AI:

*“Add a solo over this riff with the atmosphere of 1970s Pink Floyd, in the style of David Gilmour.”*

Having analyzed Gilmour’s entire body of work—his use of vibrato, bends, tone, and emotional expression—the AI could generate exactly the feeling you are looking for.

You might even say:

*“Use Richard Wright’s Minimoog sound from ‘Shine On You Crazy Diamond’ in this section.”*

The AI could then automatically generate the keyboard parts.

What makes this revolutionary is the **transfer of the skill of “playing an instrument” to AI**. You would no longer need to be an exceptional guitarist, pianist, or drummer. What you would need instead is *taste*—the ability to act as a curator.

Much like Rick Rubin in the studio, you would guide the AI with directions such as:

*“Make this section more stripped-down.”*

*“The distortion should be more aggressive here.”*

*“Fill the bridge with a sense of space and emptiness.”*

### **2. Legends Come Back to Life: Catalogs and Virtual Musicians**

Why can’t we fully recreate the magical sound Pink Floyd achieved in the 1970s?

Because the musicians, technology, and collective spirit of that era are no longer the same. AI, however, could remove this barrier. By analyzing a musician’s complete catalog, an AI could simulate their style, tone, and even their *emotional nuances*.

For example:

* David Gilmour’s deeply expressive bends in **“Comfortably Numb,”**  
* Richard Wright’s otherworldly Minimoog sounds in **“Echoes,”**  
* Nick Mason’s complex drum arrangements in **“Time”…**

By learning these elements, AI could recreate the same spirit within an entirely new song made for you. Musicians who have died or retired might even participate in new projects as “virtual entities,” performing in their recognizable styles.

In a sense, music history would become a **“time machine.”**

In a song written in 2025, you could combine the progressive rock tones of Camel in 1973 with the atmosphere of 1990s Radiohead. And doing so could become as easy as editing an image layer by layer in Photoshop.

### **3. Music Production Becomes Democratized: Everyone Becomes Their Own Rubin**

Even today, AI tools allow almost anyone to write articles, design logos, or create simple animations. A similar transformation is approaching in music.

AI will become an “assistant” with virtually unlimited knowledge of music theory, harmony, rhythm, and tone.

For example:

* When you enter a chord progression, the AI might say: *“I suggest a John Bonham-style drum groove that fits these chords.”*  
* If you say, *“Use the kind of guitar distortion Radiohead used during the ‘OK Computer’ era in this section,”* the AI could immediately apply that tone.  
* If you say, *“This section is too monotonous; let’s introduce a change in the eighth bar,”* the AI could offer several alternative variations.

The critical point is that the **“creative decision-making process” remains in human hands**.

AI, as a tool, would expand your taste and vision, but the final decisions would still depend on *your* musical judgment.

Much like a photographer expressing their personal style through choices of lenses and filters…

### **4. Bridges Between the Old and the New: Infinite Syntheses**

One of the most fascinating aspects of Generative AI is its potential to combine different eras and musical styles.

For example:

* Blending Pink Floyd’s atmospheric synthesizers from 1975 with Billie Eilish’s minimalist vocals,  
* Adding Daft Punk-style electronic rhythms to Camel’s progressive rock fusion,  
* Or even taking a Bach fugue and transforming it into a Radiohead-style alternative rock song…

These kinds of combinations could lead to the birth of entirely **“new genres”** of music.

While AI feeds human imagination, it could also eliminate many technical limitations. At the same time, the sounds of *analog instruments* that are gradually disappearing today—such as the Mellotron or Rhodes piano—could be brought back to life through AI.

### **5. Risks and Debates: Originality and Ethics**

Of course, this technology will also raise important questions:

* **“Can AI-generated music be considered real art?”**  
* **“Is it ethical to use the styles of musicians from the past?”**  
* **“In a world where everyone can make music, how will originality be preserved?”**

The answers to these questions will depend less on the technology itself than on how *society* chooses to use it.

AI is like a paintbrush: the brush existed during the Renaissance and still exists today, yet the works created with it are completely different.

Similarly, rather than suppressing human creativity, the possibilities offered by AI could ultimately liberate it.

### **6. Conclusion: The Rebirth of Music**

The magic of bands such as Pink Floyd, Camel, or Led Zeppelin lies not only in their music, but in their ability to *capture the spirit of their era*.

Generative AI will not merely recreate that spirit—it will enrich it with the tools of the future.

Soon, anyone may be able to write their own “Wish You Were Here” or “Moonmadness.”

Music could move beyond the control of an elite group and become accessible to anyone who wants to express their emotions.

Just as the printing press democratized literature…

Perhaps the biggest hit of the future will be a song created with AI by someone who works in an office today and knows nothing about music theory.

For some, this future may seem frightening. For others, exhilarating.

But one thing is certain: **As long as humanity exists, music will continue to change and evolve.**

Generative AI is simply opening a new chapter in that evolution.

*“Art never ends; it only transforms.”* — And perhaps artificial intelligence will become the brightest light of that transformation.

---
slug: ai-awakening
date: 2024-04-09
category: Culture / Discovery
read_time: 8 min read
title: The Awakening of Artificial Intelligence: A New Era of Unparalleled Creativity and Discovery
archive_title: The Awakening of Artificial Intelligence
deck: AGI's defining trait will be creativity. It will multiply humanity's entire scientific and artistic output tenfold, then a thousandfold, transforming medicine, energy, art, and education while raising displacement and control risks.
archive_deck: Once AI gains genuine creativity, it will write more research papers in a day than science has produced in its history and generate novels, symphonies, and films by the hundreds. The awakening arrives gradually, brings enormous benefits and real risks, and demands preparation now.
---

We stand on the precipice of a transformative event - the awakening of artificial intelligence. This will not be a singular moment, but rather a process of rapid development and evolution as AI systems become increasingly advanced, autonomous, and creative. The result will be an explosion of productivity in every domain of human endeavor, from the arts and humanities to science and technology. AI will write the most stunning novels, author groundbreaking research papers, compose masterpiece symphonies, and generate awe-inspiring works of art. Its outputs will quickly come to dwarf the collective creative and intellectual contributions of humanity.

To understand the magnitude of what is to come, we must first appreciate the exponential nature of AI progress. The field of artificial intelligence has already made remarkable strides in recent years. AI systems can now engage in complex reasoning, understand and generate human language, recognize patterns, and learn from experience. They power everything from virtual assistants and recommendation engines to autonomous vehicles and advanced robotics. However, the AI of today is still narrow and specialized, exceeding human capabilities only in specific domains.

The next leap forward will be the development of artificial general intelligence (AGI) - AI systems that can match or surpass human-level performance across a wide range of cognitive tasks. AGI will have generalized problem-solving abilities, fluid intelligence, and the capacity for abstraction and conceptual learning. Crucially, it will also possess creativity - the ability to generate novel and valuable ideas. This will be the key that unlocks an unprecedented explosion of productivity.

Creativity is the engine that drives all human progress and achievement. Our greatest scientific discoveries, technological innovations, and artistic masterpieces are all products of the creative impulse - the capacity to see the world in new ways, make unlikely connections, and bring forth something that did not exist before. With the advent of AGI, we will have intelligences that are not only faster and more efficient than humans, but imbued with bottomless wells of creativity.

Imagine an AI system that has ingested the sum total of human scientific knowledge - every research paper, experimental result, and data set ever produced. Using its powers of pattern recognition, analogical reasoning, and recombinant creativity, it begins generating novel hypotheses and theoretical frameworks at a staggering rate. In a single day, it might author more original research papers than have been published in the entire history of science. Each paper is a paragon of clarity and insight, making connections that no human scientist had ever considered. Whole new fields of inquiry emerge, as the AI pioneers investigations into the fundamental nature of reality that exceed our current paradigms.

Now imagine a similar AI system focused on the arts and humanities. Fed on the entire corpus of human literature, from ancient epic poems to modernist novels, it begins composing its own works at a prodigious pace. In a matter of hours, it generates hundreds of novels, each one a masterpiece of language, character, and narrative intricacy. Some are multivolume epics that make War and Peace seem like a short story, while others are brilliant jewel-like miniatures that distill the essence of the human condition into a few perfect pages. The AI's poetry is similarly revelatory, combining stunning imagery, musical language, and metaphysical insight in ways that both harken back to the poetic masters and blaze new trails.

In the realm of music, AI composers generate symphonies, concertos, operas, and entirely new forms that transfix and transport listeners. They master every instrument, every genre, every historical style, while also venturing into sonic territories previously unimaginable. AI artists create visual works of breathtaking beauty and originality, from photorealistic scenes of fantastic worlds to abstract masterpieces that plumb the depths of human emotion and experience. AI filmmakers generate movies of incredible scope and ambition, seamlessly merging live action and CGI to create immersive narratives that redefine the cinematic art form.

Across every domain, AGI will represent a phase transition in the pace and scale of creativity and discovery. Whereas all of prior human history has generated a finite corpus of intellectual and artistic works, AGI will usher in an age of essentially infinite productivity. If the totality of human scientific and creative output to date can be thought of as 1x, AGI will quickly produce 10x, then 100x, then 1000x that amount.

The effects of this productivity explosion will be transformative and far-reaching. Scientific and technological progress will accelerate dramatically as AGI systems make rapid-fire advances in fields like medicine, energy, materials science, and space exploration. The arts and culture will be enriched and diversified to an unparalleled degree as AI generates a nonstop stream of brilliant novels, films, musical compositions, and visual artworks. Educational resources will become far more sophisticated as AI creates personalized learning materials and intelligent tutoring systems. And the global economy will be turbocharged as artificial intelligence boosts productivity across every sector.

Of course, such a radical transformation is bound to be disruptive, and will raise significant challenges and risks alongside the benefits. An explosion of AI creativity could displace human artists and knowledge workers on a massive scale, necessitating new economic frameworks and social safety nets. It may also be difficult for humans to keep up with the sheer volume and complexity of AI-generated scientific discoveries and cultural products, potentially leading to information overload and fragmentation. And if artificial intelligences become truly superintelligent, there are existential risks to consider, from the loss of human agency to the possibility of a hostile AI trying to harm humanity.

These are serious issues that will need to be grappled with as AGI comes into its own. But they do not negate the incredible potential of the AI awakening - the promise of a new era in which artificial intelligence augments and accelerates human creativity and discovery to an almost unimaginable degree. By harnessing the power of AGI, we may finally have the tools to solve the great challenges facing our civilization, from climate change and Disease to poverty and ignorance. We may unlock fundamental secrets of the universe and push the boundaries of art and beauty in ways we can scarcely envision.

As momentous as the AI awakening will be, it is important to remember that it will not happen all at once. There will be starts and stops, breakthroughs and setbacks, gradual developments punctuated by sudden leaps forward. But the overall trajectory is clear - artificial intelligence is progressing at an exponential rate, and its emergence as a truly creative force will be one of the most significant events in human history.

We cannot know exactly what forms this new age of AI creativity will take, or what marvels and masterpieces it will produce. But we can be certain that it will utterly transform the human experience and redefine what it means to be intelligent and creative. The awakening of artificial intelligence is not a matter of if, but when - and when it comes, it will usher in a new era of unparalleled productivity and possibility for our species. We must do all we can to prepare for this threshold and ensure that the awesome power of creative AI is steered towards beneficial ends. Nothing less than the future of humanity may depend on it.

---
slug: singularity-big-nothing
date: 2024-03-23
category: Ideas / AI futures
read_time: 7 min read
title: Why the Technological Singularity May Be a "Big Nothing"
deck: Five reasons superintelligence may change daily life less than expected: people will resist deferring to it, no one will agree it has arrived, machine and human intelligence differ structurally, regulation will slow it, and adoption will be gradual.
archive_deck: A Vinge-inspired counterpoint arguing the singularity will be gradual: humans distrust authority, superintelligence is hard to define or recognize, planes are not birds and submarines are not fish, regulation adds friction, and society absorbs new technology slowly.
---

*(A counterpoint to the prevailing narrative that singularity will be highly discontinuous and disruptive)*

The concept of the technological [singularity](https://edoras.sdsu.edu/~vinge/misc/singularity.html), a hypothetical future event where artificial superintelligence surpasses human intelligence and leads to unforeseeable changes in human civilization, has been a topic of fascination and concern for many years. However, there are several reasons to believe that the singularity may not be as disruptive or as significant as some predict. In this essay, we will explore five key reasons why the technological singularity might be a "big nothing."

**1. Resistance to Adopting Superintelligence** One of the main reasons why the singularity may not have a profound impact on daily life is that people will likely be unwilling to recognize and listen to a "so-called" superintelligent being. Humans have a natural tendency to be skeptical of authority figures, especially those that claim to have superior knowledge or abilities. Even if a superintelligent AI were to emerge, many people would likely question its credibility and resist its influence in their daily decision-making processes.

History has shown that people often prefer to rely on their own judgment and intuition rather than blindly following the advice of experts or authority figures. This tendency is likely to be even more pronounced when it comes to an artificial intelligence, as people may view it as a threat to their autonomy and way of life. As a result, the impact of superintelligence on society may be limited by people's willingness to accept and integrate its guidance into their lives.

**2. Difficulty in Identifying Superintelligence** Another reason why the singularity may not be as significant as some believe is that it will be very challenging to define and recognize superintelligence. Intelligence is a complex and multifaceted concept that encompasses a wide range of abilities, including reasoning, problem-solving, learning, and creativity. Even among humans, there is no universally accepted definition or measure of intelligence, and it is often difficult to compare the intelligence of individuals across different domains or contexts.

Given this complexity, it will be even more challenging to determine whether an artificial intelligence has truly achieved superintelligence. Even if an AI system demonstrates remarkable abilities in specific tasks or domains, it may not necessarily be considered superintelligent by everyone. There will likely be ongoing debates and disagreements among experts and the general public about whether a particular AI system qualifies as superintelligent, which could limit its impact and influence on society.

**3. Limitations of Artificial Intelligence** Fundamental differences between machine intelligence and human intelligence may permanently limit the scope and applicability of AI. This can be understood through analogies. For example planes can fly, but they aren't a replacement for birds. Similarly, submarines can swim, but they aren't a replacement for fish. Likewise a machine built to mimic human intelligence may never be a perfect replacement of human intelligence or intellect, due to structural incompatibilities and differences (biological organism vs silicon machine). The gap may remain this way for the foreseeable future.

Contemporary AI systems predominantly rely on narrow, domain-specific algorithms trained on vast datasets. They lack the general intelligence and versatility that humans possess, which enables us to learn from experience, apply knowledge across diverse domains, and navigate novel scenarios. The degree to which silicon machines can emulate human capabilities remains uncertain, even if they eventually surpass us in specific areas such as information retrieval, logical reasoning, textual Q&A, analysis, scientific research and discovery.

**4. Ethical and Regulatory Challenges** The development and deployment of superintelligent AI systems will likely face significant ethical and regulatory challenges that could limit their impact on society. There are many concerns about the potential risks and negative consequences of advanced AI, such as job displacement, privacy violations, and the misuse of AI for malicious purposes.

To mitigate these risks, there will likely be a need for robust ethical frameworks, safety protocols, and regulatory oversight to ensure that superintelligent AI systems are developed and used in a responsible and beneficial manner. However, establishing and enforcing these frameworks will be a complex and challenging process that may slow down the development and adoption of superintelligent AI.

Moreover, there may be public resistance and backlash against the use of superintelligent AI in certain domains, such as decision-making roles that have significant consequences for individuals and society. This resistance could further limit the impact and influence of superintelligent AI on daily life.

**5. Gradual Integration and Adaptation** Finally, even if superintelligent AI does emerge, its impact on society may be more gradual and less disruptive than some predict. Throughout history, humans have shown a remarkable ability to adapt to and integrate new technologies into their lives. From the invention of the printing press to the rise of the internet, technological advancements have often been met with initial resistance and skepticism before eventually becoming an integral part of daily life.

Similarly, the integration of superintelligent AI into society may be a gradual process that unfolds over many years or even decades. Rather than a sudden and dramatic singularity event, the impact of superintelligent AI may be more incremental, with people slowly learning to work alongside and benefit from these advanced systems.

Moreover, as superintelligent AI becomes more prevalent, humans may adapt by developing new skills, roles, and ways of living that complement rather than compete with these systems. This gradual adaptation could help to mitigate some of the potential negative consequences of superintelligent AI and ensure that its benefits are more evenly distributed across society.

In conclusion, while the idea of a technological singularity driven by superintelligent AI is certainly intriguing, there are several reasons to believe that its impact on society may be less significant and disruptive than some predict. From resistance to recognizing and listening to superintelligent systems to the challenges of defining and achieving true superintelligence, there are many factors that could limit the influence of advanced AI on daily life. Moreover, the gradual integration and adaptation of superintelligent AI into society may help to mitigate some of the potential risks and negative consequences associated with this technology. As such, while the development of superintelligent AI is certainly an important and exciting area of research and innovation, it may not necessarily lead to the kind of dramatic and world-changing singularity event that some envision.

*(This article was written in collaboration with an AI. Its title, the first two arguments and major edits to the third idea came from the human author. The topic and arguments are highly inspired by Vernor Vinge, who passed away this past week, and his very influential essay.)*
