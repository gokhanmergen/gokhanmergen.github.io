---
title: "Will Cheaper Machine Intelligence Raise Employment? Pre-Analysis Plan for the Empirical Program"
author: "Gökhan Mergen"
date: "October 2026"
version: "1.2 (frozen October 13, 2026)"
---

**Version 1.2, October 13, 2026.** Frozen for registration. The power analysis has been run and its results are in Section 5, and the data checks are complete. The items still marked "[TO FILL: …]" are for the author: the signed confirmations in Section 3, the human raters in Section 7.2, and the registry entry in Section 15. Any later change is recorded as a deviation (Section 14).

## 1. Summary

This plan pre-specifies the empirical companion to Mergen (2026). The paper shows that the elasticity of employment with respect to the effective price of AI services, $p_M/a_M$, is $s_M(\sigma - \varepsilon)$, so a 1 percent fall in that price changes employment by $s_M(\varepsilon - \sigma)$ percent, and that new tasks add a second term, $\Delta \ln \Gamma$. Because AI's cost share is still a few percent, data from 2022–2026 cannot pin down the sign of $\sigma - \varepsilon$. The effects that have appeared also coincide with the rise in interest rates and the shift to remote work.

The program therefore does three things. It estimates what can be measured now, bounds what cannot, and fixes tests in advance for when AI's cost share is larger. Pre-specification has costs as well as benefits (Olken 2015); here its purpose is to make the tests of a contested question checkable. It has six projects:

0. a power analysis;
1. demand elasticities, $\varepsilon$, for cognitive-service industries, from historical cost shocks;
2. the AI exposure of tasks that are new since 2022;
3. a public-data test of whether young workers' employment declines follow automation rather than augmentation;
4. the response of employment, output and labor per unit of output to AI exposure after 2022, a descriptive analysis evaluated with data through 2028;
5. a task-level cost-crossover calibration, which is not a hypothesis test.

## 2. Motivation and Link to the Companion Paper

The paper's results, in its online Appendix A, are the basis for every design here. Holding the wage and labor productivity fixed:

$$
\frac{\partial \ln L}{\partial \ln (p_M/a_M)} = s_M(\sigma - \varepsilon) \quad \text{(A2)}, \qquad \frac{\partial \ln L}{\partial \ln a_L} = s_L(\varepsilon - 1) + s_M(\sigma - 1) \quad \text{(A3)}.
$$

The change in employment splits into a change in output and a change in labor per unit of output (A5):

$$
\Delta \ln L = \underbrace{-\varepsilon\,\Delta \ln p}_{\Delta \ln Q} + \underbrace{\sigma\,\Delta \ln p}_{\Delta \ln (L/Q)} .
$$

With CES technology, as AI's share rises from zero to $s_M$ (A7):

$$
\Delta \ln L = \frac{\sigma - \varepsilon}{\sigma - 1}\,\ln(1 - s_M).
$$

With new tasks, $\Delta \ln L = (\sigma - \varepsilon)\,\Delta \ln C + \Delta \ln \Gamma$ (A10). For junior workers, (A8) governs the agent channel, with $\sigma_{JM}$, and (A9) the copilot channel.

Three facts shape the design.

- **Effects scale with $s_M$.** At a cost share of 5 percent, three of the four cases in the paper's Figure 2 imply employment changes of about 6 percent or less in either direction. Data from 2022–2026 cannot distinguish these cases.
- **The observed effects are confounded.** The clearest effect so far is a decline in young workers' employment in exposed occupations. It coincides with the rise in interest rates from 2022 and with the shift to remote work, and both are correlated with exposure.
- **$\varepsilon$ can be measured now.** It is a property of product demand, not of AI, so any cost shock to an industry identifies it. This is the fourth route in the paper's Table 2.

| Project | Object | Paper equations | Table 2 route | Data period | Status |
| --- | --- | --- | --- | --- | --- |
| 0 | Smallest detectable $\lvert\sigma - \varepsilon\rvert$ | A7 | — | Through 2019 | Design |
| 1 | $\varepsilon$; satiation | A3, A5 | Pass-through (fourth) | Five-year windows 1999–2019 on market-priced industry-years, 1997 shares; legal services from 1987 | Confirmatory |
| 2 | Direction of $\Gamma$ | A10 | — | O\*NET releases | Confirmatory |
| 3 | Agent versus copilot channel for entrants | A8, A9 | — | ACS 2022 and 2024 | Pre-specified replication (gate passed; Section 3) |
| 4 | Output and labor per unit of output | A5, A7 | Output and labor responses (first) | Placebo windows 2001–2019; evaluation 2022–2028 | Descriptive (Section 9.3) |
| 5 | Wage-bill share past the cost crossover | Perfect-substitution case; A10 | Task-level costs (third) | Current prices | Calibration |

The cost-share route (the second row of Table 2) is not attempted. It needs spending on AI services by firm or industry, together with quality-adjusted effective prices, and neither is public.

This plan does not restate the paper's two predictions for 2031 or the six indicators in its Table 3; they stand as written there. Project 3 bears on the entry-level indicator. Project 4 implements the paper's statement that the clearest evidence would be joint movements of output and employment in exposed industries. Project 5 supplies expected values for the indicators under stated assumptions.

## 3. What Has Already Been Seen

- The author wrote the companion paper and has read the published evidence it reviews. This includes Brynjolfsson, Chandar, and Chen (2025, revised August 2026). Their Fact 5 and Table 3 show that, in ADP data from November 2022 to June 2026, young workers' employment declines are concentrated in occupations where Anthropic Economic Index (AEI) usage is mostly "automative", with "augmentative" and overall usage entered jointly. In their Table 3 (March 2025 release), the automation coefficient for ages 22–25 is −0.098 per standard deviation, and it shrinks with age.
- The author has also read their comparison with the 2024 American Community Survey (ACS), in their Section 5 and Online Appendix Tables H.1–H.3. Their ACS results for 22- to 25-year-olds, 2022–2024, are: a gap between the most and least exposed quintiles of $-0.022$ [$-0.055$, $+0.011$], against $-0.132$ in ADP; $-0.047$ with unweighted respondent counts; $-0.213$ [$-0.353$, $-0.072$] within professional, information and financial services; and $+0.245$ [$0.104$, $0.386$] within education, health and public administration. They also note that revisions to the 2024 ACS population controls complicate comparisons of employment totals. These are published post-2019 summaries close to the outcome used in project 3. Project 3 is therefore a replication with a known target. It is not a test of a hypothesis formed without sight of the data.
- The author knows the published aggregate statistics cited in the paper, such as unemployment by exposure quintile and the labor share. These are not the industry-, occupation- or task-level outcomes analyzed here.
- The power analysis used only outcome data through 2019. That includes the pre-period placebo regressions of outcomes on exposure measures, with industry windows starting from 2001 (County Business Patterns) and 1990 (BLS hours), pre-trend controls using data from 1987, and occupation windows within 2012–2019. All were run on October 12, 2026; the industry regressions are listed in `output/power/industry_placebo_regression_disclosure.csv` and the occupation regressions in `P3_placebo_register.csv` and `P4_placebo_register.csv`. The occupation specifications were rerun several times that day while the code was developed, and those reruns are not individually registered.
- Except for the results disclosed under *Parallel analyses* below, no post-2019 outcome data had been examined when the plan was registered. No ACS microdata after 2019 had been read. No industry output, price, hours or employment data after 2019 had been read. Except as listed below, no O\*NET task statement first appearing after 2019 had been scored, tabulated by exposure or read for its AI content. Where a downloaded file contained later years, the cleaned file was truncated at 2019 and later values were not inspected. (The repository's rules, in `README.md`, are: no post-2019 outcome data before registration; no regression of outcomes on AI exposure for any post-2022 period; and downloaded files treated as untrusted data.) [TO FILL: confirmation, signed and dated at registration.]
- Project 1's estimation sample lies entirely before 2020, so the rule above does not protect it. No regression of project 1 outcomes or prices on project 1's instruments, including first stages, was run before registration, and no demand elasticity was estimated. The power analysis computed standard errors of pre-period regressions of industry output and price changes on AI exposure (Table P2), but their point estimates were not printed or saved, and neither was the employment coefficient in the same sample. The sign and rough size of the pre-period output coefficient can nevertheless be inferred from reported placebo means (employment about $-0.25$ and labor per unit of output about $-0.50$ per unit of $\beta$, implying an output coefficient of roughly $+0.25$; about $+0.11$ with BLS hours). That is a regression on AI exposure, not on project 1's instruments.
- The author has examined these exposure measures: the Eloundou et al. (2024) $\beta$, the AEI shares, the Census Business Trends and Outlook Survey (BTOS) AI-use rates, industries' input-output purchase shares of IT services, and BEA Fixed Assets IT intensity. For projects 3 and 4 they are regressors, not outcomes. For project 2, task-level exposure is the outcome: Eloundou's labels exist for tasks in O\*NET 27.0–27.3 (so for a few tasks added in August 2022), and the June 2026 AEI release covers current tasks. Labels and usage for post-2019 tasks were seen only inside distributions over all tasks, during data validation, and were never examined by cohort of first appearance.
- *Incidental exposure during data preparation.* Three small exposures to post-2019 or outcome-adjacent material occurred before registration and are recorded here:
  - Two data rows of a file bundled with the Eloundou et al. repository (OEWS May 2021 employment and wages for two occupations) were printed before the file was deleted. Bundled post-2019 outcome files were then excluded.
  - To check O\*NET's re-numbering of tasks, eight task statements first appearing in release 25.1 (November 2020) and five examples of text edits were printed. They were read only to check whether they were re-numbered tasks.
  - While counting the 103 Task IDs new between O\*NET 27.0 (August 2022) and 31.0 (August 2026) for the literature review, a keyword check of the Task Statements file (not the Emerging Tasks file) found that none mentions AI, and that 6 of all 18,838 current task statements do. The AI-task exclusion of Section 7.3 will therefore remove almost no statements from the release histories. No task was scored for exposure, and no exposure measure was compared across task cohorts.
- *Parallel analyses outside this plan.* On October 12, 2026, other AI-assistant sessions working for the author built a separate empirical project in the author's website repository (folders `pubs/cheaper-intelligence-empirics` and `pubs/cheaper-intelligence-empirical`). According to that project's README, it computed post-2022 outcomes in the families this plan registers: ACS employment by age group and AI exposure, an industry panel of output, hours and employment for 2022–2025, and Quarterly Workforce Indicators hires by age and sector. The assistant that prepared this plan did not open those results, but on October 13, 2026, after the designs and power analysis above were fixed, it was sent three summary numbers from them, which the author has also seen: a gap of $-8.6$ in employment of 22- to 25-year-olds against 35- to 54-year-olds between the top and bottom GPT-4 $\beta$ quintiles (ACS); $-12.6$ percent for the top two against the bottom three quintiles in April–June 2026 (CPS); and $-3.71$ per 0.1 of $\beta$ in an industry dose-response for young workers' employment (Quarterly Workforce Indicators). None uses the AEI automation and augmentation shares of H3, and none concerns project 1's or project 2's outcomes. The author was shown the ACS results on October 12, 2026 [TO FILL: confirm, and list any other results examined]. Under the rule fixed for this case before the author's exposure was known, H3 is therefore registered as a pre-specified replication with a known target and reported outside the primary family, which becomes H1a and H2. The industry dose-response above, and any industry results for 2022–2025 the author has examined, are disclosed again with project 4's descriptive estimate.
- *Preparation with AI assistance.* The data pipelines, the power analysis and drafts of this plan were prepared with AI coding assistants (Anthropic's Claude) working under the author's direction, under the repository rules listed above. Every number in the plan was checked by the author against the code that produced it [TO FILL: confirm at registration].
- *Conflict of interest.* The author is employed by Google, which develops and sells AI products and services. Project 3 uses Anthropic's Economic Index, and the assistants above are Anthropic models. In project 2, the language models that score tasks are chosen by the validation rule in Section 7, not by provider.

## 4. Data Sources and Vintages

Each download is logged in `data/raw/MANIFEST.csv` with its URL, retrieval date and SHA-256. Each result will be reported with the vintages it used.

| Source | Projects | Variables | Vintage | Years used |
| --- | --- | --- | --- | --- |
| BEA GDP by Industry, detail level (bulk files) | 1, 4 | Nominal gross output; chain-type price and quantity indexes; 414 industries | Release of September 30, 2026; historical summary tables from the November 30, 2021 release | 1997–2019; 2013–2028 |
| BEA Input-Output Accounts | 1, 4 | Detail use tables (2007, 2012, 2017 benchmarks on 2017 definitions); summary use tables 1997–2019; IT-services purchase shares | As above | 1997 and benchmark years; 2019–2028 |
| BEA Fixed Assets | 1 | Investment, current-cost stocks and price indexes by asset type for 74 industries | Detailed Data for Fixed Assets, downloaded October 2026 | 1977–2019 |
| BLS detailed-industry productivity (Series Report extraction) | 1 | Output, deflators, hours, employment; 483 industries, 305 with output | Downloaded October 2026, restricted to 1987–2019 at the source | 1987–2019 |
| BLS producer price indexes for services | 1, 4 | Start dates of direct output-price measurement by industry | Downloaded October 2026 | 1985–2019 |
| Census County Business Patterns | 0, 4 | Employment by NAICS, consistent 6- and 4-digit groups | Bulk files | 1998–2019; later years at evaluation |
| Industry employment and hours | 4 | Employment; hours | County Business Patterns (primary, as in the power analysis); Quarterly Census of Employment and Wages annual averages and BLS detailed-industry hours as robustness checks | 2016–2028 |
| Occupational Employment and Wage Statistics (OEWS) | 1, 4, 5 | Industry-by-occupation staffing patterns; wages | May 2019 (staffing); May 2025 (wages, project 5) | — |
| O\*NET database archive | 2 | Task statements in every release; Emerging Tasks (Category, Date, Domain Source); task ratings | Releases 15.0 (July 2010) to 31.0 (August 2026) | All releases |
| Eloundou et al. (2024) labels | 1, 2, 3, 4 | Task-level human and GPT-4 labels (O\*NET 27.2 tasks); occupation $\beta$ | GitHub repository, downloaded October 2026 | — |
| ACS one-year Public Use Microdata Sample (PUMS) | 0, 3 | Employment by age, occupation and class of worker; education; nativity | 2012–2019 (power analysis); 2022 and 2024 (post-period); 2025 when released | — |
| AEI | 3 | Occupation usage; automative and augmentative shares | Release of March 27, 2025 (primary); releases of September 15, 2025, January 15, 2026 and March 24, 2026 (pooled); Hugging Face commit 4e5f69f | — |
| Census BTOS | 4 | AI-use rate by sector | Waves from September 2023; the question's wording changed in November 2025, so the two wordings are kept separate | — |
| Dingel and Neiman (2020) | 3, 4 | Teleworkability by occupation | 2020 | — |
| LLM inference prices | 5 | List prices per million input and output tokens, by model and date | LiteLLM's MIT-licensed vendor price table, monthly, October 2023–October 2026 (primary); Internet Archive captures of OpenRouter's public model list, July 2023–October 2026, used only as an unpublished check because OpenRouter's terms bar copying | — |
| Price paths | 5 | Price at fixed capability; cost of running the frontier model | Cottier et al. (2025), Epoch AI, through February 2025; Gundlach et al. (2026) dataset, April 2024–April 2026 | — |
| GDPval (Patwardhan et al. 2025) | 5 | Model win-or-tie rates; 220 public tasks in 44 occupations | Hugging Face, downloaded October 2026; per-task and per-occupation expert time are not published; the paper's gold-subset means (404 minutes and \$361 per task; review 109 minutes and \$86) and its time distribution are used | — |
| Crosswalks | All | O\*NET-SOC 2009–2010–2019; SOC 2010–2018; ACS occupation codes (2010 and 2018 bases); Census industry codes; NAICS concordances; NAICS to BEA industries | Official files, downloaded October 2026 | — |

## 5. Project 0: Power Analysis

Project 0 states the smallest effect each design could detect and compares it with what the framework implies at current and plausible future cost shares. It was run on October 12, 2026, using only outcome data through 2019. Code is in `code/power/`, results in `output/power/`, and full write-ups in `notes/power-analysis-industry.md` and `notes/power-analysis-occupation.md`.

**Designs.**

- **P1.** Industry long differences of ln employment on predetermined exposure (project 4's employment equation). County Business Patterns six-digit industry groups; exposure is the 2019 staffing-weighted Eloundou GPT-4 $\beta$; the plan's controls; weights by base-year employment; clusters by three-digit NAICS ($G = 83$); six-year windows.
- **P2.** The same design on BEA detail industries with $\Delta \ln Q$, $\Delta \ln(L/Q)$ and $\Delta \ln P$ as outcomes (project 4's decomposition); 342 industries with County Business Patterns employment.
- **P3.** Occupation long differences of ln employment on exposure, ACS 2012–2019 (project 3's all-ages secondary analysis).
- **P4.** Employment of 22- to 25-year-olds relative to 31- to 54-year-olds, by occupation, in the ACS (project 3).
- **P5.** The within-occupation difference in exposure between new and older tasks (project 2).

**Noise calibration.** Pre-period windows have the length of the planned post-period window: six years for P1–P2 (2022–2028), and two years for P4 (2022–2024), within one ACS occupation-coding regime (2012–2017); five-year windows calibrate P4's robustness design (2019–2024). P5 uses the variance of Eloundou's labels among tasks that first appeared before 2015, and simulates the test with the actual occupational distribution of new tasks.

Two standard errors are computed for each design:

- (a) the clustered standard error from the pre-period regression;
- (b) the standard deviation of placebo coefficients across pre-period windows, where each placebo coefficient comes from regressing pre-period outcome changes on the actual exposure measure.

The minimum detectable effect (MDE), at 5 percent two-sided and 80 percent power, uses the larger of the two:

$$
\mathrm{MDE} = \left(t_{0.975,\,G-1} + t_{0.80,\,G-1}\right)\cdot \max\{\mathrm{SE}_a,\ \mathrm{SE}_b\}.
$$

**Translation into $\lvert\sigma - \varepsilon\rvert$.** Let $x_i \equiv -\ln(1 - s_{M,i})$, which is approximately $s_{M,i}$. Equation (A7) implies

$$
\Delta \ln L_i = \alpha + b\,x_i + u_i, \qquad b = \frac{\varepsilon - \sigma}{\sigma - 1}.
$$

AI's cost share is assumed proportional to exposure, rescaled so that its employment-weighted mean equals $\bar s_M \in \{0.01, 0.02, 0.05, 0.10\}$. The smallest detectable gap is then $\lvert\sigma - \varepsilon\rvert_{\min} = (\sigma - 1)\cdot \mathrm{MDE}_b(\bar s_M)$. For P2, $b_Q = \varepsilon/(\sigma - 1)$, so the smallest detectable $\varepsilon$ is $(\sigma - 1)\cdot\mathrm{MDE}_{b_Q}$.

As a reference point, take an industry whose AI cost share rose from 0 to 5 percent, compared with one with no AI. With $\sigma = 2$ and $\varepsilon = 1$, it would lose about 5 percent of its employment; with $\varepsilon = 3$, it would gain about 5 percent.

### 5.1 Results

**Table P1/P6. Industry employment (P1): smallest detectable $\lvert\sigma - \varepsilon\rvert$.** MDE = 0.62 log points per unit of $\beta$ (mean $\beta$ 0.336; coefficient of variation 0.41).

| $\sigma$ | $\bar s_M$ = 1% | 2% | 5% | 10% |
| --- | ---: | ---: | ---: | ---: |
| 1.5 | 10.4 | 5.2 | 2.1 | 1.0 |
| 2 | 20.8 | 10.4 | 4.2 | 2.1 |
| 3 | 41.6 | 20.8 | 8.3 | 4.2 |

The paper's Figure 2 cases differ by $\lvert\sigma - \varepsilon\rvert$ of 1 to 2.5. To reach 80 percent power, the mean AI cost share would have to be about 7 percent for $(\sigma, \varepsilon) = (1.5, 3)$, 17 percent for $(3, 0.5)$, 21 percent for $(2, 3)$ and 42 percent for $(3, 2)$. The mean placebo coefficient over the three non-overlapping windows is $-0.25$ (standard error 0.11), and 12 of the 13 overlapping-window coefficients are negative: exposed industries already shed employment relative to others before 2020, in windows from 2001 to 2019, by an amount that, at $\bar s_M$ = 2 percent, equals a cost-share coefficient of about $-4$. The teleworkable share and interest-rate exposure explain 75 percent of the variation in $\beta$ across industries, so controlling for them raises the MDE from 0.40 to 0.62.

**Table P2. Decomposition.** MDE per unit of $\beta$: 0.94 for $\Delta \ln Q$, 0.60 for $\Delta \ln(L/Q)$ and 0.46 for $\Delta \ln P$. Smallest detectable $\varepsilon$ at $\sigma = 2$: 31.6 at $\bar s_M$ = 1 percent, 15.8 at 2 percent, 6.3 at 5 percent and 3.2 at 10 percent. In simulations with the empirical residual covariance, the power to reject $\varepsilon/\sigma = 1$ is at most 13 percent at $\bar s_M \le$ 2 percent, and the 95 percent interval for $\varepsilon/\sigma$ is bounded in only 4–20 percent of draws. Restricting to industries with market-price deflators makes the MDEs several times larger.

**Table P3. Occupation employment, all ages.** MDE per standard deviation of $\beta$: 0.019 (two-year window) and 0.040 (five-year). Smallest detectable $\lvert\sigma - \varepsilon\rvert$ at $\sigma = 2$, two-year window: 1.49 at $\bar s_M$ = 2 percent, 0.58 at 5 percent, 0.27 at 10 percent. Occupations are a more powerful unit than industries, because exposure varies more across occupations.

**Table P4. Young relative to older workers (project 3's gate).** The target is $\beta^{*} = -0.0886$ per standard deviation of the automation share (their 22–25 coefficient, $-0.098$, minus the employment-weighted average of their older-age coefficients, $-0.0094$). Scaled to a 2024 endpoint by the ratio of their 2022–2024 to mid-2026 top-versus-bottom-quintile gaps (0.644), $\lvert\beta^{*}\rvert = 0.057$.

| Design | $N_{\min}$ | MDE, $\beta_{\text{aut}}$ | MDE with bootstrap critical values | Gate |
| --- | ---: | ---: | ---: | --- |
| Two-year (2022–2024) | 30 | 0.031 | 0.034 | Passed |
| Five-year (2019–2024) | 30 | 0.049 | 0.053 | Passed narrowly |

$N_{\min} = 30$ drops 2.4 percent of young employment and keeps 87 clusters. The MDE for $\beta_{\text{aut}} - \beta_{\text{aug}}$ is 0.051 (two-year), against a target of 0.058. ACS sampling error is 68 percent of the residual variance at two years. Pre-period placebo coefficients for $\beta_{\text{aut}}$ average $+0.009$ to $+0.020$, the opposite sign to the hypothesis. Brynjolfsson, Chandar, and Chen's own ACS comparison shows a much smaller gap than their ADP data, so passing the gate against the ADP magnitude does not guarantee power against the effect the ACS will show.

**Table P5. New versus older tasks (project 2).** Pre-2015 tasks: SD of $\beta$ 0.349, within-occupation SD 0.282, intra-occupation correlation 0.35. Under the dating rule of Section 7.1, 139 of the 143 new tasks in the primary sample are Emerging Tasks entries; the plan's original control for statements taken from the Emerging Tasks file is then nearly collinear with $\text{New}_k$ and raises the MDE to 0.18. Section 7.4 therefore drops it from the primary specification.

| Definition | New tasks | Occupations | MDE for $\delta$ |
| --- | ---: | ---: | ---: |
| Primary: new since 2022, excluding AI/SME tasks, no source control | 143 | 111 | 0.062 |
| With a broad source control | 143 | 111 | 0.10 |
| Release histories only | 89 | 70 | 0.081 |
| Including AI/SME tasks | 196 | 159 | 0.053 |

**Consequences for this plan.**

1. Project 3 passes its gate. Because the author has seen related ACS results (Section 3), H3 is a pre-specified replication outside the primary family (Section 8).
2. Project 4's employment test cannot distinguish the Figure 2 cases until AI's mean cost share is far above current levels, and its placebo distribution shows a pre-existing trend of the same size and sign as the effects being tested. It is therefore not a primary hypothesis; project 4 is a pre-specified descriptive analysis, judged against the placebo distribution (Section 9.3).
3. The paper's claim that aggregate null results were to be expected is now quantitative: with current cost shares, at a mean AI cost share of 2 percent and $\sigma = 2$, a zero estimate in the industry design would rule out only gaps $\lvert\sigma - \varepsilon\rvert$ above about 7.

## 6. Project 1: Demand Elasticities for Cognitive-Service Industries

### 6.1 Sample

The estimation sample is drawn from the 414 private and public industries for which BEA publishes detail-level gross output and price indexes on a consistent NAICS basis from 1997. Four groups are excluded: farms, oil and gas extraction, housing, and government.

Cognitive-service industries ($C_i = 1$) are the 39 BEA detail industries listed in `code/clean/industry_common.py` (`COGNITIVE_BEA`): legal services; accounting; computer systems design; management and technical consulting; other professional services (architecture and engineering, design, research and development, advertising, and miscellaneous); finance and insurance; information industries including software publishing and data processing; and administrative support, including business support services and call centers. A rule-based definition is a robustness check: service-providing industries in which at least half of May 2019 employment is in occupations in the top two employment-weighted quintiles of the Eloundou et al. (2024) GPT-4-rated $\beta$ (`code/exposure/cognitive_industries.py`). Service-providing means NAICS sectors 51–56, 61–62, 71–72 and 81. The rule selects 50 industries, 37 of them on the named list. Without the restriction to services it would select 94, including many manufacturing and wholesale industries whose office occupations are exposed but whose products are not cognitive services. The other industries are kept in the sample. They help estimate the period effects, and they add clusters.

**Windows.** The plan uses four non-overlapping five-year differences, ending in 2004, 2009, 2014 and 2019. All shares are fixed at 1997. An industry-window enters the primary sample only if the deflator rule below covers its start year. As a secondary long-span case, legal services, the one cognitive-service industry with a market price index throughout, is estimated on BEA's summary-level history from 1987, with an indicator for BEA's 1997 switch from the consumer to the producer price index.

**Primary deflator sample.** The primary sample is limited to industry-years whose gross-output deflator comes mainly from directly measured output prices (producer price indexes, PPIs) rather than from input costs or wages. Cost-based deflators make measured real output track measured inputs, which makes the design mechanical. BEA does not publish which price index deflates each detail industry, so the classification comes from BEA's documentation (deflator tables by industry group in *Survey of Current Business* articles, notices of method changes, the NIPA Handbook) and BLS PPI start dates, without reference to the price or output data. It is recorded, with sources, in `output/exposure/deflator_classification.csv` and `notes/deflator-classification.md`. An industry-year is covered from the first full year in which BEA documents a PPI-based deflator for it. For the cognitive-service industries:

| Classification | Industries (covered from) |
| --- | --- |
| PPI-based | Travel arrangement (1990); advertising (1996); legal services, accounting, architecture and engineering, employment services, print publishers and wired telecommunications (1997); software publishers (1998, with a BEA quality adjustment); insurance carriers other than direct life (1999); wireless telecommunications (2000); securities and data processing and hosting (2001); radio and television broadcasting (2002); cable programming (2004); management consulting (2007); other financial investment (2012) |
| Input-cost based | Computer systems design (wage-based custom-software index); direct life insurers; scientific research and development |
| Quantity indicators | Banking |
| Consumer-price or proxy deflators | Motion pictures, sound recording, internet publishing, other information services, other telecommunications, insurance agencies, funds and trusts |
| Not documented | Specialized design; environmental and technical consulting; other professional services; office administrative services; business support services, including call centers; nondepository credit |

This gives $N_C = 20$ cognitive-service industries covering at least one window (13, 18, 19 and 20 in the windows ending 2004, 2009, 2014 and 2019), or 17 under a strict reading that counts only industries for which BEA documents PPI use at the detail level rather than for their industry group (it drops management consulting, employment services and wireless telecommunications; this is a robustness check). Across all industries, after the exclusions above, 293 cover at least one window. Industries without a market-price deflator in a window are excluded from the primary sample. The input-cost and quantity-indicator industries are used as a falsification check: their measured elasticity should be mechanical, and a result that looks like the primary one there would point to measurement rather than demand.

### 6.2 Variables

$Y_{it}$ is nominal gross output, $P_{it}$ its chain-type price index and $Q_{it}$ the chain-type quantity index. BEA's chained Fisher indexes satisfy $\Delta \ln Q + \Delta \ln P = \Delta \ln Y$ exactly; BLS's indexes satisfy it approximately. $L_{it}$ is hours (BLS) and $A_{it} = Q_{it}/L_{it}$. $q_{it} = \ln(Q_{it}/N_t)$ is real output per US resident, and $q_{i,1997}$ its 1997 value. Satiation is measured against that predetermined reference, not the industry's mean over the sample, which would include later windows' outcomes.

### 6.3 Instruments

Both instruments are predicted changes in log unit cost, so a negative value is a predicted cost reduction.

**Primary: input-output cost-push.**

$$
z^{IO}_{it} = \sum_{j \neq i,\ j \notin B_i} a_{ji,0}\;\Delta_5 \ln\!\left(P_{jt}/P^{GDP}_t\right),
$$

- $a_{ji,0}$ is industry $i$'s purchases from supplier $j$ per dollar of $i$'s output in BEA's 1997 benchmark detail use table (standard table before redefinitions, at producers' prices; 491 industries on a 1997 NAICS basis), concorded to all 414 2017-definition detail industries of the output data (`data/clean/io_use_1997_detail_2017codes.parquet`; concordance and allocation of split codes documented in `notes/io-1997-detail.md`). Suppliers $j$, their prices $P_{jt}$ and the sets $B_i$ are all measured at that detail level. The 1997 summary table, the only 1997 table currently on hand, is not used: at its 71-industry level, accounting, consulting, design, research and advertising share one column, so the instrument would barely vary within professional services. The table after redefinitions is a robustness check; its coefficients correlate 0.999 with the primary version.
- $P_{jt}$ is the gross-output price of $j$.
- $B_i$ is the set of suppliers that sold more than 10 percent of their 1997 output to $i$.
- Suppliers whose own price index in the window is input-cost based (service industries before their PPI start date) are also excluded, because their prices move with the same wage costs that drive $i$'s deflator.

Identification rests on supplier price shocks being as good as random given exposure (Borusyak, Hull, and Jaravel 2022). Shock-level balance tests and exposure-robust standard errors (Adão, Kolesár, and Morales 2019) will be reported.

**Secondary: IT-price shift-share.**

$$
z^{IT}_{it} = \sum_{a \in \{\text{computers, software, communication equipment}\}} \theta_{ia,0}\;\Delta_5 \ln\!\left(P^K_{at}/P^{GDP}_t\right),
$$

- $\theta_{ia,0}$ is the 1997 current-cost net stock of IT asset type $a$ relative to gross output, from BEA Fixed Assets. Fixed Assets covers 74 industries, so most professional services share one value; $\theta$ therefore varies little within professional services, which is one reason this instrument is secondary.
- $P^K_{at}$ is BEA's investment price index for asset type $a$.

With so few shocks, identification rests on the exogeneity of the base-year shares (Goldsmith-Pinkham, Sorkin, and Swift 2020). Rotemberg weights will be reported.

**Why input-output cost-push is primary.** Its main threats bias the estimate toward $\varepsilon_C < 1$. A common demand shock that lowers both $i$'s revenue and its suppliers' prices, or a demand boom at $i$ that raises its suppliers' prices, makes $\varepsilon$ look smaller. The IT instrument has the opposite problem. IT prices fell fastest in the late 1990s (Jorgenson 2001), when demand for IT-intensive services was booming, so $\varepsilon$ would look larger.

### 6.4 Estimating Equations

**Demand.** The elasticity is allowed to differ for cognitive-service industries:

$$
\Delta_5 \ln Q_{it} = -\varepsilon_C\,C_i\,\Delta_5 \ln P_{it} - \varepsilon_N\,(1 - C_i)\,\Delta_5 \ln P_{it} + \mu_i + \tau_t + u_{it}.
$$

The instruments are $C_i z_{it}$ and $(1 - C_i) z_{it}$. The first-stage coefficients $\pi_C$ and $\pi_N$ should be positive.

**Test of $\varepsilon_C = 1$.** For a hypothesized value $\varepsilon^{\circ}$, the Anderson–Rubin (AR) test (Anderson and Rubin 1949) regresses $\Delta \ln Q + \varepsilon^{\circ} \Delta \ln P$ on the instruments. At $\varepsilon^{\circ} = 1$ the dependent variable is nominal output growth:

$$
\Delta_5 \ln Y_{it} = \rho_C\,C_i z_{it} + \rho_N\,(1 - C_i) z_{it} + \mu_i + \tau_t + e_{it}, \qquad \rho_C = (1 - \varepsilon_C)\,\pi_C .
$$

This test does not use the industry's own deflator, which addresses division bias. Measured real output is nominal output divided by the deflator, so deflator error enters both sides of an OLS regression and pulls the estimated elasticity toward 1, which is exactly the copilot threshold.

The IV estimate has a related property. If the instrument is also correlated with deflator error, the IV estimand satisfies $\hat\varepsilon - 1 = (\varepsilon - 1)\cdot \operatorname{cov}(z, \Delta\ln P^{*})/\operatorname{cov}(z, \Delta\ln P)$, where $P^{*}$ is the true price. The error rescales $\varepsilon - 1$ but cannot flip its sign, as long as the instrument moves true and measured prices in the same direction.

**Satiation.** The elasticity is allowed to vary with output per capita within each industry over time:

$$
\Delta_5 \ln Q_{it} = -\left[\varepsilon_0 + \varepsilon_1\,(q_{i,t-5} - q_{i,1997})\right]\Delta_5 \ln P_{it} + \lambda\,(q_{i,t-5} - q_{i,1997}) + \mu_i + \tau_t + u_{it}.
$$

The instruments are $z_{it}$ and $z_{it}(q_{i,t-5} - q_{i,1997})$. Comparisons across industries are not used.

A second, parametric version follows Bessen (2019). In his model, log reservation prices relative to the wage are normally distributed across a good's uses, so per-capita output is $e^{q} = e^{q^S_i}\,[1 - \Phi(\xi)]$ with $\xi = [\ln(P/W) - \nu_i]/\omega$, and the elasticity $\varepsilon(q) = M(\xi)/\omega$, where $M$ is the inverse Mills ratio, falls as $q$ approaches the satiation level $q^S_i$. With $\omega$ and the headroom $\eta = q^S_i - q_{i,1997}$ common to all industries, the five-year-difference version is estimated by generalized method of moments with instruments $z_{it}$ and $z_{it}(q_{i,t-5} - q_{i,1997})$, with the elasticity evaluated at the start of each window. The model is just identified and implies $\varepsilon_1 < 0$ by construction, so it is used only to extrapolate $\varepsilon$ to larger price cuts, not to test H1b. Bessen estimated it industry by industry by nonlinear least squares on a century of annual data, without instruments; the version here differs in pooling, instruments and output measure (quality-adjusted chain indexes of gross output rather than physical consumption).

**Copilot-channel employment equation.**

$$
\Delta_5 \ln L_{it} = \phi\,\Delta_5 \ln A_{it} + \mu_i + \tau_t + v_{it},
$$

instrumented by $z_{it}$. The coefficient $\phi$ equals $\varepsilon - 1$ only when the instrumented productivity change is labor-augmenting and labor is the only variable input. With an input-cost instrument, (A5) implies $\phi = \varepsilon/\sigma_{LX} - 1$, where $\sigma_{LX}$ is the elasticity of substitution between labor and the input whose price moved. $\phi$ is therefore secondary, and its sign is informative only if $\sigma_{LX} > 0$. Whether historical cost reductions raised employment in these industries is shown instead by the reduced form, $\Delta_5 \ln L_{it}$ regressed on $z_{it}$, which is reported.

### 6.5 Hypotheses

**H1a (primary).** Test statistic: the two-sided wild-cluster-bootstrap test of $\rho_C = 0$, which is the AR test of $\varepsilon_C = 1$. Sample: the primary deflator sample, windows ending 2004–2019. The AR test is valid whatever the first stage, but the sign of $\rho_C$ shows on which side of 1 $\varepsilon_C$ lies only if $\pi_C > 0$. H1a is therefore evaluated only if $\hat\pi_C > 0$ at the 5 percent level, one-sided. If the input-output first stage fails that check, H1a is tested with $z^{IT}$. If both fail, H1a is reported as untestable and enters the Holm procedure with a p-value of 1 (Section 12).

Cognitive-service industries in the primary deflator sample number $N_C = 20$ (Section 6.1). Because $C_i z_{it}$ varies only across them, the few-treated-clusters problem applies even though the total number of clusters is large. H1a's p-value is therefore the larger of the wild-bootstrap p-value and a randomization-inference p-value that reassigns the cognitive label at random among the industries of the deflator sample, holding $N_C$ fixed.

| Result | Reading |
| --- | --- |
| $\varepsilon_C > 1$ ($\rho_C < 0$) | Supports the demand-expansion view. Copilot-channel gains raise employment in these industries, and the necessary condition for $\varepsilon > \sigma$, given $\sigma > 1$, holds. |
| $\varepsilon_C < 1$ | Supports the substitution view. With $\sigma > 1$, as the boom in AI use suggests, employment falls through both channels. |
| 90 percent AR set inside $[0.75, 1.25]$ | Approximately unit elastic. Neither view is favored. |

The equivalence margin of 0.25 is chosen because a 20 percent productivity gain, within the range of the field experiments, would then change employment by about 5 percent or more. For each $\sigma \in \{1.5, 2, 3\}$, the plan also reports whether the AR set lies above, below or across that value.

Historical $\varepsilon$ is a local benchmark for cost declines of a few percent per window. It is not a forecast for the much larger price cuts AI could produce.

**H1b (secondary).** Statistic: $\hat\varepsilon_1$, two-sided test of $\varepsilon_1 = 0$. Sample: all industries in the primary deflator sample, with $\varepsilon_1$ common to all of them; a version specific to cognitive services is a robustness check. $\varepsilon_1 < 0$ supports satiation, which the paper treats as the main case against lasting demand expansion. $\varepsilon_1 \ge 0$, or $\varepsilon_1$ within $\pm 0.25$ (the margin used for H1a; a doubling of output per capita would then change the elasticity by at most about 0.17), supports the demand-expansion view's assumption that elasticities do not fall as consumption rises.

**Other secondary estimates.** $\varepsilon_N$; $\phi$; results with $z^{IT}$; both instruments together, with Hansen's (1982) J test.

### 6.6 Robustness Checks Fixed in Advance

- Windows of three and ten years; overlapping five-year windows.
- All industries, whatever the deflator method.
- BLS output in place of BEA output; the 1987 extension.
- Unweighted estimates (the primary estimates weight by 1997 nominal output).
- Dropping the window ending 2004 (the dot-com boom) and the window ending 2009 (the financial crisis).
- Excluding IT-producing industries.
- Sector-by-period effects, which absorb differences in income elasticities across broad sectors (Comin, Lashkari, and Mestieri 2021).
- Thresholds of 5 and 20 percent for the supplier set $B_i$.
- Limited-information maximum likelihood (LIML).
- Leave-one-industry-out estimates.
- Satiation measured without deflators, as the industry's share of nominal GDP.
- Diagnostics reported with every estimate: the correlation of each industry's deflator with its compensation per full-time equivalent, and BEA's deflator against the industry PPI.
- If EU KLEMS data can be matched at sufficient detail, the leave-one-out foreign productivity instrument of Autor and Salomons (2018), reported as exploratory.

## 7. Project 2: New Tasks

### 7.1 Unit, Dates and Sample

The unit is a distinct task statement within an O\*NET-SOC occupation. Newness is defined by text, not by Task ID, because O\*NET re-issues IDs when it revises its occupational taxonomy: release 25.1 (November 2020) issued 2,684 new IDs, at least 2,055 of them for text identical to an older task. A statement is new in the release where it first appears if no statement in any earlier release, in any occupation, has a term frequency–inverse document frequency (TF-IDF) cosine similarity of at least $\tau$ with it. TF-IDF uses raw term counts of lower-cased alphanumeric tokens, no stop words and no stemming, and the smooth inverse document frequency $\ln[(1 + N)/(1 + \mathrm{df})] + 1$ fitted on all task statements and Emerging Tasks texts; rows are normalized to unit length. Its first-appearance date is the earlier of that release's date and its Date in the Emerging Tasks file. A statement that entered the database in 2022 or later but was listed as an Emerging Task before 2022 is therefore old: the task existed before it was added. $\text{New}_k = 1$ if its first-appearance date is on or after January 1, 2022, whichever source supplies it. Table P5 counted release-history statements from release 27.0 (August 2022); the same cutoff adds the few statements first appearing in releases 26.2 and 26.3 (February and May 2022), most of which are old under the dating rule.

New tasks come from two sources, de-duplicated against each other: statements new in the release histories (89 since release 27.0, in 70 occupations, most of them listed earlier as Emerging Tasks and therefore old under the dating rule above) and Emerging Tasks with Category = New (192 dated 2022–2026, 5 of them in 2022). The 55 Emerging Tasks entries (53 distinct tasks) whose Domain Source is "AI/SME" were drafted with ChatGPT for a single topic, drones (Lewis, Gregory, and Morris 2025); they are excluded from the primary sample and included in a robustness check. O\*NET adds tasks only when it re-surveys an occupation, on a rolling schedule, so first-appearance dates mix novelty with the survey calendar; the comparison within occupation removes the occupation's own schedule from the estimate.

Two kinds of entry are treated as rewordings and excluded:

- Emerging Tasks with Category = Revision;
- in the release histories, statements within the similarity threshold $\tau$ of an earlier statement, as defined above.

$\tau$ is set, before any post-2019 task is examined, to maximize the F1 score for identifying Revision entries (Revision is the positive class) among Emerging Tasks entries dated before 2020, each compared with the statements of earlier releases as above. On those 592 entries (510 New, 82 Revision), $\tau = 0.775$, with F1 = 0.78.

Earlier tasks are the statements in release 31.0 whose first-appearance date is before 2022, together with Emerging Tasks entries with Category = New dated before 2022 that were never added to the database; the latter share the new tasks' drafting process. Tasks deleted from the database before release 31.0 are not included. The sample is occupations with at least one new task and at least one earlier task: 111 occupations, with 143 new and 2,233 earlier tasks in Table P5.

### 7.2 Exposure Scoring

Each task is scored with the Eloundou et al. (2024) rubric, copied verbatim from the paper's supplementary materials. Where the rubric's E3 category appears, it is scored like E2, as in the authors' code ($\beta$ weight 0.5). Labels are E0, E1 and E2, and $\beta_k = \mathbf{1}\{E1\} + 0.5\cdot\mathbf{1}\{E2\}$. Language-model exposure scores differ widely across models (Yin, Vu, and Persico 2026), so no single model's scores are relied on. The rubric keeps the paper's original capability frame, so old and new tasks are judged against the same fixed frontier. Scoring uses a fixed prompt and a fixed model version at temperature 0. The model sees the task and the occupation title, but never the task's date. Model IDs, dates, prompts and raw outputs are archived.

**Model choice (version 1.2).** No commercial model API was available to the project when the plan was frozen, so the feasible candidates are two, from different providers: Anthropic's Claude Opus 5.5 (model ID `claude-opus-5-5`), run through the Claude Code agent interface, which does not expose a temperature setting; and Google's open-weight Gemma 4 26B (Ollama tag `gemma4:26b`), run locally at temperature 0. OpenAI's models could not be run, a deviation from version 1.1. Both score a random validation sample of 1,000 tasks that existed before 2020 and carry Eloundou's human labels, and quadratic-weighted Cohen's $\kappa$ against those labels is reported for each. The primary score is the mean $\beta$ of the two; each model's scores alone are robustness checks, and the smaller Gemma 4 E4B (`gemma4:e4b`) is a third robustness rater. Because Claude's sampling temperature cannot be fixed, a random 10 percent of tasks is scored twice by it and test–retest agreement is reported. Claude Opus 5.5 also assisted in preparing this plan; the scoring runs see only the rubric, the task and the occupation title, not this plan or any task's date. The plan reports $\kappa$, the confusion matrix, and the correlation of occupation-level $\beta$ with Eloundou's published values.

**Human check.** A random subsample of 200 tasks, 100 new and 100 earlier, is rated by two human raters who follow the rubric and do not see the tasks' dates [TO FILL: raters]. Inter-rater and human–model agreement are reported, and $\delta$ is re-estimated on the subsample with the human ratings.

**Contamination check.** Models may have memorized Eloundou's labels for old tasks, but not for new ones, and that would bias the comparison. The validation tasks are therefore also scored after paraphrasing by a fixed procedure. If the $\kappa$ of the primary score (the mean of the two selected models) against Eloundou's human labels falls by more than 0.10 on the paraphrased validation tasks, all tasks, old and new, are scored in paraphrased form in the primary specification. The models are not re-ranked.

### 7.3 Tasks about AI

AI tasks are tasks about using, building, training, evaluating or overseeing AI. They are identified by a fixed list of keywords, matched case-insensitively as whole words unless noted:

> artificial intelligence; AI (case-sensitive); machine learning; deep learning; neural network; large language model; LLM; generative AI; chatbot; natural language processing; computer vision; GPT; prompt engineering.

The primary specification excludes AI tasks and the secondary includes them. Their share of new tasks, by year of first appearance, is reported as a separate measure. As a robustness check, a model classification of the same question replaces the keyword list.

### 7.4 Equation and Hypothesis

$$
\beta_k = \alpha_{o(k)} + \delta\,\text{New}_k + \gamma \ln(\text{words}_k) + u_k,
$$

where $\alpha_o$ are occupation fixed effects. Almost all new tasks come from the Emerging Tasks file, whose statements are drafted by O\*NET analysts from write-ins by incumbents and occupational experts (and, for the AI/SME entries, with ChatGPT) rather than rated in O\*NET's task surveys, so a control for that source would be nearly collinear with $\text{New}_k$ (Section 5.1). Differences in how the two sources are written are addressed instead by the length control, by the within-source comparison below and by scoring paraphrased statements (Section 7.2).

**H2 (primary).** Statistic: the two-sided test of $\delta = 0$, clustered by occupation with a wild bootstrap. Sample: as defined in 7.1, excluding AI tasks.

| Result | Reading |
| --- | --- |
| $\hat\delta$ significantly below 0 and not equivalent | New tasks are less AI-performable. This is the reinstatement that the demand-expansion view relies on: new tasks raise $\Gamma$. |
| $\hat\delta$ significantly above 0 and not equivalent | New tasks are more AI-performable than old ones. This supports the substitution view's second claim. |
| Equivalent: 90 percent interval inside $\pm\Delta_2$ | AI can perform new tasks about as readily as old ones, which also supports the substitution view's second claim. |
| Otherwise | Inconclusive. |

Results are classified by the rule in Section 13.

$\Delta_2 = 0.062$, the MDE from Table P5. The mean $\beta$ of new tasks is reported alongside $\delta$.

**Secondary.**

- Within source: Emerging Tasks with Category = New dated 2022 or later against those dated before 2022, with SOC major-group effects, which holds the source and drafting process fixed.
- A broad source control marking every statement ever listed in the Emerging Tasks file.
- A difference in newness: tasks new since 2022 against tasks new in 2015–2021, which removes any constant "newness" effect.
- A cohort design: within occupation, the mean $\beta$ of text-defined new statements by cohort of first appearance (2012–2016, 2017–2021, 2022–2026), testing whether successive cohorts of new work are becoming more or less AI-performable.
- The specification including AI tasks.
- The E1-only measure and $\zeta = E1 + E2$.

### 7.5 Robustness Checks Fixed in Advance

- The runner-up model.
- A prompt framed at capabilities on the scoring date.
- For Gemma 4 26B, the mean of five draws at temperature 1.
- Ordered logit.
- Weighting by O\*NET importance ratings where available.
- Equal weights per occupation.
- The cutoff moved to the first release dated 2024 or later, because O\*NET data collection lags.
- $\tau \pm 0.1$.
- Emerging Tasks file only; release histories only, with statements dated by the release in which they first appear (the 89 statements of Table P5).
- Including the 53 AI/SME tasks.
- Paraphrased scoring.

This project measures the direction of task creation. It does not measure the size of $\Delta \ln \Gamma$, because task weights for new tasks are unknown.

## 8. Project 3: Copilot versus Agent Channel in Public Data

### 8.1 Gate

Project 3 is confirmatory only if the power analysis (Table P4) shows that the ACS can detect an effect as large as the one Brynjolfsson, Chandar, and Chen report.

The target, $\beta^{*}$, is computed from their Table 3, Panel A: the automation coefficient for ages 22–25 minus the employment-weighted average of the coefficients for the comparison ages. It is then scaled to the primary window, 2022 to 2024, by the ratio of their top-versus-bottom-quintile gap for 2022–2024 to the mid-2026 gap, 0.644, because their outcome runs to June 2026. That gives $\beta^{*} = -0.0886 \times 0.644 = -0.057$ per standard deviation (Table P4).

The project is confirmatory if MDE$_3$ $\le$ $\lvert\beta^{*}\rvert$; otherwise it would be run, labeled exploratory, and dropped from the primary family. With MDE$_3$ = 0.034 (bootstrap critical values, two-year design, $N_{\min} = 30$) against $\lvert\beta^{*}\rvert$ = 0.057, the gate is passed. Because the author has seen related ACS results (Section 3), H3 is registered as a pre-specified replication: it is estimated and classified exactly as specified here, but it is not in the primary family and is not adjusted for multiplicity with it.

The target uses the ADP magnitude. Their Table H.1 suggests the ACS effect may be smaller, so passing the gate does not guarantee power against the effect the ACS will show.

### 8.2 Sample and Variables

**Sample.** ACS one-year PUMS, 2022 against 2024 in the primary specification. The base year matches the release of ChatGPT and the start of Brynjolfsson, Chandar, and Chen's window, and both years use the 2018 occupation codes. Census has not scheduled the 2025 one-year file; when it is released, 2022 against 2025 is reported as a pre-specified update, and the primary result remains the 2024 one. 2019 against 2024 is a robustness check, since that window also contains the pandemic and the rise in interest rates. The 2020 file, released only with experimental weights, is not used. The sample is civilian wage and salary workers. Young workers are aged 22–25, and the comparison group is aged 31–54. That is "over age 30", as in the paper's Table 3 indicator, capped at 54 to avoid shifts in retirement timing after 2020.

Occupations use Census occupation codes, mapped to 2018 SOC. Occupations with fewer than 30 unweighted respondents aged 22–25 in the base year are dropped, and the share of young employment they hold is reported.

**Outcome.**

$$
Y_o = \left[\ln E^{Y}_{o,2024} - \ln E^{Y}_{o,2022}\right] - \left[\ln E^{O}_{o,2024} - \ln E^{O}_{o,2022}\right].
$$

Differencing across ages within an occupation removes any occupation-wide shock that hits all ages equally. A shift common to all occupations within an age group goes into the intercept. The 2024 revision of ACS population controls is such a shift only to the extent that it does not vary across occupations; the foreign-born control in 8.4 addresses the part that does.

**Regressors.** The AEI (Handa et al. 2025) automation share, augmentation share and overall usage, built as in Brynjolfsson, Chandar, and Chen (2025) from the March 2025 release, as implemented in `code/power/power_common.py`. Usage is per worker, dividing by OEWS May 2016 employment, so that the regressor shares no sampling error with the ACS outcome. The construction matches the pattern of their reported mean usage by automation and augmentation quintile (their footnote 20); levels differ by up to about a third, because the ACS occupation codes are coarser. Each regressor is standardized to mean 0 and standard deviation 1, weighting by base-year wage-and-salary employment of all ages across all occupations with exposure data. Their standard deviations are not published, so $\beta^{*}$ in these units is an approximation. An indicator marks occupations below the AEI's minimum query count. College share is the base-year share of wage-and-salary workers of all ages with a bachelor's degree.

### 8.3 Equation and Hypotheses

$$
Y_o = \alpha + \beta_{\text{aut}}\,\text{Aut}_o + \beta_{\text{aug}}\,\text{Aug}_o + \beta_{\text{use}}\,\text{Use}_o + \gamma\,\text{College}_o + \psi\,\text{Low}_o + u_o,
$$

weighted by base-year (2022) employment aged 22–25. Errors are clustered by SOC minor group, with a wild bootstrap.

**H3 (pre-specified replication; not in the primary family).** Statistic: the two-sided test of $\beta_{\text{aut}} = 0$.

| Result | Reading |
| --- | --- |
| $\hat\beta_{\text{aut}}$ significantly below 0 and not equivalent | Entrants' employment fell relative to older workers' where AI automates tasks. This is the paper's agent-channel explanation: AI substitutes more for entrants' work than for experienced workers' ($\sigma_{JM} > \sigma_{OM}$). |
| $\hat\beta_{\text{aut}}$ significantly above 0 and not equivalent | Entrants gained relative to older workers where AI automates tasks, against the agent-channel explanation. |
| Equivalent: 90 percent interval for $\beta_{\text{aut}}$ inside $\pm\Delta_3$ ($\Delta_3 = 0.034$) | Entrants' relative declines are not tied to automation exposure; explanations unrelated to AI, or to the copilot channel, remain. |
| Otherwise | Inconclusive. |

Because $Y_o$ differences young and older workers within an occupation, applying (A8) to each group gives $s_M(\sigma_{JM} - \sigma_{OM})$: the product-demand elasticity $\varepsilon$ cancels. H3 therefore bears on whether AI substitutes more for entrants than for experienced workers, not on $\varepsilon$. The relative change in older workers' employment in the same regression is reported as a secondary result; where it is close to zero, $\sigma_{OM} \approx \varepsilon$ and a negative $\beta_{\text{aut}}$ also implies $\sigma_{JM} > \varepsilon$.

The augmentation coefficient is read separately, by significance only: $\hat\beta_{\text{aug}}$ significantly below 0 supports the copilot explanation, in which juniors complement other inputs ($\sigma_J < 1$); to first order $\varepsilon$ cancels there too. The two readings can hold together. Results are classified by the rule in Section 13.

**Secondary.**

- $\beta_{\text{aut}} - \beta_{\text{aug}} < 0$.
- The pooled later AEI releases (September 15, 2025; January 15, 2026; March 24, 2026).
- An all-ages version, the change in ln total occupation employment (power from Table P3).
- An event study across ACS years with 2019 as the base year.
- The change in ln employment of 31- to 54-year-olds by occupation on the same regressors, which shows whether $\sigma_{OM} \approx \varepsilon$.

### 8.4 Robustness Checks Fixed in Advance

- Without college share, the direct replication of their Table 3. Because education may be a channel rather than a confounder, the two estimates bracket a range.
- Adding teleworkability (Dingel and Neiman 2020).
- Adding interest-rate exposure, measured as the occupation's 2019 employment share in industries in the top quartile of the project 4 interest-rate measure.
- 2019 as the base year.
- Unweighted respondent counts.
- Controlling for the 2019 foreign-born share.
- All employed workers.
- Comparison group aged 31 and over.
- Eloundou $\beta$ in place of the AEI measures.
- Quintile indicators.
- Dropping computer occupations.
- Dropping occupations below the AEI's minimum query count.
- Errors robust to heteroskedasticity at the occupation level.

The AEI measures Claude usage in 2025–2026, which may respond to employment changes. The results are interpreted with that in mind.

## 9. Project 4: Output versus Labor per Unit of Output

### 9.1 Sample and Variables

**Sample.** Private industries, with the exclusions of Section 6.1. The employment equation uses County Business Patterns industries (consistent six-digit NAICS groups, aggregated to four-digit groups as a check), which do not depend on deflators. The output, price and labor-per-unit equations use BEA detail industries, restricted to those whose deflators are based on market prices from the start of the pre-trend window, 2016 (Section 6.1; 293 industries cover the window ending 2019). The window runs from 2022 to 2028; the pre-period windows used in the power analysis end in 2019.

**Outcomes.** $L$ is mid-March employment from County Business Patterns, the source used for the placebo regressions, in consistent industry groups; files from 2022 on use NAICS 2022 and are mapped to the groups with Census's 2017–2022 concordance, as earlier vintages were. Quarterly Census of Employment and Wages annual averages and BLS detailed-industry hours are robustness checks. $Q$ is real gross output and $P$ its price index, from BEA.

**Primary exposure measure ($\tilde x_i$).** Predetermined occupational exposure: the employment-weighted mean of the Eloundou et al. (2024) GPT-4-rated $\beta$ across the industry's occupations, from OEWS May 2019 staffing patterns. It is fixed before the window, so it cannot respond to industry shocks after 2022, and the same measure supports the pre-period placebo regressions of the power analysis. It indicates where AI's cost share can rise, not the share itself; the scale factor $k$ below absorbs the difference.

**Secondary measures.**

- The change from 2022 to the latest year for which BEA has published annual summary input-output use tables at evaluation (detail tables exist only for benchmark years), assigned to detail industries through their summary parent, in the share of gross output spent on data processing and hosting (BEA commodity 518200), computer systems design (541511, 541512 and 54151A) and software publishing (511200). It covers purchased computing generally, of which AI is a growing part. Because it responds to industry shocks, it is instrumented with the primary measure.
- The BTOS AI-use rate by sector, under the question wording used since November 2025, averaged over the last four waves before evaluation.

**Controls ($\mathbf{w}_i$).** The controls and weights are the same in every equation estimated on a given sample, matching the power analysis.

- Pre-trends over the six years before the window, 2016–2022: the change in ln $L$ in the employment sample; the changes in ln $Q$, ln$(L/Q)$ and ln $P$, all three in every equation, in the BEA sample.
- The teleworkable share of 2019 employment.
- Interest-rate exposure: the share of the industry's output sold to private fixed investment in BEA's 2017 benchmark detail use table, the latest detail table before 2020.
- Weights: 2022 employment.

### 9.2 Equations

The primary equation is for employment:

$$
\Delta \ln L_i = a_L + b_L\,\tilde x_i + \mathbf{w}_i'\gamma_L + u^L_i .
$$

The decomposition uses the BEA sample:

$$
\Delta \ln Q_i = a_Q + b_Q\,\tilde x_i + \mathbf{w}_i'\gamma_Q + u^Q_i, \qquad \Delta \ln (L/Q)_i = a_{LQ} + b_{LQ}\,\tilde x_i + \mathbf{w}_i'\gamma_{LQ} + u^{LQ}_i, \qquad \Delta \ln P_i = a_P + b_P\,\tilde x_i + \mathbf{w}_i'\gamma_P + u^P_i .
$$

Within the BEA sample, with common weights and controls, the employment coefficient equals $b_Q + b_{LQ}$ exactly. The primary employment coefficient $b_L$ comes from the County Business Patterns sample, which is larger and needs no deflators.

Suppose the true $x_i = -\ln(1 - s_{M,i})$ equals $k\,\tilde x_i$ for an unknown $k > 0$. Then (A5) and (A7) imply

$$
b_L = \frac{k\,(\varepsilon - \sigma)}{\sigma - 1}, \qquad b_Q = \frac{k\,\varepsilon}{\sigma - 1}, \qquad b_{LQ} = -\frac{k\,\sigma}{\sigma - 1}, \qquad b_P = -\frac{k}{\sigma - 1}.
$$

So $-b_Q/b_{LQ} = \varepsilon/\sigma$, $\varepsilon = -b_Q/b_P$ and $\sigma = b_{LQ}/b_P$, none of which depends on the scale of the exposure measure. These ratios are what (A5) means when it is run directly. With AI's cost share at 1–2 percent, $b_P$ is small and the ratios are weakly identified; the power analysis (Table P2) reports their precision, and they are secondary.

### 9.3 Hypotheses

**D4 (pre-specified descriptive estimate; not in the primary family).** The power analysis shows that this design cannot distinguish the paper's Figure 2 cases until AI's mean cost share is several times its current level, and that exposed industries already lost employment relative to others before 2020. Project 4 is therefore not a confirmatory test. It reports, with data through 2028:

- $\hat b_L$ from the employment equation, with errors clustered by three-digit NAICS and a wild bootstrap, estimated exactly as the placebo regressions were (same source, weights and control construction);
- $\bar b_{\text{placebo}} = -0.25$ (standard error 0.11), the mean placebo coefficient over the three non-overlapping six-year windows ending 2007, 2013 and 2019, and the difference $\hat b_L - \bar b_{\text{placebo}}$, with a standard error that adds the two variances;
- the rank of $\hat b_L$ among the 13 overlapping pre-period placebo coefficients.

The difference is classified by the rule in Section 13, with margin $\Delta_4$:

| Result for $\hat b_L - \bar b_{\text{placebo}}$ | Reading |
| --- | --- |
| Significantly above 0 and not equivalent | Employment grew in exposed industries relative to their past trend: consistent with $\varepsilon > \sigma$. |
| Significantly below 0 and not equivalent, with $\hat b_Q$ (BEA sample) not significantly below 0 | Employment fell relative to trend while output did not: consistent with $\sigma > \varepsilon$, the paper's clearest evidence for substitution if $\hat b_Q$ is significantly above 0. |
| Significantly below 0 and not equivalent, with $\hat b_Q$ significantly below 0 | Not readable as an effect of cheaper AI, because cheaper AI cannot lower output in the framework. Treated as evidence of confounding. |
| Equivalent: 90 percent interval inside $\pm\Delta_4$ | Employment-neutral relative to trend, within bounds. |
| Otherwise | Inconclusive. |

$\hat b_Q$ has no placebo benchmark, because its pre-period estimates were withheld (Section 3); it is read on its own. $\Delta_4 = 0.62$ per unit of $\beta$, the MDE from Table P1. Because no public series measures AI's cost share, $\Delta_4$ is translated into $\lvert\sigma - \varepsilon\rvert$ over the grid $\bar s_M \in \{1, 2, 5, 10\}$ percent with Table P6, for each $\sigma \in \{1.5, 2, 3\}$.

**Secondary.**

- $b_Q > 0$, $b_{LQ} < 0$ and $b_P < 0$ separately.
- $\varepsilon/\sigma$, with a Fieller confidence interval.
- $\hat\varepsilon$ and $\hat\sigma$ as Wald ratios, with AR confidence sets.
- The two secondary exposure measures.
- An event study by year from 2017, with 2019 as the reference year, because exposure-based effects have been reported from 2021 (Johnston and Makridis 2026).

**Descriptive.** Joint growth of output and employment in legal services (BEA 541100), software publishing (511200) and business support services, which include call centers (561400).

**Interim estimates.** Estimates with data through 2026 and 2027 will be published as descriptive updates using exactly this specification.

### 9.4 Robustness Checks Fixed in Advance

- Hours in place of employment.
- Value added in place of gross output.
- Unweighted estimates (the primary estimates weight by 2022 employment).
- Sector fixed effects.
- No pre-trend controls; pre-trends measured over 2013–2019 instead of 2016–2022.
- Dropping the information sector.
- Base years of 2021 and 2023.

## 10. Project 5: Cost-Crossover Calibration

This project is a calibration, not a test. For each GDPval task $k$ in occupation $o$, the inputs are:

- the labor cost per completed task, $c^L_k = w_o h_k$, where $h_k$ is expert time and $w_o$ the May 2025 OEWS wage. GDPval publishes expert time only as averages over its gold subset (Patwardhan et al. 2025, Appendix A.2.1 and Table 3): a mean of 404 minutes per task, with a median of 5 hours and an interquartile range of 2.4 to 10 hours. $h_k$ is set to the mean, with the quartiles as scenarios, unless the authors release task-level times. The paper's two reported means (404 minutes and 9.49 hours) are not reconciled there; both are used as scenarios;
- the model's success rate, $q_k$, measured as the win-or-tie rate against expert deliverables;
- the review time, $v_k$, as a share of expert time;
- the inference cost per attempt, $c^{\inf}_k(p) = p \cdot T_k$, where $p$ is the price per token from Epoch AI and $T_k$ the number of tokens per attempt.

Two protocols are considered. In "attempt, review, and fix if it fails", the expert redoes failed tasks. In "retry until success", each attempt is reviewed. Both give the same condition for AI to be cheaper:

$$
c^{\inf}_k(p) < (q_k - v_k)\,c^L_k, \qquad S_o(p) = \sum_{k \in o} \omega_k\,\mathbf{1}\!\left\{c^{\inf}_k(p) < (q_k - v_k)\,c^L_k\right\}.
$$

$S_o(p)$ is the share of the occupation's wage bill past the crossover, with equal task weights $\omega_k$ within an occupation.

The condition shows that once inference costs are small relative to labor costs, crossover depends on success rates and verification costs rather than on token prices. Review costs are first-order: in GDPval, a large naive cost advantage of the model over experts shrinks to a small one once expert review and redoing failed tasks are counted (Patwardhan et al. 2025), and cost per successful attempt is the relevant price (Erol et al. 2025).

**Scenarios.**

- Prices on the calibration date, and 10, 100 and 1,000 times lower.
- Two price paths: the price of a fixed level of capability, which has fallen quickly, and the cost of running the frontier model, which has risen (Gundlach et al. 2026). Crossover shares are reported under both.
- $v \in \{0.1, 0.25, 0.5\}$, which brackets GDPval's measured ratio of review time to expert time, 0.27.
- $T_k$ from GDPval transcripts if published, otherwise $\{5\times10^4,\ 5\times10^5,\ 5\times10^6\}$.
- Success rates for each model in GDPval's published results, by evaluation date.

**Expected values for the indicators.** Crossover shares are mapped into expected values for the 2028 indicators by (A10). Tasks past the crossover lower $\Gamma$, with $\Delta \ln \Gamma \approx \ln(1 - \Delta S_o)$. The cost saving gives $\Delta \ln C \approx \ln[1 - s_{L}\,\Delta S_o\,(1 - r_o)]$, where $r_o$ is AI's cost relative to labor's in the tasks that cross over. The two protocols give the same crossover condition but different relative costs: $r = c^{\inf}/c^L + v + (1 - q)$ under "attempt, review, and fix if it fails", the primary protocol, and $r = (c^{\inf}/c^L + v)/q$ under "retry until success"; both are reported. Occupation results enter an industry's (A10) as averages weighted by the occupation's share of the industry's wage bill, from OEWS May 2019 staffing patterns and wages. Scenarios use $\varepsilon \in \{0.5, 1, 2\}$ and $\sigma \in \{1.5, 2, 3\}$.

**Output.** Expected relative employment changes for exposed occupations (the experienced-worker and entry-level indicators) and the implied change in the labor share, reported in one table per scenario. The slope of $S_o(p)$ is the task-model counterpart of $\sigma$ (the paper's third route).

## 11. Primary Hypotheses at a Glance

| ID | Statistic | Sample | Significantly above (not equivalent) | Significantly below (not equivalent) | Equivalent |
| --- | --- | --- | --- | --- | --- |
| H1a | AR test of $\varepsilon_C = 1$ ($\rho_C$ on nominal output) | All industries in the market-price deflator sample, five-year windows 1999–2019, with a separate elasticity for the cognitive-service industries | $\varepsilon_C > 1$: demand expansion | $\varepsilon_C < 1$: substitution | 90 percent AR set inside $[0.75, 1.25]$: neither view favored |
| H2 | $\hat\delta$, within occupation | O\*NET tasks new since 2022 against earlier tasks, excluding AI tasks | New tasks more AI-performable: substitution | New tasks less AI-performable: demand expansion (reinstatement) | Inside $\pm 0.062$: as AI-performable as old tasks, supporting substitution |
| H3 (replication) | $\hat\beta_{\text{aut}}$ | ACS occupations, ages 22–25 against 31–54, 2022 to 2024 | Against the agent channel | Agent channel: $\sigma_{JM} > \sigma_{OM}$ | Inside $\pm 0.034$: entrants' relative declines not tied to automation; no implication for $\varepsilon$ |

For H3, $\hat\beta_{\text{aug}}$ significantly below 0 would point to the copilot explanation ($\sigma_J < 1$), whether or not $\hat\beta_{\text{aut}}$ is. H3 is a pre-specified replication and project 4's employment estimate (D4) a descriptive estimate; both are classified the same way but are not part of the primary family (Sections 8.1 and 9.3).

## 12. Inference

**Clustering.**

- Project 1: by industry.
- Project 2: by occupation.
- Project 3: by SOC minor group.
- Project 4: by three-digit NAICS.

**Bootstrap.** All tests use the wild cluster bootstrap with the null imposed and 9,999 replications. Weights are Rademacher, or Webb's six-point distribution when there are fewer than 12 clusters (MacKinnon and Webb 2017; Webb 2023; Roodman et al. 2019). For IV, the plan uses the wild restricted efficient bootstrap (Davidson and MacKinnon 2010) and AR tests and confidence sets. Effective first-stage F statistics (Montiel Olea and Pflueger 2013) are reported, but they are not used to decide whether to report.

**Tests.** Tests are two-sided at the 5 percent level, and the direction of each estimate is reported.

**Multiple testing.** The primary family is H1a and H2. H3 passed its power gate but is a pre-specified replication, because the author has seen related ACS results (Sections 3 and 8.1); its p-values are reported unadjusted. Project 4's estimate is descriptive (Section 9.3). If H1a is untestable because both first-stage checks fail (Section 6.5), it enters with a p-value of 1, so the family keeps two members. Equivalence tests are not adjusted for multiplicity; they classify estimates and are reported as unadjusted.

The plan uses Holm's (1979) step-down procedure, which controls the familywise error rate at 0.05. Holm is chosen over the alternatives for three reasons:

- *Romano and Wolf (2005).* Their procedure needs a joint resampling distribution, and the primary tests use different units (industries, tasks and occupations) with no common resampling scheme.
- *Benjamini and Hochberg (1995).* They control the false discovery rate, which suits many hypotheses where some false discoveries are tolerable. With two separate claims, each claim should be protected.
- *Dependence and timing.* Holm is valid under any dependence among the tests. Because its adjusted p-values do not decrease in any raw p-value, a hypothesis not yet evaluated can enter with a p-value of 1, which is conservative. If H1a and H2 are reported at different times, the earlier report uses that convention, and the final Holm adjustment is made once both are in.

Within each project, secondary hypotheses that share data are reported with Romano–Wolf adjusted p-values computed from the same bootstrap draws.

## 13. Interpreting Null Results

Each primary hypothesis has an equivalence margin $\Delta_h$:

- H1a: 0.25 around 1;
- H2: 0.062 in $\beta$ units (Table P5);
- H3: 0.034 per standard deviation of the automation share (Table P4);
- D4: 0.62 per unit of $\beta$ (Table P1), reported in the same four classes although D4 is descriptive.

Equivalence is tested with two one-sided tests (TOST) at 5 percent, which is equivalent to checking that the 90 percent confidence interval lies inside $\pm\Delta_h$ around the threshold (Lakens 2017). Confidence intervals are obtained by inverting the test used for the hypothesis: the wild-bootstrap test, or the AR test for H1a. Each result is placed in exactly one of four classes, in this order of precedence:

1. **Equivalent:** the 90 percent interval lies inside $\pm\Delta_h$. This class applies whether or not the estimate is also significantly different from the threshold; a precisely estimated effect smaller than the margin is read as equivalent.
2. **Significantly above** or **significantly below** the threshold: otherwise, if the Holm-adjusted p-value (unadjusted for H3 and for secondary and descriptive estimates) is below 0.05.
3. **Inconclusive:** otherwise. An inconclusive result whose 90 percent interval is wider than $2\Delta_h$ is also labeled uninformative.

A null is never reported as "no effect" without the equivalence result. For D4, the margin is also stated in terms of $\lvert\sigma - \varepsilon\rvert$, using Table P6. For example, at a mean AI cost share of 2 percent and $\sigma = 2$, $\Delta_4 = 0.62$ corresponds to a gap of 10.4, and a 95 percent interval around an estimate of exactly zero would exclude only gaps larger than about 7.


## 14. Deviations Policy

- Every deviation is recorded in a dated deviations table, with its reason, and results under the registered specification are always reported alongside it.
- Where data are unavailable, the fallbacks named in this plan apply. Where none is named, the closest feasible measure is used and the deviation is labeled.
- Changes made before any post-2019 outcome data are examined are released as a new version with a time stamp.
- Analyses added after that point are labeled exploratory.
- A data revision by an agency (a BEA annual update, revised ACS weights) is not a deviation. Results use the vintage stated at evaluation, and estimates on the registered vintage are also reported.

## 15. Timeline and Version History

| Date | Step |
| --- | --- |
| October 2026 | Version 1.0 drafted. |
| October 12, 2026 | Power analysis complete (pre-2020 data only); version 1.1 drafted, with project 3's gate passed and project 4 made descriptive. Later that day, after the author was shown ACS results by AI exposure from a separate project, H3 became a pre-specified replication under the rule in Section 3. |
| October 13, 2026 | Version 1.2: the feasible task raters named (Section 7.2). The plan was frozen and time-stamped by a public commit to the author's GitHub repository, recorded in the line below, before any project 1 first stage, any scoring of post-2019 tasks, or any post-period ACS microdata was examined. The author's signed confirmations in Section 3 and an entry in a public registry [TO FILL: registry and ID] are to be appended. |
| First half of 2027 | Projects 1 and 2 estimated and reported. |
| After registration | Project 3 estimated with the 2022 and 2024 ACS files; updated with the 2025 file when Census releases it. |
| 2027–2028 | Project 5 calibrated, then updated each year with current prices and success rates. |
| 2027–2028 | Interim descriptive updates for project 4. |
| About 2030, when BEA detail-industry data and employment data for 2028 are released | Project 4's descriptive estimate with data through 2028. |

## 16. What Will Be Reported Regardless of Results

- Every primary and secondary estimate in this plan, with confidence intervals, unadjusted and Holm-adjusted p-values, and equivalence results.
- First-stage coefficients and effective F statistics; AR confidence sets; Rotemberg weights and shock-balance tests.
- Tables P1–P6, the placebo regressions and the project 3 gate decision.
- The project 2 validation: $\kappa$, confusion matrices and the paraphrase check, together with the prompts, model IDs and raw model outputs.
- The share of new tasks that concern AI, by year.
- Project 5's crossover schedules and expected indicator values, under all scenarios.
- The deviations table, the data vintages and code sufficient to reproduce every number from the raw files listed in the manifest.

## References

Adão, Rodrigo, Michal Kolesár, and Eduardo Morales. 2019. "Shift-Share Designs: Theory and Inference." *Quarterly Journal of Economics* 134 (4): 1949–2010.

Anderson, T. W., and Herman Rubin. 1949. "Estimation of the Parameters of a Single Equation in a Complete System of Stochastic Equations." *Annals of Mathematical Statistics* 20 (1): 46–63.

Autor, David, and Anna Salomons. 2018. "Is Automation Labor Share-Displacing? Productivity Growth, Employment, and the Labor Share." *Brookings Papers on Economic Activity* 2018 (Spring): 1–87.

Benjamini, Yoav, and Yosef Hochberg. 1995. "Controlling the False Discovery Rate: A Practical and Powerful Approach to Multiple Testing." *Journal of the Royal Statistical Society, Series B* 57 (1): 289–300.

Bessen, James. 2019. "Automation and Jobs: When Technology Boosts Employment." *Economic Policy* 34 (100): 589–626.

Borusyak, Kirill, Peter Hull, and Xavier Jaravel. 2022. "Quasi-Experimental Shift-Share Research Designs." *Review of Economic Studies* 89 (1): 181–213.

Brynjolfsson, Erik, Bharat Chandar, and Ruyu Chen. 2025. "Canaries in the Coal Mine? Six Facts about the Recent Employment Effects of Artificial Intelligence." Stanford Digital Economy Lab Working Paper, revised August 2026.

Comin, Diego, Danial Lashkari, and Martí Mestieri. 2021. "Structural Change with Long-Run Income and Price Effects." *Econometrica* 89 (1): 311–74.

Davidson, Russell, and James G. MacKinnon. 2010. "Wild Bootstrap Tests for IV Regression." *Journal of Business and Economic Statistics* 28 (1): 128–44.

Dingel, Jonathan I., and Brent Neiman. 2020. "How Many Jobs Can Be Done at Home?" *Journal of Public Economics* 189: 104235.

Eloundou, Tyna, Sam Manning, Pamela Mishkin, and Daniel Rock. 2024. "GPTs Are GPTs: Labor Market Impact Potential of LLMs." *Science* 384 (6702): 1306–08.

Erol, Mehmet Hamza, Batu El, Mirac Suzgun, Mert Yuksekgonul, and James Zou. 2025. "Cost-of-Pass: An Economic Framework for Evaluating Language Models." arXiv:2504.13359.

Goldsmith-Pinkham, Paul, Isaac Sorkin, and Henry Swift. 2020. "Bartik Instruments: What, When, Why, and How." *American Economic Review* 110 (8): 2586–624.

Gundlach, Hans, Jayson Lynch, Matthias Mertens, and Neil Thompson. 2026. "The Price of Progress: Price Performance and the Future of AI." arXiv:2511.23455, revised 2026.

Handa, Kunal, et al. 2025. "Which Economic Tasks Are Performed with AI? Evidence from Millions of Claude Conversations." arXiv:2503.04761.

Hansen, Lars Peter. 1982. "Large Sample Properties of Generalized Method of Moments Estimators." *Econometrica* 50 (4): 1029–54.

Holm, Sture. 1979. "A Simple Sequentially Rejective Multiple Test Procedure." *Scandinavian Journal of Statistics* 6 (2): 65–70.

Johnston, Andrew C., and Christos A. Makridis. 2026. "AI, Output, and Employment." SSRN Working Paper 6460358.

Jorgenson, Dale W. 2001. "Information Technology and the U.S. Economy." *American Economic Review* 91 (1): 1–32.

Lakens, Daniël. 2017. "Equivalence Tests: A Practical Primer for t Tests, Correlations, and Meta-Analyses." *Social Psychological and Personality Science* 8 (4): 355–62.

Lewis, Phil, Christina Gregory, and Jeremiah Morris. 2025. "Adding Drone-Specific Tasks to the O\*NET Database: Initial Identification of Emerging Tasks Using ChatGPT." National Center for O\*NET Development, May.

MacKinnon, James G., and Matthew D. Webb. 2017. "Wild Bootstrap Inference for Wildly Different Cluster Sizes." *Journal of Applied Econometrics* 32 (2): 233–54.

Mergen, Gökhan. 2026. "Will Cheaper Machine Intelligence Raise Employment? Demand Expansion, Substitution, and the Early Evidence." Working paper, October.

Montiel Olea, José Luis, and Carolin Pflueger. 2013. "A Robust Test for Weak Instruments." *Journal of Business and Economic Statistics* 31 (3): 358–69.

Olken, Benjamin A. 2015. "Promises and Perils of Pre-analysis Plans." *Journal of Economic Perspectives* 29 (3): 61–80.

Patwardhan, Tejal, et al. 2025. "GDPval: Evaluating AI Model Performance on Real-World Economically Valuable Tasks." OpenAI. arXiv:2510.04374.

Romano, Joseph P., and Michael Wolf. 2005. "Stepwise Multiple Testing as Formalized Data Snooping." *Econometrica* 73 (4): 1237–82.

Roodman, David, Morten Ørregaard Nielsen, James G. MacKinnon, and Matthew D. Webb. 2019. "Fast and Wild: Bootstrap Inference in Stata Using boottest." *Stata Journal* 19 (1): 4–60.

Webb, Matthew D. 2023. "Reworking Wild Bootstrap-Based Inference for Clustered Errors." *Canadian Journal of Economics* 56 (3): 839–58.

Yin, Michelle, Hoa Vu, and Claudia Persico. 2026. "How (un)Stable Are LLM Occupational Exposure Scores? Evidence from Multi-Model Replication." NBER Working Paper 35110.
