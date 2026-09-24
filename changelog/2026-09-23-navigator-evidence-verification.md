# Changelog: Navigator Framework Evidence — Verification & Publication

**Date:** 2026-09-23
**Scope:** `special-topics/bay-area-navigation.html` — the six Potential Actionable Insights cards.
**Source material:** `project_specs/V0 Specs/navigator_action_framework.html` (20-issue framework; the 6 issues carried in the repo are #1, #4, #7, #11, #14, #18).

The source framework attached two subordinate fields to each issue: an `evidence` line (rendered with a 📎 in the original) and a `daily_work` description. Both are now carried onto the live cards in the same subordinate manner — a quiet footer beneath each card's options, not a focal element.

**Every evidence claim was re-verified against primary sources before publication. Of the 13 claims attached to these six cards, 6 did not survive the check.**

---

## Verification results

### Published as-is (3)

| Claim | Status | Source |
|---|---|---|
| LAO: uncompensated care "a little over $2 billion" in 2024, "could increase by as much as a few billion dollars annually by 2030," ~90% attributable to H.R.1 | **Confirmed verbatim** | [LAO Report 5180](https://lao.ca.gov/Publications/Report/5180) |
| Homeless patients' readmission rate 27.3% vs 17.5% housed (adjusted OR 1.93) | **Confirmed** | [PubMed 32666492](https://pubmed.ncbi.nlm.nih.gov/32666492/) |
| CHCF documenting providers overwhelmed by CalAIM's pace | **Confirmed in substance** (exact "sheer volume of new initiatives" wording not located) | [CHCF](https://www.chcf.org/resource/whats-next-calaim/) |

### Published with correction (4)

| Framework claim | Correction | Source |
|---|---|---|
| "DHCS: 1.4M at risk from work requirements alone" | **1.1M** is DHCS's central estimate (4.8M subject, 2.2M expected exempt). No defensible 1.4M DHCS figure located. DHCS also attributes much of the expected loss to *administrative burden* rather than ineligibility findings — which supports the card's argument better than the disputed number did. | [CHCF, citing DHCS](https://www.chcf.org/resource/2026/06/05/hr1-work-requirement-affect-californians-medi-cal-policy-at-a-glance/) |
| "Average CHW salary Bay Area $45K-60K" | **$69,030** mean annual wage, SF-Oakland-Hayward metro (median $32.15/hr, 1,710 employed). This *cuts against* how the framework used the figure: the retention argument has to rest on Bay Area cost of living, not on artificially low pay. | [BLS OEWS](https://www.bls.gov/oes/2023/may/oes_41860.htm) |
| "State CHW certification (AB 2468, 2022) enables Medi-Cal billing" | Wrong bill. The authority is **AB 133 (Ch. 143, Statutes of 2021)**, directing DHCS to seek a State Plan Amendment; the benefit took effect **July 1, 2022**, with **SB 184** setting core competencies. | [DHCS](https://www.dhcs.ca.gov/providers-partners/community-health-workers/), [NASHP](https://nashp.org/state-tracker/state-community-health-worker-policies/california/) |
| "DHCS ILOS: ED visits −20-35%, readmissions −27%" | **Overstates the ED effect by roughly double.** DHCS's actual Housing Trio results over the six months following use: **inpatient −24.3%**, **ED −13.2%**, applicable service costs −31.6% for Housing Deposits. A larger 71%/24% pair in circulation comes from an LA County *psychiatric recuperative care* service, not housing supports generally — the likely origin of the inflated figures. | [DHCS](https://www.dhcs.ca.gov/news/medi-cal-community-supports-are-delivering-on-their-promise-meeting-member-needs-and-reducing-costs-2/) |

### Not published (3)

| Framework claim | Why |
|---|---|
| "In other states, 77% of those who lost Medicaid during redetermination still qualified" | **Misattribution.** KFF's 77% is a *satisfaction* statistic — the share of pre-unwinding enrollees rating their Medicaid experience excellent or good. It has nothing to do with eligibility. Replaced on the card with two figures that actually make the point: **69-70% of unwinding disenrollments were procedural** rather than eligibility-based, and **47% of those disenrolled later re-enrolled** ([KFF](https://www.kff.org/medicaid/understanding-medicaid-procedural-disenrollment-rates/), [KFF](https://www.kff.org/medicaid/nearly-a-quarter-of-people-who-say-they-were-disenrolled-from-medicaid-during-the-unwinding-are-now-uninsured/)). |
| "PE can close in 30-60 days; nonprofit acquirers need 6-12 months" | Untraceable in either direction — and likely **inverted**. A 30-60 day figure does appear in this literature, but it refers to the *state regulatory notice period required before closing* a healthcare transaction ([Health Affairs Forefront](https://www.healthaffairs.org/content/forefront/private-equity-health-care-state-based-policy-perspective)), which is close to the opposite of a private-equity speed advantage. |
| "Unmet basic needs are the most common preventable barrier to housing placement completion" | No source located. The superlative is what makes it unpublishable; the underlying observation may well be right, but "most common" is an empirical claim requiring evidence. |

### Published with explicit hedge (3)

| Framework claim | Hedge applied |
|---|---|
| "Navigator time-use studies consistently report 30-40% of hours on documentation" | **No navigator/CHW/case-manager study supports this** — the nearest CHW time-use study (rural Tanzania) puts documentation at 7.8%, not comparable. The card now cites the solid *physician* literature instead — Sinsky et al.: **49.2% of physician time on EHR and desk work vs. 27% direct face time** ([Annals of Internal Medicine, 2016](https://www.acpjournals.org/doi/10.7326/M16-0961)) — and names the navigator-specific data gap as itself notable. |
| "Turnover costs $8,000-15,000 per hire" | Not traceable to a CHW study, and comparable estimates **bracket it incompatibly**: ~$2,100-4,200 per instance for direct care workers, against $35-50K under percentage-of-salary methods for a $69K role. The card reports the range of methodologies rather than asserting a figure. |
| "Many navigators spend personal money on client needs" | Real but weakly transferable: a BASW membership survey found **~70% of 290 social workers** had used their own money or resources for clients ([via Community Care](https://www.communitycare.co.uk/2018/07/31/social-workers-use-money-buy-food-clothing-service-users-survey-finds/)) — UK social workers rather than US navigators, and a membership survey rather than peer-reviewed work. Labelled indicative only. |
| "340B is the most concrete financial incentive for preserving FQHC designation" | Superlative dropped. Directionally defensible — 340B savings are a significant margin source — but the value concentrates in commercial and Medicare volume, since Medicaid is typically carved out or reimbursed near acquisition cost. |

---

## How it's presented

Both fields sit in a `.card-foot` block beneath each card's options, separated by a dashed rule and set at 0.75rem in muted type — **present and checkable, deliberately not the focal point**, matching how the source framework subordinated them.

Each evidence note states its corrections inline, and anything not being republished is called out in a distinct colour with the reason. A section-level note above the cards tells the reader that 6 of 13 claims failed verification, so the failure rate is visible rather than buried.

The day-to-day descriptions are carried across largely intact — they describe workflow rather than making factual claims about the world, so they needed no external verification. One exception: the flex-funds card's original example turned on a **$35 government ID fee**, which an earlier pass established **California's DMV waives for people experiencing homelessness**. That card's day-to-day note now uses a generic small-cost example and flags the waiver explicitly.

---

## Scope note

The source framework carries 20 issues; the repo carries a curated 6. The 13 evidence claims verified here are those attached to the 6 published cards. Items 2, 3, 5, 6, 8, 9, 10, 12, 13, 15, 16, 17, 19 and 20 carry their own 📎 claims that were **not** verified in this pass — if any are promoted into the repo later, they need the same treatment first, and should not be assumed sound given a 46% failure rate in this sample.

---

## Verification performed

- Tag balance confirmed on both files across 16 element types, zero mismatches (the checker was also fixed this pass: its naive `<li` substring match had been counting `<link>` and the chart's six `<line>` elements as unclosed list items)
- All six evidence notes confirmed matched to their correct card by parsing each `.insight-card` block and checking the heading against the evidence text
- All six cards confirmed to carry both a day-to-day note and an evidence note
- 13 new source links added to the page, all resolving to the primary or issuing source rather than a secondary summary where one was available
