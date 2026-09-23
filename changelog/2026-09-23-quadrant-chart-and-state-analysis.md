# Changelog: Access/Cost Scatter Chart, Full State Analysis, Link States

**Date:** 2026-09-23
**Scope:** Tab 5 (Special Topics: Access & Cost under OBBBA) in `index.html`; the Bay Area companion page (`special-topics/bay-area-navigation.html`).

Three changes, all presentation or depth — no new policy claims beyond the two catalysts noted in §2.

---

## 1. Link states on the companion page

Body links on the Bay Area page previously inherited browser-default blue/purple, which clashed with the page's bay-toned palette and gave no reliable read on which sources a reader had already opened.

They now carry an explicit three-state treatment drawn from the page's own tokens:

| State | Light | Dark |
|---|---|---|
| Unvisited | `--bay` `#1f5f74` | `#5fa9bd` |
| **Visited** | `--visited` `#6b4a7a` | `#c39ad4` |
| Hover | `--bay-bright` `#2f8fa8` + thicker underline | `#7cc3d6` |

A new `--visited` token is defined in all three theme states (bare `:root`, the `prefers-color-scheme: dark` block, and the explicit `[data-theme="dark"]` stamp), so the visited colour resolves correctly whether the viewer is on system default, forced light, or forced dark. Focus-visible outlines were added at the same time.

This covers the Alameda County citation that prompted the request — *"14,600 of ~159,000 subject residents losing coverage in 2026-27"* — along with every other body link in callouts, sections, tables, and lists.

---

## 2. Coverage/cost grid replaced with an access × cost scatter chart

The section previously used a 2×2 category matrix: catalysts sorted into four labelled cells. That conveyed origin but not magnitude, and gave no sense of catalysts pulling in opposite directions.

It is now an inline SVG scatter chart, following the reference layout supplied by the repo owner:

- **Horizontal axis:** access impact, loss ← → gain
- **Vertical axis:** cost impact, down ← → up
- **Four labelled quadrants**, washed by severity — *access lost / cost up* (red) through *access gained / cost down* (green)

**Catalyst root is preserved in marker shape and colour**, which was the explicit requirement — the chart adds the access/cost dimensions without losing the legislative-vs-market attribution the previous version carried:

| Marker | Root | Items |
|---|---|---|
| ● Red circle | **OBBBA provision** | Work requirements; immigrant eligibility cuts; 6-month redeterminations; uncapped PTC clawback (§71305); provider tax & SDP caps; Rural Health Transformation Fund |
| ◆ Amber diamond | **Other federal law / policy** | Enhanced PTC expiration; MA risk adjustment / RADV; IRA drug price negotiation |
| ■ Blue square | **Market / structural** | Admin capacity strain; employer coverage erosion; uncompensated care shift; vendor/admin spend; GLP-1 & specialty drug trend |
| ▲ Green triangle | **State action** | State mandate variation; Medicaid VBC & housing-health integration |
| ★ Purple star | **Litigation** | *Commonwealth of Massachusetts et al. v. Oz* |

Each of the 17 markers carries a `<title>` tooltip with the full detail and dates that previously sat in bullet text, so no content was lost in the conversion.

Two catalysts were added that the prior grid did not carry, both already documented elsewhere in this repo: **IRA drug price negotiation** (Top Shift #2 — Cycle 1 prices effective January 2026) and **Medicaid value-based care / housing-health integration** (the CalAIM Community Supports work covered on the companion page). They occupy the access-gained/cost-down quadrant, which was otherwise empty and made the chart read as one-directional.

A closing note states plainly that **positions are qualitative judgements about direction and rough magnitude, not measured coordinates**, and draws the actual analytic point: nearly everything OBBBA does directly lands in *access lost, cost up*, while the offsets that pull the other way are fewer, smaller, and several depend on authority that expires or is still in litigation.

The chart scrolls horizontally in its own container below ~620px rather than compressing — charts and tables being the one thing permitted to do so.

---

## 3. Any-state drill-down now carries case-study-level analysis

The drill-down previously returned five fields per state. It now returns a full analytic record comparable in structure to the California/Montana/Georgia cards, while staying rigorous about what is actually known per state.

**Three kinds of content are kept strictly separate, and the card says which is which:**

1. **Verified state fact** — the top grid: expansion status, work-requirement timeline, administering agency, litigation posture, and (for 7 of 51 jurisdictions) a sourced coverage-loss figure.
2. **Category-level analysis** — a four-part block (*Exposure*, *Action posture*, *What to watch*, *Cost-shift path*) written per category, plus a litigation overlay for the 26 plaintiff jurisdictions. These are true of the category, and the card states explicitly that they are "the pattern that follows from this state's category — not a separately-researched finding about this state."
3. **Explicit gaps** — the 44 jurisdictions without a verified figure now say so in full: *"deliberately left blank rather than extrapolated from a national average."*

**Relevant stakeholders** were added per the request to contextualise impact and action. Each is composed from verifiable facts rather than assertion:

- The state's **administering Medicaid agency**, named individually — 51 distinct agencies (e.g. AHCCCS for Arizona, Med-QUEST for Hawaii, TennCare for Tennessee, BadgerCare Plus for Wisconsin)
- The **state Attorney General's office**, for the 26 litigant jurisdictions only
- **Medicaid managed care plans** in the state — or, for non-expansion states, **marketplace enrollees and navigators**, since that is where exposure actually runs
- The **state Hospital Association and its safety-net/FQHC members**
- **County/local eligibility offices**, for Early Adopter and Administratively Overwhelmed categories, where they are the operational bottleneck

The six category narratives (Early Adopter, Waiver-Only/Non-Expansion, Expansion+Waiver, Administratively Overwhelmed, Standard Expansion, Non-Expansion) were written to be accurate at category level — including the Standard Expansion one, which states outright that the state's action posture is "not separately documented for this state in this project's research."

---

## Verification performed

- All 8 `data/*.json` files parse; service-type → CMMI cross-references intact
- HTML tag balance confirmed: div 190/190, svg 6/6, `<g>` 20/20 (including attributed groups), text 23/23, script 9/9, style 1/1
- SVG marker census matches the legend: 6 circles, 3 diamonds, 5 squares, 2 triangles, 1 star = 17 markers, each with a `<title>`
- Drill-down script run against a DOM stub across all 51 jurisdictions: every state renders 5 fact fields, an analysis block with ≥5 rows, a stakeholder list, and the scope disclaimer, with no `undefined` / `null` / `[object Object]` leaks
- **51 distinct administering agencies** — confirming no state inherited another's agency name
- **26 states show the litigation overlay** — matching the coalition count published elsewhere on the tab
- Non-expansion states (spot-checked on Wyoming) correctly report no general expansion population subject to the requirement, rather than defaulting to the national timeline
