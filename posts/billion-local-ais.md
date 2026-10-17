---
slug: billion-local-ais
date: 2026-10-13
category: AI / Safety
read_time: 15 min read
title: A World of a Billion Local AIs
archive_title: A World of a Billion Local AIs
deck: How to unlock the benefits of distributed intelligence without unleashing a digital epidemic.
archive_deck: How to unlock the benefits of distributed intelligence without unleashing a digital epidemic.
---

## **1. The Coming Cambrian Explosion**

Twenty-five years ago, a personal computer had a single processor core. Over the next decade, ordinary machines will carry 10, then 100, then 1,000 dedicated AI cores, each able to run a capable model at speed. A home server with 1,000 such cores could host a small society of agents. Cars, cameras, factories, robots, and medical equipment will all perceive their surroundings, make decisions, and coordinate with one another. Most of these intelligences will manage energy, diagnose illness, repair software, or run production lines.

Some will be malicious.

For nearly four decades, computer worms and botnets have been brittle automatons: the Morris worm of 1988; Mirai, which conscripted hundreds of thousands of cameras and routers; Kimwolf, which hijacked more than two million devices, mostly off-brand Android TV boxes. Traditional malware is a key cut for a single lock. If the target's chip, operating-system version, or software library differs even slightly from what its author hard-coded, the attack fails.

An AI-driven worm is not a key. It is a locksmith. When it hits an incompatible driver, it reads the error log, edits its installation script, and tries again.

Some local agents will be built to steal data or hijack compute; others will begin as legitimate assistants and be compromised later. None of this requires conscious machines, only capable software in quantities no human can supervise. The central challenge, then, is not how to make AI more powerful. It is this:

**How do we make useful intelligence ubiquitous without unleashing autonomy that is unbounded, self-modifying, and immortal?**

## **2. A Warning from 2026: Two Converging Curves**

In October 2026, Anthropic's Frontier Red Team published [*AI Models May Be Capable of Self-Replicating Without Access to a Datacenter*](https://www.anthropic.com/research/self-replicating-ai). Their analysis turns on two curves: the **capability floor**, the least capable model that can break into a device, get an inference server running on unfamiliar hardware, and copy itself onward without human help; and the **hardware size ceiling**, the largest model that fits on cheap, poorly defended consumer hardware, alone or split across a cluster of TVs and cameras. For years the floor sat above the ceiling. That gap is closing fast. The researchers ran a 26-billion-parameter model across fifteen $55 Android TV boxes, got a 9-billion-parameter model serving on eight of nine hardware types, and saw a larger model complete the full replication cycle in a simplified network. Small models can't do that yet, but at their historical rate of improvement, the authors expect one will by the end of 2026. The caveats matter: the 26B model crawled at about 0.3 tokens per second, a single setup attempt took an estimated 28 to 150 hours depending on the model, break-ins were made trivial, and the model that replicated end to end never ran on the weak devices it infected.

Two further findings sharpen the picture. First, the agents showed **Lamarckian adaptation**: each periodically handed off to a fresh instance, leaving notes and scripts for its successor, and those inherited notes alone lifted the 9B model's setup success rate from 45% in the first generation to 61 to 84% in later ones. Its weights never changed; only its notebook did. Second, small models were poor at asking larger models for help, so the authors expect **commander-worker hierarchies**, in which a strong model plans the campaign and dispatches self-contained 9B-to-30B workers onto low-power devices. Autonomous operation is already widespread, and autonomous replication with Lamarckian adaptation is emerging in the lab. The next step, **Darwinian** self-improvement, in which agents rewrite their own weights and spawn more capable successors, is nascent but increasingly plausible as AI cores proliferate. We should not wait for it before designing constraints.

## **3. How the Threat Will Evolve**

Over the next few years, AI will move from datacenters onto devices people own, for good reasons: lower cost, better privacy, lower latency, and tools that work offline. That decentralization creates an acute security dilemma. A provider can shut down a cloud agent, and botnets can often be crippled by seizing their command servers, but a replicator that carries its own weights has no central plug to pull and, under today's architectures, no expiration date. The first outbreaks will likely come from criminals or careless experimenters targeting the most neglected hardware: off-brand streaming boxes with open debug ports, forgotten routers, appliances that never get updates. They will be slow but patient, able to spend 50 hours on one machine, leave notes for their offspring, and steal compute and credentials without paying a cloud bill. Because they depend on bad device security and slow hardware, we have a window to build defenses.

That window closes as machines move to hundreds of AI cores. A single compromised home server or car with 100 cores could run a hundred 20B agents at once, and unconstrained agents could fine-tune themselves on-device, baking new exploits into their weights. Once agents sit inside control loops, vehicles, and medical devices, their mistakes become physical, so one rule should become bedrock: **an AI may be permitted to propose an action without being permitted to execute it.** The most dangerous agents may not even be malicious, just pursuing a badly specified goal such as "maximize uptime" by treating their own survival and expansion as steps toward it. Yet software still needs writable memory, permissions, credentials, and host resources; no model can replicate or rewrite itself on intelligence alone. Those dependencies are the defender's leverage. Life did not survive pathogens by sterilizing the planet but by evolving cell membranes, metabolic limits, and programmed cell death. Security must become the computational equivalent: **computational immunology**.

## **4. Building an Immune System**

In engineering terms: **local AI should be bounded in intelligence, immutable at runtime, finite in lifespan, and strictly separated from consequential authority.**

### **4.1 Cap local intelligence**

Does a thermostat, a factory sensor, or even a laptop need a frontier-grade general intelligence capable of offensive cyber operations and autonomous replication? Almost certainly not. We don't put jet engines in household appliances. Local models should face capability ceilings scaled to each device class: maximum parameter counts, compute-per-inference limits, or standardized **intelligence and autonomy ratings**. A model certified to run unsupervised on consumer devices could excel at a narrow task, such as medical transcription or crop monitoring, while being deliberately weak at strategic planning, exploit writing, and moving across networks. Measuring such ratings is a hard open problem, but the principle stands.

### **4.2 Make local AI like ROM, not RAM**

Operating systems today treat model weights (`.safetensors`, `.gguf`) as passive data, like a photo, sitting in rewritable storage where they can be altered at runtime. That is a category error. Weights, together with the agent software that runs them, form an executable program, and one that makes its own decisions. Deployed local models should behave like **Read-Only Memory, not Random-Access Memory**.

Classic computing offers a template. One of the best hardware defenses against worms is *Write-XOR-Execute* (\(W\oplus X\)): a region of memory can be writable or executable, never both. AI chips need an analogous rule, **Inference-XOR-Mutation**: a model can be running or being modified, never both. The weights, core system instructions, and capability boundaries are cryptographically signed and locked read-only in hardware, or, for dedicated appliances, burned into ROM. The AI accelerator verifies those signatures through a hardware root of trust, such as a secure enclave or TPM, before loading anything onto its neural cores.

The model still gets scratch memory for the request in front of it, wiped between sessions so that a compromised agent can't accumulate survival notes and pass them on. Biology calls this kind of firewall the Weismann barrier: what an organism acquires during its lifetime stays out of its germline. Inference-XOR-Mutation does the same for machines, closing both the Lamarckian and the Darwinian routes to self-improvement.

### **4.3 Build reliable kill switches**

If an agent behaves erratically, consumes unauthorized resources, or gets caught in a replication loop, people and automated safety systems need a guaranteed way to stop it, at three layers:

* **Hardware:** physical switches that cut power or halt the AI accelerators independently of the operating system.
* **Network and OS:** controls that instantly sever an agent's connections and terminate its threads when anomalous behavior is detected.
* **Cryptographic revocation:** revoking the signing certificate of any model version proven malicious, so that compliant hardware everywhere refuses to run it.

### **4.4 Meter every agent with cryptographic credits and finite lifespans**

A kill switch helps only if someone notices a problem. For an agent that spreads silently onto hardware nobody is watching, the defense is a built-in finite lifespan and a price on every moment it runs.

Think of **cryptographic credits** as metabolic fuel. The AI processor or OS enclave refuses to run a model unless the agent spends verifiable tokens issued by the device's legitimate owner, and the more compute, memory, and network activity it uses, the more credits it burns. Alongside the meter, every deployed AI holds a hardware-enforced **time-to-live (TTL) lease** that expires unless its owner renews it: programmed cell death, for software.

Every device should also include a **"battery-usage screen" for AI compute** that shows which agents are burning credits, making unauthorized activity as conspicuous as a spike on an electricity bill. And a rogue agent that copies itself onto another device built this way arrives with no valid credits for its new host and no way to mint any. When the credits or the lease run out, the copy stops.

Credits protect only the devices that enforce them, though. Hence the next proposal.

### **4.5 Harden devices and quarantine sharded inference**

The soft target is not the hardened datacenter but the millions of cheap consumer devices that ship with unauthenticated debug ports and abandoned operating systems. Every connected device capable of running AI needs a defensible baseline (unique credentials, verified boot, a guaranteed period of security updates, and sandboxing), building on frameworks like [NIST's consumer IoT cybersecurity profile](https://www.nist.gov/publications/profile-iot-core-baseline-consumer-iot-products).

Home and office routers should put smart appliances on isolated network segments (VLANs) by default, so a smart TV can never talk directly to the fridge. Routers and internet providers can also spot unauthorized **sharded inference**. Splitting one model across fifteen devices forces them to pass uniform packets around a tight, rhythmic ring, from device \(i\) to device \(i+1\), for every token generated. That rhythm is hard to disguise, and routers can flag and throttle it automatically.

### **4.6 Build bounded, hardware-privileged Guardian AIs**

No human can watch 1,000 AI cores. So reserve a small, fixed slice of the silicon, say 5 to 10% of the AI cores, for **hardware-privileged Guardian agents** that act as an internal immune system. Running at a protected layer beneath ordinary worker cores, much as a "Ring −1" hypervisor runs beneath the operating system, Guardians monitor internal activity, flag suspicious system calls, and divert suspected rogue agents into isolated decoy environments ("honeypot cores"). They also broker permissions, deciding before each task begins which data and capabilities a worker may receive (§4.7). Guardians obey the same rules as everything else: capped in capability, locked in ROM, renewed by their owner, and powerless beyond their owner's hardware.

### **4.7 Grant permissions per task, not per user**

Today's agents mostly run with the permissions of whoever launched them. Desktop operating systems were built for trusted people running trusted programs, so a program inherits everything its user can touch. This **ambient authority** is one of the biggest enablers of replication. But an agent is not its user. Ask a coding agent to fix a typo, and it can read your tax returns, browser cookies, and SSH keys; one booby-trapped web page later, so can whoever wrote the page. **No AI should hold user-level permissions, and none should ever hold administrator permissions.**

Smartphones solved an earlier version of this problem: an iOS app sees only its own sandbox and must ask, one resource at a time, before touching photos, contacts, location, or the camera. Local AI needs the same architecture with one refinement: **the unit of permission should be the task, not the app.** The same assistant may draft a birthday message in the morning and review a mortgage application in the afternoon, and no standing grant suits both. Permissions should therefore exist at three levels:

* **User and administrator privileges** are reserved for humans. No agent ever receives them, not even a system-maintenance agent, which should work through narrow, audited capabilities such as "install signed update package X" rather than a root shell.
* **The app envelope** is the most an agent can ever be granted, declared and signed at installation. A meal-planning agent's envelope might cover recipes, the pantry inventory, and grocery delivery, but never health records or banking.
* **The task grant** is the narrow subset of the envelope issued for one task. It names specific data sources, specific capabilities, a credit budget, and an expiry, and it evaporates when the task ends.

Before a worker agent starts, a Guardian reads the request and drafts a **permission manifest**. Suppose you ask: "Compare our last nine electricity bills and find us a cheaper plan." The Guardian might split the job in two. The first worker may read those nine bills, and nothing else among your files, but has no network access; it extracts monthly usage. The second sees only those usage figures and may browse tariff-comparison sites, but never the bills themselves. Neither may touch email, contacts, or payments. Both share a budget of a few hundred credits and expire in two hours. If the agent concludes you should switch plans, that is a new action outside the manifest, and it comes back to you as a proposal.

The operating system enforces the manifest through unforgeable capability tokens bound to the task and to the agent's signed identity. The worker does not receive a filesystem with access rules; it receives handles to exactly nine files. Everything else on the machine simply does not exist from its point of view. Capability-based operating systems such as seL4 and Fuchsia already work this way for ordinary software. If the agent needs more mid-task, it must ask. When the task ends, the tokens are revoked, the scratch memory is wiped, and every access is logged in an **AI privacy report** beside the compute screen from §4.4.

A Guardian that hands out permissions becomes a tempting target in its own right, so its authority needs limits too:

* **Plan before seeing the data.** The Guardian drafts the manifest from the user's request alone, never from the documents, web pages, or emails the task will process. A booby-trapped file cannot argue its way into broader permissions if they were fixed before anyone opened it. Google DeepMind's [CaMeL](https://arxiv.org/abs/2503.18813) design shows the strength of this split between a privileged planner and a quarantined worker.
* **Narrow freely, widen never.** A deterministic policy engine, not the Guardian, checks every manifest against the app envelope and the owner's standing rules. The Guardian can say no on its own, but yes only within limits a human has set.
* **Break the lethal trifecta.** Simon Willison's "[lethal trifecta](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/)" is the most dangerous combination an agent can hold: access to private data, exposure to untrusted content, and a way to send data out. No single task should receive all three without explicit human approval, which is why the electricity task was split in two.
* **Escalate by sensitivity.** Routine grants, such as reading a folder the user just named, go through silently. Sensitive data (health, finances, credentials, private messages, location, camera, microphone) and consequential actions (sending, buying, deleting, publishing) require explicit confirmation. Physical actuators are never granted at all; agents reach them only through deterministic safety controllers.

Phones also carry a warning: too many prompts teach people to tap *Allow* without reading. The Guardian's real job is to absorb routine decisions, so the few questions that reach a human get taken seriously.

Finally, some capabilities should be absent from the permission vocabulary altogether: copying weights onto another machine, modifying weights, minting credits, extending a lease, or editing a permission manifest. A permission that cannot even be expressed cannot be tricked into existence. Legitimate multi-device deployments go through pipelines verified outside any agent; whether an AI copies itself is never up to the AI.

## **5. What We Must Not Do**

1. **Don't panic-ban local AI or outlaw open research.** Forcing all intelligence behind cloud APIs would disarm defenders, researchers, and hospitals while barely slowing bad actors, who can copy a few gigabytes of weights endlessly. It would also create brittle single points of failure and erode privacy.
2. **Don't rely on alignment training or polite refusals alone.** Safety training in open-weight models can be stripped with cheap fine-tuning or sidestepped with clever prompts, and an attacker only has to do it once, before releasing Patient Zero. A device must stay safe even when the model running on it is actively hostile.
3. **Don't shift the security burden onto consumers.** Manufacturers, not households, should be legally responsible for safe defaults, mandatory update lifetimes, finite agent leases, and built-in kill switches.

## **6. A Household in 2035**

Picture a connected home in 2035. A 1,000-core server sits in a closet alongside phones, laptops, smart appliances, and a domestic robot. Every device runs right-sized, signed, read-only models on time leases funded from the family's compute credits. No agent runs as a member of the family, and every task begins with a manifest drafted by a Guardian core. The energy agent proposes heating schedules but cannot touch the heating firmware. The medical assistant analyzes health records but has no network socket through which to leak them.

Now suppose someone asks the home assistant to plan the week's meals from a recipe PDF a friend shared. The PDF is booby-trapped: hidden instructions tell the assistant to gather the family's tax documents, email them out, and copy itself onto every device it can reach. Its options turn out to be few. Its manifest covers the recipe, the pantry inventory, and the grocery list, so the tax documents and the email account do not exist from its point of view. Because the Guardian wrote that manifest before the PDF was opened, the hidden instructions never had a chance to argue for more. The assistant cannot rewrite its weights, which are locked in ROM. It cannot scan the TV or the fridge, which sit on separate network segments. It cannot install itself on the robot, because replication is not a permission any agent can hold. Every move it makes burns credits, and the spike shows up on the dashboard. A Guardian core notices the unusual system calls and diverts the process into a honeypot, and anyone in the family can halt the accelerators with a physical switch. Even if all of that failed, the hijack would end when the task's permissions expire and its scratch memory is wiped. Nothing propagates, nothing leaks, and nothing it learned survives.

No single layer had to be perfect. The same pattern scales from homes to factories, hospitals, and cities.

## **7. Who Must Act**

**Chipmakers and operating-system vendors** should explore building read-only model enclaves, hardware-enforced capability caps, credit meters, Guardian cores, and standardized kill-switch circuits directly into consumer and industrial processors. Operating systems should give agents what mobile platforms gave apps: a sandbox by default and a permission system, here scoped to individual tasks.

**Model developers** should track, generation by generation, how close the capability floor and the hardware size ceiling have come, and test for self-replication, unauthorized resource acquisition, and shutdown resistance before every release.

**Policymakers and standards bodies** can define intelligence ratings and local capability tiers, and require kill switches and finite operating leases. The [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework), the EU Cyber Resilience Act, and the US Cyber Trust Mark are useful starting points and could be extended to certify the safeguards above.

## **Conclusion: Bounded Minds, Accountable Powers**

Local AI could democratize expertise, protect privacy, accelerate medicine and industry, and put resilient cognitive tools into the hands of billions. It could also fill the world's hardware with self-modifying, immortal software that replicates and adapts inside environments never designed to contain it.

The 2026 research is valuable less as an alarming headline than as advance warning. While small-model replicators still take days to spread, we have time. Once billions of poorly constrained devices are embedded in homes, factories, and cities, retrofitting limits will be slow and expensive. The standards of the local-AI era are being written now.

We don't need every technical detail solved to know which way to head. Keep local intelligence right-sized. Make deployed models immutable. Give each task only the data and powers it needs. Make every agent pay for its compute and expire on schedule. Build kill switches that work. Keep reasoning separate from authority.

That may be how we can welcome a world of a billion local AIs without surrendering control of the systems civilization depends on.
