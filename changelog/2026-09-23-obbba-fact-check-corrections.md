# Changelog: OBBBA Special Topics Fact-Check & Correction Pass

**Date:** 2026-09-23
**Scope:** Tab 5 (Special Topics: Access & Cost under OBBBA), the Bay Area companion page, `top_shifts.json`, `cmmi_models.json`, `datasets.json`, and README.md.
**Trigger:** An external fact-check audit ("Policy Synthesis — Fact-Check & Correction Map") submitted against commit `f01962f`, cross-checked against an independent verification pass on the highest-stakes items before being applied.

This changelog documents every correction made in this pass, organized to match the audit's own section numbering, with the source used for each fix. Where the independent verification pass (below) confirmed or adjusted a claim, that's noted inline.

---

## Independent verification pass

Before applying the audit's ~30 corrections, 9 of the highest-stakes items — ones that would *reverse* content already published in an earlier round — were independently re-checked via primary-source research. Result: 8 of 9 confirmed the audit; 1 (litigation coalition count) found the *already-published* repo content was more accurate than the audit's own recount.

| # | Claim checked | Verdict | Source |
|---|---|---|---|
| 1 | RADV extrapolation status | Audit correct — vacated, not finalized | [Mintz](https://www.mintz.com/insights-center/viewpoints/2146/2025-10-01-radv-odyssey-extrapolation-vacated), [Georgetown docket order](https://litigationtracker.law.georgetown.edu/wp-content/uploads/2023/09/Humana-Inc._2025.09.25_ORDER-ON-MOTION-FOR-SUMMARY-JUDGMENT.pdf), [Crowell](https://www.crowell.com/en/insights/client-alerts/cms-appeals-humana-v-becerra) |
| 2 | TEAM model episode window | Audit correct — 30 days, not 90 | [Rainfall Health / TEAM overview](https://www.rainfallhealth.com/cms-team/) |
| 3 | ETC/IOTA mandatory status | Audit correct — ETC was mandatory 2021-2025, predates TEAM | [ETC background, PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC11737440/) |
| 4 | *Massachusetts v. Oz* coalition count & PI-denial date | **Repo's published "25 states + DC" was correct**; audit's "23 states + DC" undercounted by omitting KY/PA governor-states. PI denial date tightened to **July 29, 2026** (docket date; STAT News's July 30 report is a 1-day reporting lag) | [Georgetown Litigation Tracker](https://litigationtracker.law.georgetown.edu/litigation/commonwealth-of-massachusetts-et-al-v-oz-et-al/), [STAT News](https://www.statnews.com/2026/07/30/medicaid-work-requirements-judge-declines-states-request-injunction/) |
| 5 | Texas Medicaid expansion status | Audit correct — Texas never expanded Medicaid | [healthinsurance.org](https://www.healthinsurance.org/medicaid/texas/) |
| 6 | Tribal exemption from work requirements | Audit correct — categorical exemption in CMS-2454-IFC | [Family Voices](https://familyvoices.org/understanding-medicaid-work-requirement-interim-final-rule-ifr/), [Natlawreview](https://natlawreview.com/article/cms-issues-interim-final-rule-medicaid-work-requirements) |
| 7 | HTI-5 proposed rule (AI transparency rollback) | Audit correct — proposed, not finalized, as of Sept 2026 | [Healthcare Dive](https://www.healthcaredive.com/news/astp-onc-hti5-ai-model-cards-health-it-certification-proposed-rule/808582/), [ReedSmith](https://www.reedsmith.com/our-insights/blogs/health-industry-washington-watch/102m1ob/hti-5-proposal-signals-health-it-deregulation-and-fhir-first-interoperability-and/) |
| 8 | CMMI model terminations / LEAD model | Audit correct — PCF/MCP/ETC ended early; ACO REACH ends 12/31/2026; LEAD launches 1/1/2027 | [AHA](https://www.aha.org/news/headline/2025-03-13-cms-innovation-center-end-four-payment-models-early), [Modern Healthcare](https://www.modernhealthcare.com/politics-regulation/mh-cms-aco-reach-lead-model-2027/), [Bass Berry](https://bassberry.com/news/cms-lead-model-request-for-applications-released/) |
| 9 | FDA PCCP guidance finalization date | Audit correct — Dec 4, 2024, not Aug 2025 | [Federal Register](https://www.federalregister.gov/documents/2024/12/04/2024-28361/marketing-submission-recommendations-for-a-predetermined-change-control-plan-for-artificial), [Ropes & Gray](https://www.ropesgray.com/en/insights/alerts/2024/12/fda-finalizes-guidance-on-predetermined-change-control-plans-for-ai-enabled-device) |

Given that hit rate, the remaining ~20 items were applied directly from the audit's own citations (below) without a separate re-verification round.

---

## Section 1 — Factual errors (fixed)

**1-A. Bay Area county "at-risk" counts.** Alameda's 290,000-380,000 and Santa Clara's ~500,000 figures were total-enrollment counts mislabeled as projected coverage loss. Replaced with Alameda County's own official projection (14,600 of 159,000 subject lose coverage in 2026-27, 50,000+ by 2030) and UC Berkeley Labor Center's Santa Clara figure (129,000 by 2028, against ~460,000 enrolled).
Sources: [Alameda County board presentation, citizenportal.ai](https://citizenportal.ai/articles/7900892/california/alameda-county/officials-warn-hr1-could-strip-health-and-food-benefits-and-raise-alameda-county-costs), [UC Berkeley Labor Center county projections](https://laborcenter.berkeley.edu/projected-reduction-in-medi-cal-coverage-due-to-federal-h-r-1-and-2025-26-state-budget-by-county-2028/), [San José Spotlight](https://sanjosespotlight.com/thousands-to-lose-medi-cal-and-food-aid-in-santa-clara-county/)

**1-B. Native American Health Center exposure.** Tribal members are a categorical statutory exemption from the work requirement (CMS-2454-IFC) — re-ranked the org's rationale to its real exposure (IHS Title V funding, non-Tribal expansion patients) instead of a flat Medi-Cal %.
Sources: [CMS IFR fact sheet](https://www.cms.gov/newsroom/fact-sheets/medicaid-community-engagement-requirement-certain-individuals-interim-final-rule-comment-period-cms), [AHA summary](https://www.aha.org/news/headline/2026-06-01-cms-issues-interim-final-rule-medicaid-community-engagement-requirements)

**1-C. Regional Medi-Cal MCO list.** Partnership HealthPlan of CA serves Northern California counties, not the five Bay Area counties. Replaced with Contra Costa Health Plan and Health Plan of San Mateo.
Sources: [CA DMHC plan locator](https://www.dmhc.ca.gov/HealthPlanInformation/FindaHealthPlan.aspx), [DHCS managed care plan directory](https://www.dhcs.ca.gov/individuals/Pages/MMCDHealthPlanDir.aspx)

**1-D. LifeLong Medical Care — 340B mechanism.** FQHC 340B eligibility flows from HRSA Section 330 grant status, not a Medi-Cal volume threshold. Corrected LifeLong's entry; added the real DSH-threshold 340B risk (11.75% Medicaid-inpatient-day floor) to AHS, ZSFG, and SCVMC instead.
Sources: [HRSA 340B FQHC eligibility](https://www.hrsa.gov/opa/eligibility-and-registration/health-centers/fqhc/index.html), [42 U.S.C. §256b(a)(4)(L)](https://www.govinfo.gov/content/pkg/USCODE-2021-title42/pdf/USCODE-2021-title42-chap6A-subchapV-partA-sec256b.pdf)

**1-E. Immigrant eligibility — wrong mechanism cited for FQHC revenue.** §71302 is a marketplace PTC rule, not Medi-Cal. Added §71109 (the actual Medicaid-side provision, ~200,000 CA immigrants moved to partial-scope Medi-Cal) as the real driver for La Clínica/SFCHC revenue exposure; kept §71301/§71302 correctly scoped to marketplace effects.
Sources: [UC Berkeley Labor Center](https://laborcenter.berkeley.edu/projected-reduction-in-medi-cal-coverage-due-to-federal-h-r-1-and-2025-26-state-budget-by-county-2028/), [Georgetown CHIR](https://chir.georgetown.edu/recent-federal-aca-marketplace-changes-strip-access-to-health-care-for-many-lawfully-present-immigrants/), [OBBBA text](https://congress.gov/bill/119th-congress/house-bill/1)

**1-F. "Housing instability" is not a work-requirement exemption.** Removed from the exemption list; corrected to CMS's actual categorical exemptions and the IFR's self-attestation limits.
Sources: [AHA IFR exemption summary](https://www.aha.org/news/headline/2026-06-01-cms-issues-interim-final-rule-medicaid-community-engagement-requirements), [Federal Register, full IFR text](https://www.federalregister.gov/documents/2026/06/03/2026-11094/medicaid-program-community-engagement-requirement-for-certain-individuals)

**1-G. Texas archetype mislabeling.** Texas never adopted ACA Medicaid expansion, so it has no population subject to the work requirement. Removed from the "Administratively Overwhelmed" archetype; kept its confirmed application-backlog figure with a note attributing it to SNAP/redetermination strain instead.
Sources: [Houston Public Media](https://www.houstonpublicmedia.org/articles/news/health-science/healthcare/2026/09/01/560833/), [KFF Medicaid expansion map](https://www.kff.org/medicaid/issue-brief/status-of-state-medicaid-expansion-decisions-interactive-map/)

**1-H. Preliminary injunction date.** Corrected "early August 2026" to **July 29, 2026** everywhere it appears (see verification-pass item 4 above).

**1-I. TEAM model — three errors.** Not "first mandatory CMMI model since CJR" (ESRD Treatment Choices was mandatory 2021-2025); 30-day post-discharge window, not 90; Top Shift card now matches `cmmi_models.json`'s 5 episode types.
Source: [CMS TEAM model overview](https://innovation.cms.gov/innovation-models/team)

**1-J. AI Governance Top Shift — two errors.** FDA PCCP guidance finalized Dec 2024, not Aug 2025 (verification-pass item 9). Joint Commission's 22,000+ figure is accredited healthcare organizations, not hospitals specifically.
Source: [The Joint Commission — facts page](https://www.jointcommission.org/about-us/facts-about-the-joint-commission/)

**1-K. CMS-0057-F compliance date.** Split into two distinct obligations on different timelines: prior-auth decision-timeframe compression effective Jan 1, 2026; the four-API FHIR buildout deadline effective Jan 1, 2027 — previously conflated as one.
Source: [CMS-0057-F final rule](https://www.cms.gov/priorities/key-initiatives/burden-reduction/advancing-interoperability/cms-interoperability-and-prior-authorization-final-rule-cms-0057-f)

---

## Section 2 — Stale claims (updated)

**2-A. RADV extrapolation vacated.** N.D. Texas vacated CMS's 2023 RADV rule (Sept 25, 2025); government appeal pending at the Fifth Circuit (No. 25-11293) with no ruling as of this pass. Corrected from "finalized."
Sources: verification-pass item 1 above.

**2-B. AI Governance — HTI-5 reverses the framing.** ONC/ASTP's HTI-5 proposed rule (Jan 2026) proposes *removing* AI model-card/transparency requirements from HTI-1, not adding to a maturing regime. Retitled the Top Shift and rewrote its implications to reflect a contracting federal floor.
Sources: verification-pass item 7 above.

**2-C. CMMI model end dates.** Added end dates: PCF (2025-12-31), MCP (2025-06-30), ACO REACH (2026-12-31). Added the new LEAD model (2027-01-01 to 2036-12-31), REACH's successor.
Sources: verification-pass item 8 above.

**2-D. Fee schedules two cycles behind.** README's "CY/FY 2025 Final Rules" label updated to CY/FY 2026, noting OBBBA's one-year 2.5% PFS payment increase.
Sources: [CMS CY2026 PFS](https://www.cms.gov/medicare/payment/fee-schedules/physician), [CMS CY2026 OPPS/ASC](https://www.cms.gov/medicare/payment/prospective-payment-systems/hospital-outpatient)

**2-E. 2027 cost-trend range — mixed years.** PwC's 9%/8.5% figure confirmed for 2027. Aon's oft-cited "9.5%" carries a year ambiguity this project could not resolve (one source dated Sept 2025 headlines it for 2026, another dated Aug 2026 headlines it for 2027) — flagged inline rather than asserted. Mercer and WTW figures flagged as not independently re-verified.
Sources: [PwC Behind the Numbers](https://www.pwc.com/us/medicalcosttrends), [Aon — 2026 projection](https://aon.mediaroom.com/2025-09-10-Aon-U-S-Employer-Health-Care-Costs-Expected-to-Rise-9-5-Percent-in-2026), [Aon — 2027 projection](https://aon.mediaroom.com/2026-08-20-Aon-U-S-Employer-Health-Care-Costs-Continue-Multi-Year-Climb,-Projected-to-Rise-9-5-in-2027)

**2-F. Arkansas missing from Early Adopters.** Added — CMS's own IFR names Arkansas alongside Montana and Iowa as an early-mover state (enforcement began July 1, 2026, delayed until Jan 2027).
Sources: [Holland & Knight](https://www.hklaw.com/en/insights/publications/2026/06/cms-issues-interim-final-rule-implementing-medicaid-community), [Applied Policy](https://www.appliedpolicy.com/cms-issues-interim-final-rule-on-medicaid-community-engagement-requirements/)

---

## Section 3 — Methodology critiques (applied)

**3-A. Revenue-at-risk methodology overstated exposure.** The Bay Area page's org-level $ figures applied a disenrollment rate to an org's *entire* Medi-Cal revenue, implying the whole book is at risk — but only the ACA expansion adult population (~34% of Medi-Cal enrollment statewide) is subject to the work requirement. Added this caveat directly to the Methodology section, with Alameda County's grounded 9% figure offered as a more reliable near-term reference than the page's own org-level ranges.
Sources: [CHCF policy brief](https://www.chcf.org/resource/hr1-work-requirement-affect-californians-medi-cal-policy-at-a-glance/), [Alameda County projections](https://citizenportal.ai/articles/7900892/california/alameda-county/officials-warn-hr1-could-strip-health-and-food-benefits-and-raise-alameda-county-costs)

**3-B. "$1 removed → $3-5 downstream" throughline unsupported as a general claim.** Narrowed to describe high-utilizer subgroups specifically (ESRD, behavioral health, SUD), noting the welfare-economics literature suggests the *average* multiplier across the full Medicaid population is likely below 1:1, since Medicaid substitutes for uncompensated care hospitals would provide anyway.
Sources: [Finkelstein, Hendren & Luttmer (NBER)](https://www.nber.org/papers/w21552), [CBO Medicaid analyses](https://www.cbo.gov/topics/health-care/medicaid)

**3-C. Externality table included exempt/backstopped populations.** Added inline caveats: pregnant/postpartum women and children are categorically exempt or not in the expansion population; most ESRD patients qualify for Medicare independently and the uninsured-cost figure likely uses charges rather than actual cost; Ryan White/ADAP is payer-of-last-resort for HIV care, making it the realistic counterfactual rather than untreated virologic failure; the homelessness cost comparison is from targeted high-utilizer research, not a population-wide average.
Sources: [CMS IFR exemptions](https://www.cms.gov/newsroom/fact-sheets/medicaid-community-engagement-requirement-certain-individuals-interim-final-rule-comment-period-cms), [Medicare ESRD eligibility](https://www.medicare.gov/basics/get-started-with-medicare/medicare-eligibility/end-stage-renal-disease), [Ryan White Program — payer of last resort](https://ryanwhite.hrsa.gov/grants/what-we-fund/payer-of-last-resort)

**3-D. Provider-tax/SDP impact window.** Added the nationwide Oct 1, 2026 provider-tax rate freeze; noted the SNF/ICF-IDD exemption from the 6%→3.5% phase-down; corrected the SDP-cap revenue-impact window to 2028-2032 (not 2026-2028 as the page's framing implied).
Sources: [AAMC §71115 analysis](https://www.aamc.org/advocacy-policy/washington-highlights/cms-issues-proposed-rule-implementing-obbba-provider-tax-provisions), [McDermott+](https://www.mcdermottplus.com/blog/regs-eggs/digging-into-recent-medicaid-provider-tax-changes/), [NAMD memo](https://eohhs.ri.gov/sites/g/files/xkgbur226/files/2025-07/NAMD-Memo-OBBBA-Medicaid-Policies.pdf)

---

## Section 4 — Actionable-insight corrections (applied to all 6 cards)

**4-A. Procedural disenrollment card.** Inverted the action order — data automation (ex parte renewal) is now primary, medical-legal partnerships secondary, based on Arkansas's actual 2018-19 rollout data (2/3 of the subject population verified administratively; of the rest, ~75% were disenrolled) and Nebraska's 88% ex parte renewal rate. Removed the unsourced "77% prevented" claim. Added the marketplace-PTC-ineligibility note and the retroactive-coverage-cut (3 months → 1 month) as a stronger hospital-incentive argument.
Sources: [Manatt — Arkansas evidence](https://manatt.com/getattachment/b44d1311-2380-4c96-8d8e-cec09dd67fb0/attachment.aspx), [Health Affairs](https://www.healthaffairs.org/content/forefront/reporting-requirements-matter-lot-evidence-medicaid-work-requirements-arkansas), [KFF — Nebraska](https://www.kff.org/medicaid/a-closer-look-at-nebraska-the-first-state-planning-to-implement-a-medicaid-work-requirement/)

**4-B. System fragmentation card.** Corrected the primary action — nonprofits generally can't get API access to CalHEERS/CalSAWS (state/county systems); redirected to California's Data Exchange Framework. Removed the unsourced 30-40% time-loss figure; added the HIPAA/HMIS (24 CFR 576)/42 CFR Part 2 consent-mapping prerequisite.
Sources: [DHCS Data Exchange Framework](https://www.dhcs.ca.gov/datadex), [HUD HMIS rules](https://www.hud.gov/program_offices/comm_planning/homeless/hmis)

**4-C. CHW workforce card.** Clarified that DHCS certification and MCP billing eligibility are separate processes; FQHC-specific CHW billing rules are still developing under CalAIM. Added CHCF's own finding that financial sustainability remains the central challenge for CHW programs even with the billable benefit in place.
Sources: [CHCF CHW Amplifying Impact Initiative](https://www.chcf.org/resource/amplifying-impact-initiative-evaluation/), [DHCS CalAIM](https://www.dhcs.ca.gov/calaim)

**4-D. Flex-funds card.** Replaced the flagship "$35 government ID" example — California's DMV already waives that fee for people experiencing homelessness (Vehicle Code §14902(i), form DL 937). Led with CalAIM Housing Deposits as the durable, Medi-Cal-billable primary vehicle instead of a grant-dependent discretionary fund; flagged the "10-30x leverage ratio" as unsourced.
Sources: [CA DMV ID fee waiver](https://www.dmv.ca.gov/portal/driver-licenses-identification-cards/identification-id-cards/), [DHCS CalAIM Community Supports](https://www.dhcs.ca.gov/provgovpart/Pages/CalAIM-Enhanced-Care-Management-and-Community-Supports.aspx)

**4-E. FQHC market-structure card.** Reframed: FQHC designation legally cannot survive a for-profit acquisition (requires HRSA Section 330 nonprofit/public-agency status), so "designation preservation" isn't a negotiable term with a for-profit buyer — the real lever is ensuring a mission-aligned nonprofit wins the acquisition in the first place. Added OHCA's material-change review process as the actual pre-close leverage point; noted Medi-Cal Rx already pays near acquisition cost, weakening the 340B argument specific to the Medi-Cal population.
Sources: [HRSA FQHC eligibility](https://www.hrsa.gov/opa/eligibility-and-registration/health-centers/fqhc/index.html), [CA OHCA market review](https://ohca.ca.gov/data-and-reports/healthcare-market-review/)

**4-F. Clinical-integration card.** Corrected: Community Supports billing is not contingent on an integrated care model — each MCP elects which supports to offer independent of org structure. Added the CalAIM 1115 waiver's December 31, 2026 expiration (renewal submitted May 2026, approval expected late December 2026) as a live risk, and recommended prioritizing In-Lieu-of-Services (ILOS) supports, which don't depend on waiver authority, over waiver-dependent ones.
Sources: [Aurrera Health — CalAIM renewal](https://www.aurrerahealth.com/blog/laying-the-groundwork-to-sustain-calaim-dhcs-concept-paper), [CHCS — CalAIM renewal context](https://www.chcs.org/media/National-Context-for-Californias-Renewal-of-CalAIM-in-2026.pdf)

---

## Section 5 — Verified correct (no change)

The audit confirmed the following were already accurate and required no correction: CMS-2454-IFC's core content/timing; Nebraska's ~200 first-round disenrollment figure; Georgia Pathways' GAO-sourced $54.2M/$26.1M admin/care split; Texas's ~1,600→211,000 application backlog figure itself (only its archetype placement was wrong, see 1-G); the Oct 1, 2026 provider-tax freeze date; the 21-AG NBPP lawsuit's filing details; the enhanced ACA PTC expiration and the House's (unenacted) extension vote; Michelle Baass's and Tyler Sadwith's DHCS roles; PwC's 2027 cost-trend figures.

One nuance added: Georgia's admin-to-care spending ratio is front-loaded, not a steady state — administrative share fell from 96.5% of spend in FY2023 to 58.8% in FY2024. ([KFF Health News](https://kffhealthnews.org/morning-breakout/admin-costs-outpace-health-spending-in-ga-s-medicaid-work-program-gao/))

---

## Section 6 — Housekeeping

- **6-A.** Standardized Georgia's eligible-population figure to 246,365 (was inconsistently 240,000/250,000 across files) and its federal admin-cost share to 88% (was inconsistently 88%/90%). Clarified units on the Bay Area org tables' "$ at risk, 2026-28" column headers (total-exposure vs. annualized framing differ between the resilient and at-risk tables).
- **6-B.** Removed the broken README links to the untracked implementation-guide file.
- **6-C.** Added `analytical.js` and `data/analytical_tasks.json` to the README repository-structure diagram (both existed but were undocumented).
- **6-D.** Added three datasets to `data/datasets.json` that the audit identified as the authoritative primary sources this project should cite instead of secondary estimates: T-MSIS/TAF (Medicaid claims/eligibility), HRSA UDS (FQHC patient-level payer mix), and CA HCAI Hospital Financial Data (California hospital financial disclosures).

---

## Incident note

Mid-correction, a script-based inline-data block replacement in `index.html` briefly duplicated the entire file (a boundary-detection bug in a Node one-liner). Caught immediately via the routine post-edit JSON/tag-balance validation this project runs after every batch of changes, repaired surgically by re-splicing the file around the correct boundaries, and re-validated clean before continuing. No corrupted version was ever committed.
