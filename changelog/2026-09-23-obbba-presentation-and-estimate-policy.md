# Changelog: OBBBA Tab — Presentation, Interactivity & Conservative-Estimate Policy

**Date:** 2026-09-23
**Scope:** Tab 5 (Special Topics: Access & Cost under OBBBA) in `index.html`, and the Bay Area companion page (`special-topics/bay-area-navigation.html`).
**Nature:** Presentation, interaction, and framing changes. No new policy claims were introduced; the one substantive content change is a shift in *which* existing figure each section leads with (see item 7).

---

## 1. "Archetype" replaced with "Category"

All user-facing uses of "archetype" on the OBBBA tab are now "category" — section title, table column header, table-body cross-references, case-study intro, and the limitations section. The anchor `#special-archetypes` became `#special-categories`, and the table of contents was updated to match.

Section title is now **"Categories of Impact: Five State Response Patterns."**

---

## 2. Coverage / cost quadrant is now visual

The 2026-2030 landscape section previously carried four text blocks of bulleted catalysts. It is now a true 2×2 matrix with labelled axes — *Legislative/Regulatory* vs. *Market/Structural* across the top, *Coverage impact* vs. *Cost impact* down the side — and each catalyst is a colour-coded chip.

The full detail that used to sit in the bullet text now lives in a tooltip on each chip (hover, or keyboard focus via `tabindex="0"`), so no information was lost while the section's visual weight went down substantially in a very text-heavy page.

Chips are colour-coded by a three-way legend:
- **Direct OBBBA provision** (red)
- **Separate / compounding catalyst** (blue) — e.g. the enhanced-PTC expiration and RADV litigation, which are *not* OBBBA
- **Partial offset** (green) — the Rural Health Transformation Fund

Below 760px the matrix stops behaving as a matrix, so it stacks into four labelled blocks (each cell carries its own "Coverage impact · Legislative catalyst" style label, hidden on desktop) rather than being squeezed or scrolling sideways.

---

## 3. Any-state drill-down added

The case-study section keeps its three deep-dive cards (California, Montana, Georgia) and gains an **Any-State Drill-Down** below them: a dropdown covering all 50 states plus DC. Selecting a jurisdiction renders its category assignment, Medicaid expansion status, work-requirement timeline, litigation posture, and whichever coverage-loss figure is actually verifiable for it.

Implemented as a self-contained inline script scoped to the tab — no changes to any file in `js/`.

Data integrity was checked programmatically against this project's own published totals:
- 51 jurisdictions, no duplicates
- 41 expansion jurisdictions (40 states + DC) — matches the documented total
- 10 non-expansion states: AL, FL, GA, KS, MS, SC, TN, TX, WI, WY
- 26 litigant jurisdictions (25 states + DC) — matches the coalition count published elsewhere on the tab

**Only 7 jurisdictions carry a verified state-specific figure** (CA, GA, IA, MT, NE, ND, TX). The other 44 render an explicit *"No verified state-specific coverage-loss estimate located for this state in this research pass"* rather than an extrapolation, and every state links out to the [KFF work-requirements tracker](https://www.kff.org/medicaid/medicaid-work-requirements-tracker-overview/) and the [Georgetown CCF H.R.1 Readiness Tracker](https://ccf.georgetown.edu/2026/08/24/h-r-1-readiness-tracker-update-strain-is-building-before-the-work-reporting-requirements-clock-starts/) to check for newer numbers.

Section retitled **"State Drill-Down: California, Montana, Georgia — plus any-state lookup."**

---

## 4. Header and subheader treatment aligned to the site theme

Section titles on the OBBBA tab now carry a 4px accent rule in the site's `--accent` cyan against `--navy` text, with a new `.sp-subhead` style in `--teal` for subheadings and a `.sp-note-strong` callout treatment. All of it is scoped under `#tab-special` in a style block inside the tab — **`css/styles.css` was not modified**, consistent with the project's frozen-stylesheet rule.

The Bay Area companion page's section headers pick up an equivalent rule in its own `--bay-bright`, so the two pages read as one family while the companion page keeps its distinct typographic identity.

---

## 5. Actionable insights reframed as exploratory

The companion page's insights section is now **"Potential Actionable Insights for Navigation Networks,"** with a callout stating the intent plainly: these are options to explore, not recommendations or a plan of record; the point is to map the solution space and its trade-offs, not to predict or prescribe what any organization will do. It notes explicitly that several options depend on unsettled decisions (CalAIM waiver renewal, MCP contracting, litigation outcomes).

Card labels were rephrased to match: *Primary action* → **Lead option to weigh**, *Alternative* → **Fallback option**, *Incentive leverage* → **Why it could hold — incentive leverage**. The masthead and the inbound link from the OBBBA tab were updated to the same framing.

---

## 6. Notable People & Entities — horizontal scroll removed

The table previously forced a horizontal scrollbar because `.p-name` was set to `white-space: nowrap` while several rows held five organization names in a single cell.

Fixed by: removing `nowrap`, switching to `table-layout: fixed` with explicit 24/26/50 column widths, allowing `overflow-wrap`, breaking the multi-entity cells into proper lists, and moving the county names out of the name column into the role column. Below 640px the table stacks into labelled cards (via `data-label` attributes), so it never scrolls sideways at any width.

---

## 7. Conservative-estimate policy applied throughout

A stated policy now appears near the top of the OBBBA tab and in the companion page's methodology: **where a range exists, lead with the most conservative credible figure — normally the issuing agency's own central estimate — and name the higher-end scenario separately rather than headlining it.** Where no state- or organization-specific figure is traceable to a named source, say so rather than extrapolating from a national average.

Applied changes:

| Location | Was | Now |
|---|---|---|
| California case study, tipping point | "the realized number could exceed DHCS's 3.4M at-risk estimate" | Leads with DHCS's **~1.1M central estimate** as the figure the page uses; 3.4M explicitly labelled a high-end scenario "not to be treated as the expected outcome" ([CHCF, citing DHCS](https://www.chcf.org/resource/2026/06/05/hr1-work-requirement-affect-californians-medi-cal-policy-at-a-glance/)) |
| Nebraska, categories table | "~200 … ; advocates project 20,000-40,000 eventually" | ~200 identified as the state Medicaid director's own figure and the headline; the 20,000-40,000 advocacy projection explicitly **not adopted** as the expected outcome |
| Montana case study | "~13,000 … this is a floor, not a ceiling" | Attributed to DPHHS with a source link, noting the page uses the agency figure rather than the wider 10,000-30,000 span in circulation ([Montana Free Press, citing DPHHS](https://montanafreepress.org/2026/07/01/montana-medicaid-work-requirements-loom-questions-remain/)) |
| Bay Area at-risk org tables | Ranges presented neutrally | New callout: **read the low end**, with the reason (the methodology overstates exposure, since only ~⅓ of Medi-Cal enrollment is subject to the requirement) and a grounded reference point — [Alameda County's own 14,600-of-159,000 projection, about 9%](https://citizenportal.ai/articles/7900892/california/alameda-county/officials-warn-hr1-could-strip-health-and-food-benefits-and-raise-alameda-county-costs) |
| Behavioral-health externality row | "Up to $200-500K/yr per cycling patient" | "+$200K/yr at the conservative end" |
| Georgia GAO figures | Cited without a link | Linked to the primary source ([GAO-25-108160](https://www.gao.gov/assets/gao-25-108160.pdf)) |
| California LAO figure | Cited without a link | Linked to the [LAO report](https://lao.ca.gov/Publications/Report/5180) |

---

## Verification performed

- All 8 `data/*.json` files parse; service-type → CMMI cross-references intact
- HTML tag balance confirmed on both files (div, table, tr, td, span, section, ul, script, style, select, option all matched)
- The drill-down script was extracted and run against a DOM stub: 52 options render, all 51 jurisdictions produce a complete 5-field record without throwing, and no `undefined` / `null` / `[object Object]` leaks into the output
- Dataset totals cross-checked against the expansion and litigant counts published elsewhere on the tab
