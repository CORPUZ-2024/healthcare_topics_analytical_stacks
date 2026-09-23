# Healthcare Topics Analytical Stacks — Policy Synthesis

[![Live Site](https://img.shields.io/badge/Live%20Site-GitHub%20Pages-0d1b2a?style=for-the-badge&logo=github)](https://corpuz-2024.github.io/healthcare_topics_analytical_stacks/)

**https://corpuz-2024.github.io/healthcare_topics_analytical_stacks/**

A maintainable knowledge base and interactive visualization suite covering U.S. healthcare legislation, payment models, CMMI innovation programs, and research datasets. Built to support policy analysis, regulatory assessment, and evidence-based decision making.

---

## Live Tool

**Open in browser:** [https://corpuz-2024.github.io/healthcare_topics_analytical_stacks/](https://corpuz-2024.github.io/healthcare_topics_analytical_stacks/)

Or open `index.html` directly from the repo — no server required. All data is embedded inline.

> Requires an internet connection to load D3.js v7 from CDN.

---

## What's Inside

### Five Tabs

| Tab | Visualization | What it shows |
|-----|--------------|---------------|
| **Ontology Graph** | D3.js force-directed graph | Two force-directed graphs: Legislative Map (legislation → agencies → programs → rules) and Payer & Company Map (plans, providers, pharma, health IT connected to CMS mandates), plus the Top Shifts cards |
| **Reimbursement Roadmap** | 3-level hierarchy swimlane (2010–2028) | Eligibility-based mapping of CMMI innovation models to 12 service types, organized by 6 official CMMI categories |
| **Data Taxonomy** | Filterable, sortable table | CMS and public research datasets with linkage variables and metadata, plus static coding-system and cross-program-variable reference sections |
| **Analytical Stacks** | Expandable card grid | 14 analysis task types with tech/analytical stacks, healthcare use cases, and caveats |
| **Special Topics: OBBBA** | Static reference + interactive lookup | One Big Beautiful Bill Act (P.L. 119-21) national provisions, a 5-category state impact table, individual mandate variation, a visual coverage/cost quadrant with tooltips, case studies for CA/MT/GA plus an any-state drill-down covering all 50 states + DC, and a topic-organized reading guide — see [Tab 5](#tab-5--special-topics-access--cost-under-obbba) below |

---

## Repository Structure

```
healthcare_ref_materials/
├── index.html                  # Single-page app entry point (open in browser)
├── css/
│   └── styles.css              # Theme and component styles
├── js/
│   ├── ontology.js             # Force-directed ontology graph (D3 v7)
│   ├── reimbursement.js        # Swimlane timeline visualization (D3 v7)
│   ├── taxonomy.js             # Dataset table with filters, sort, CSV export
│   ├── analytical.js           # Analytical Stacks card grid (filters, expand/collapse)
│   └── app.js                  # Tab controller and initialization
├── data/
│   ├── ontology_nodes.json     # 39 nodes: legislation, agency, program, model, rule
│   ├── ontology_edges.json     # 54 directed relationships
│   ├── company_nodes.json      # 117 nodes: payer, provider, pharma, hit, analytics, govt, digital, ai_gov, emergent
│   ├── company_edges.json      # 170 directed relationships (hier, serves, partner, funds, tension, cloud_ehr_partnership, regulates, certifies, sets_voluntary_standard_for, provides_internal_governance_for)
│   ├── top_shifts.json         # 6 active policy shifts with catalysts and implications
│   ├── cmmi_models.json        # 23 CMMI models with start/end dates (6 official categories)
│   ├── service_types.json      # 12 service types with fee schedules
│   ├── datasets.json           # 26 CMS and public research datasets (incl. Drug/Formulary, T-MSIS/TAF, HRSA UDS, CA HCAI)
│   └── analytical_tasks.json   # 14 analysis task types backing the Analytical Stacks tab
├── cli/
│   └── update.py               # Phased update CLI (see below)
├── special-topics/
│   └── bay-area-navigation.html # Standalone companion page — Bay Area org risk rankings, county breakdown, externality cost reference, navigator action framework (linked from Tab 5)
├── changelog/                  # Dated correction and revision logs, each entry linked to its sources
└── project_specs/              # Spec/planning working files (not tracked in this repo)
```

---

## Tab 1 — Ontology Graph

The Ontology tab contains two switchable force-directed graphs and a Top Shifts section below.

### Legislative Map

**39 nodes across 5 categories:**

| Category | Color | Examples |
|----------|-------|---------|
| Legislation | Red | ACA, MACRA, HITECH, IRA 2022 |
| Agency | Purple | CMS, CMMI, ONC, AHRQ |
| Program | Teal | Medicare Parts A–D, Medicaid, CHIP, QPP, MSSP |
| Model | Steel blue | ACO REACH, BPCI Advanced, EOM, MCP, GUIDE, AHEAD |
| Rule | Orange | IPPS, OPPS, PFS, ESRD Final Rules |

### Payer & Company Map

**117 nodes across 11 categories:**

| Category | Color | Examples |
|----------|-------|---------|
| Legislation | Red | ACA §3021/3022, MACRA, IRA 2022, HITECH, 21st Century Cures |
| Program | Teal | Medicare Advantage, Medicaid/CHIP, QPP/MIPS, TEAM Model, CMS-0057-F, Drug Price Negotiation, ACO REACH, LEAD, TEFCA, CMS-Aligned Network, IBH, RMADA 3, Hospital IQR/HVBP/HRRP/HAC |
| Payer | Blue | SCAN Health Plan, Alignment Health, Oscar Health, Covered California, Partnership HealthPlan, SFHP, Capital Rx, Included Health |
| Provider | Steel blue | Privia Health, Astrana Health, DaVita, Strive Health, Omada Health, Hinge Health, August Health, AdventHealth, HCA, Kaiser Permanente, CommonSpirit, Ascension, Providence, Trinity Health, Advocate Health, Mayo Clinic, Cleveland Clinic, Mass General Brigham, Intermountain Health, Northwell Health, Mount Sinai, AHA |
| Health IT | Green | Epic, Redox, Smile Digital Health, Notable, DoseSpot, Health Gorilla, CommonWell, eHealth Exchange, Surescripts, Oracle Health Information Network |
| Digital Health | Purple | Microsoft Azure, Oracle Health, Google Cloud, AWS |
| Pharma | Coral | AbbVie, Merck, Amgen, Roche/Genentech, GSK, Vertex, United Therapeutics, ConnectiveRx, Amazon Pharmacy, EVERSANA, Certara |
| Analytics / AI | Dark teal | Tempus AI, Guardant Health, GeneDx, RTI International, Google for Health, Coalition for Health AI (CHAI), Anthropic, Datavant, Aetion, Truveta, Komodo Health, IQVIA, Flatiron Health, TriNetX, HealthVerity, Particle Health, Acumen LLC, Mathematica, Yale New Haven Health/CORE |
| Government | Slate | NIH, CDC, CA Dept of Health Care Services, CA Dept of Public Health, FDA |
| AI Governance | Violet | FDA DHCoE, FDA DHAC, ONC/ASTP, The Joint Commission, Duke Health AI Evaluation & Governance Program, Duke-Margolis Institute, NIST, ModelOp |
| Special Topics (Emergent) | Gray | Opioid Response (Program Context), ED Innovation (Program Context) — `weak_link: true` nodes, 2+ degrees from the legislative/program core |

Edge types: **hier** (structural/mandated), **serves** (vendor/service), **partner** (voluntary), **funds** (funding), **tension** (structural/contentious dispute — carries `tension_note`), **cloud_ehr_partnership**, **regulates**, **certifies**, **sets_voluntary_standard_for**, **provides_internal_governance_for** (AI-governance-specific vocabulary)

Every edge may also carry `relationship_type: "direct" | "emerging"`, describing how formalized that specific connection is. Interoperability/RWD nodes carry two independent booleans, `qhin_designated` and `cms_aligned_network`, since an entity can be either, both, or neither. The AI Governance and Special Topics (Emergent) categories are toggleable via the legend exactly like any other category — there is no separate view to switch to.

### Top Shifts

Six active shifts displayed as cards below the graphs, each with a trend rating, catalyst narrative, and downstream implications:

| # | Title | Trend |
|---|-------|-------|
| 1 | OBBBA Medicaid Work Requirements + ACA Subsidy Cliff Compound | Critical |
| 2 | IRA Drug Price Negotiation — Cycle 3 Live | Critical |
| 3 | CMS-0057-F Prior Auth APIs — Jan 2027 Deadline | Critical |
| 4 | MA Risk Adjustment Tightening (HCC V28 + RADV) | Critical |
| 5 | TEAM Model — Mandatory Episode Accountability | Rising |
| 6 | AI Governance Fragmentation — Federal Floor Contracts as Voluntary Regimes Expand | Rising |

> The #1 shift links directly to the new **Special Topics: OBBBA** tab for the full state-by-state breakdown. The MIPS Sunset shift was retired to make room (its content overlaps the Reimbursement Roadmap tab's QPP/MIPS coverage).

**Interactions (both graphs):**
- Pan and zoom the graph canvas
- Hover a node for name, category, and description
- Click a node to highlight its 1-hop neighbors (non-neighbors dim to 15% opacity)
- Click the background to reset
- Click legend items to toggle category visibility
- Use the toggle tabs above the graph to switch between Legislative Map and Payer & Company Map

---

## Tab 2 — Reimbursement Roadmap

**3-level hierarchy swimlane** with a 2010–2028 horizontal time axis. The layout is:

**Service Type** (header row) → **CMMI Category** (sub-header row) → **Individual CMMI Model** (one timeline row each, sorted by start date)

This structure lets you see program eligibility overlap — when multiple models in the same service type and category are active simultaneously, the overlap is visible on the timeline.

**12 service types** (eligibility-based, not actual participation):

| Service Type | Fee Schedule | Value-Based Programs |
|-------------|-------------|---------------------|
| Inpatient Hospital | IPPS | VBP, HRRP, HAC |
| Outpatient Hospital | OPPS / ASC | ASC Quality Reporting |
| Physician / Professional Services | PFS | MIPS, Advanced APMs |
| Skilled Nursing Facility | SNF PPS (PDPM) | SNFVBP |
| Home Health | HH PPS (PDGM) | HHVBP |
| Hospice | Hospice Per Diem | Quality Reporting |
| Inpatient Rehabilitation Facility | IRF PPS | Quality Reporting |
| End-Stage Renal Disease | ESRD PPS | QIP |
| Oncology | PFS + Part B Drug Buy-and-Bill | MIPS Oncology Specialty |
| Behavioral Health | PFS | MIPS BH Specialty |
| Medicare Advantage / Health Plan | Risk-Adjusted Capitation (HCC V28) | MA Quality Bonus, RADV |
| Prescription Drug (Part D) | Part D Negotiated Rates / DIR | IRA Drug Price Negotiation, LIS |

**6 official CMMI categories** (from CMS.gov), each color-coded:

| CMMI Category | Color |
|--------------|-------|
| Accountable Care Models | Teal (#2a9d8f) |
| Disease-Specific & Episode-Based Models | Coral (#e76f51) |
| Health Plan Models | Blue (#1b6ca8) |
| Prescription Drug Models | Purple (#6a4c93) |
| State & Community-Based Models | Dark teal (#264653) |
| Statutory Demonstrations and Other Projects | Amber (#f4a261) |

**23 CMMI models** (16 original + 6 new + LEAD, ACO REACH's successor, added Sept 2026): TEAM, MA Value-Based Insurance Design Model, Enhanced Medication Therapy Management, State Innovation Models, Financial Alignment Initiative, PACE Innovation, and LEAD. Each model row shows the program's full active date range. Ended models display dashed borders. Scroll vertically to see all service types. Hover a bar for program details including CMMI category, start/end dates, and description.

---

## Tab 3 — Data Taxonomy

**26 datasets** across 6 categories, filterable by name, category, and payer:

| Category | Datasets |
|----------|---------|
| Claims | Medicare Carrier, MEDPAR, Outpatient, HH, Hospice, DME, MA Encounter, Part D, HCUP NIS, T-MSIS/TAF |
| Enrollment | MBSF, CCW Chronic Condition Flags |
| Provider | POS File, HCRIS Cost Reports, MIPS Performance, ACO Public Data, ARF, HRSA UDS, CA HCAI Hospital Financial Data |
| Survey | MCBS, MEPS, NHANES |
| Synthetic | CMS SynPUF |
| Drug/Formulary | Part D Prescriber PUF, Medicaid NADAC, Medicaid Drug Rebate Program / SDUD |

Each dataset shows: description, years covered, unit of observation, payer scope, and linkage variable IDs (e.g. `BENE_ID`, `NPI`, `CLM_ID`). Rows expand for full detail, including a **Use Case by Stakeholder** cross-tab (`use_case_by_stakeholder`) where present — who uses the dataset and for what intent, distinct from the dataset's category. Export to CSV available.

---

## Tab 5 — Special Topics: Access & Cost under OBBBA

A standalone static reference deep-dive on the One Big Beautiful Bill Act (H.R. 1 / P.L. 119-21, signed July 4, 2025), added September 2026. No backing JSON — edited directly in `index.html` under `<div id="tab-special">`, following the same pattern as the Data Taxonomy reference sections (Tab 3).

**Covers:**
- National context: work requirements, immigrant eligibility (§71109 Medicaid-side vs. §71301/§71302 marketplace-side), PTC repayment-cap repeal, provider tax/SDP caps, Rural Health Transformation Fund
- **Categories of impact:** 5 state response patterns (Early Adopters, Waiver-Only/Non-Expansion, Expansion+Waiver, Administratively Overwhelmed, Litigants), each graded by evidence quality (confirmed / modeled / insufficient)
- Individual mandate variation by state for 2026
- Disproportionately affected populations (coverage loss, subsidy clawback, ESRD/disability duals, immigrant eligibility)
- **A visual 2×2 coverage/cost quadrant** — catalysts plotted by dominant impact (coverage vs. cost) against origin (legislative/regulatory vs. market/structural), as colour-coded chips with hover/keyboard tooltips carrying the full detail. Colour keys whether a catalyst is a direct OBBBA provision, a separate compounding event, or a partial offset
- **State drill-down:** three deep-dive case studies — California (Expansion+Litigant), Montana (Early Adopter), Georgia (Waiver-Only) — plus an **any-state lookup** covering all 50 states + DC, returning each jurisdiction's category, expansion status, work-requirement timeline, litigation posture, and verified coverage-loss figure where one exists
- A Bay Area companion page ([`special-topics/bay-area-navigation.html`](special-topics/bay-area-navigation.html), also published as a private Claude Artifact) with a *potential* actionable-insights framework, top-10 resilient/at-risk organization tables, a county-by-county risk delineation, a condition-by-condition externality cost reference, and a notable people/entities table
- A topic-organized works-cited reading guide
- A static/dynamic refresh protocol (see [CLAUDE.md](CLAUDE.md) Step 10)

**Estimate policy.** Where a range exists, the tab leads with the **most conservative credible figure** — normally the issuing agency's own central estimate — and names any higher-end scenario separately rather than headlining it. California leads with DHCS's ~1.1M central estimate (not the 3.4M high-end scenario); Nebraska with the state Medicaid director's ~200 first-round figure (not the 20,000–40,000 advocacy projection); Montana with DPHHS's own ~13,000. Where no state- or organization-specific figure is traceable to a named source, the tab says so rather than extrapolating from a national average — in the any-state lookup, only **7 of 51 jurisdictions** carry a verified figure, and the remaining 44 state that explicitly and link out to the KFF and Georgetown CCF trackers.

**Framing.** The companion page's options are presented as *Potential* Actionable Insights: the stated intent is to explore what solution space exists and surface trade-offs, not to predict or prescribe what stakeholders will actually do. Several options depend on decisions that are unsettled as of writing (CalAIM waiver renewal, MCP contracting, litigation outcomes).

**Cross-links:** The Ontology tab's #1 Top Shift links here; the Payer & Company Map gained an `obbba_c` legislation node plus `cbo`, `kff`, `georgetown_ccf`, `ga_dch`, and `rhtf_prog` nodes documenting the national-context entities this tab draws on.

**Sourcing & fact-check trail:** every figure in this tab and its Bay Area companion page was run through an independent, primary-source verification pass (or explicitly flagged where it couldn't be confirmed) rather than published on first draft, across several audit rounds. Corrections are logged in [`changelog/`](changelog/); the working build log is kept locally in `project_specs/` (not tracked in this repo).

**Implementation note.** The tab's headers, quadrant, and state picker are styled by a `<style>` block scoped to `#tab-special` inside `index.html`, and the any-state lookup is a self-contained inline script — `css/styles.css` and everything in `js/` remain untouched, per the project's frozen-asset rule.

---

## Content Refresh Workflow

The full refresh protocol is defined in [`CLAUDE.md`](CLAUDE.md) at the repo root. Claude Code reads that file automatically and executes the workflow when given a prompt like:

> *"Update the contents of all the tabs with new information as of today."*

### What the workflow covers

| Step | Scope |
|------|-------|
| 0 | Establish update baseline — check today vs. last freshness date; identify sources to search |
| 1 | **Ontology — Legislative Map** (`ontology_nodes.json`, `ontology_edges.json`) |
| 2 | **Ontology — Payer & Company Map** (`company_nodes.json`, `company_edges.json`) |
| 3 | **Top Shifts cards** (`top_shifts.json`) — 6 shifts, ranked by urgency |
| 4 | **CMMI Models** (`cmmi_models.json`) — start/end dates, new model additions |
| 5 | **Service Types** (`service_types.json`) — fee schedules, VBP programs, model eligibility |
| 6 | **Data Taxonomy** (`datasets.json`) — year ranges, new CMS/AHRQ dataset releases |
| 7 | Sync all `window.__XXX__` inline blocks in `index.html` to match updated JSON files |
| 8 | Update README freshness table |
| 9 | Validate cross-references, commit, and push |
| 10 | **Special Topics: OBBBA** (Tab 5, static HTML + inline state dataset) — check CBO/KFF/Georgetown CCF tracking data, state case-study numbers, the any-state drill-down's per-state records, litigation status, and individual mandate penalty amounts; not covered by steps 1–9 |

### Design principle

**Layout and visualization code are frozen.** All updates are data-only — the eight `data/*.json` files and their matching inline variables in `index.html`. No changes to `js/`, `css/`, or HTML structure are made during a content refresh.

### Cross-reference validation

Before committing, verify that every model name in `service_types.json → innovationModels[]` has a matching entry in `cmmi_models.json`:

```bash
node -e "
  const svc = require('./data/service_types.json');
  const models = require('./data/cmmi_models.json');
  const names = new Set(models.map(m => m.name));
  svc.forEach(s => (s.innovationModels||[]).forEach(n => {
    if (!names.has(n)) console.log('BROKEN REF:', s.name, '->', n);
  }));
  console.log('Check complete.');
"
```

### Inline data sync map

Each JSON file has a corresponding `window.__XXX__` variable embedded in `index.html`. Both must be updated together:

| `data/` file | `window.__XXX__` variable |
|---|---|
| `ontology_nodes.json` | `window.__NODES__` |
| `ontology_edges.json` | `window.__EDGES__` |
| `company_nodes.json` | `window.__COMPANY_NODES__` |
| `company_edges.json` | `window.__COMPANY_EDGES__` |
| `top_shifts.json` | `window.__TOP_SHIFTS__` |
| `cmmi_models.json` | `window.__CMMI_MODELS__` |
| `service_types.json` | `window.__SERVICE_TYPES__` |
| `datasets.json` | `window.__DATASETS__` |

> The inline variables allow the app to run as a local `file://` without a server. Keeping them in sync with the JSON files is mandatory.

---

## Data Freshness

| Layer | Current as of |
|-------|--------------|
| Legislation | OBBBA / H.R. 1 (P.L. 119-21, signed July 4, 2025 — most recent major law) |
| CMMI Models | August 2026 |
| Fee Schedules | CY/FY 2026 Final Rules (PFS includes OBBBA's one-year 2.5% payment increase) |
| Datasets | September 2026 |
| Payer & Company Map | September 2026 (hospital systems, interoperability/RWD, cloud/EHR partnerships, AI governance stakeholders, OBBBA national-context entities) |
| Special Topics: OBBBA (Tab 5) | September 2026 |

**Sources:** CMS.gov, CMMI, Federal Register, ResDAC, AHRQ HCUP, NIH, CDC, Becker's Hospital Review, KFF, Sequoia Project, FDA, ONC/ASTP, CHAI, The Joint Commission, CBO, Georgetown University Center for Children and Families, GAO, California DHCS, California DOJ, California LAO, California Health Care Foundation (CHCF), Georgetown Litigation Tracker

---

## Tab Schema Definitions

### Ontology Node
```json
{ "id": "string", "name": "string", "category": "legislation|rule|program|model|agency",
  "ptype": "string", "enacted": "YYYY-MM-DD|null", "description": "string",
  "links": [{ "label": "string", "url": "string" }] }
```

### Ontology Edge
```json
{ "source": "node_id", "target": "node_id", "label": "string" }
```

### CMMI Model
```json
{ "id": "string", "name": "string",
  "category": "Accountable Care Models|Disease-Specific & Episode-Based Models|Health Plan Models|Prescription Drug Models|State & Community-Based Models|Statutory Demonstrations and Other Projects",
  "startDate": "YYYY-MM-DD", "endDate": "YYYY-MM-DD|null", "description": "string" }
```

### Service Type
```json
{ "name": "string", "description": "string", "feeSchedule": "string",
  "valueBasedModels": ["string"], "innovationModels": ["string"] }
```

### Dataset
```json
{ "name": "string", "description": "string", "category": "Claims|Enrollment|Provider|Survey|Synthetic|Drug/Formulary",
  "years": "string", "unit": "string", "payers": ["string"], "states": "All|[...]",
  "linkageIds": ["string"],
  "use_case_by_stakeholder": [{ "stakeholder_type": "string", "intent": "string" }]  // optional, additive
}
```

### Company / Payer Node (additional optional fields, added 2026-09)
```json
{ "qhin_designated": "boolean",       // interoperability nodes only — TEFCA QHIN status
  "cms_aligned_network": "boolean",   // interoperability nodes only — CMS-Aligned Network pledge/status
  "transitional": "boolean",          // e.g. Oracle Health's 2022 acquisition -> 2025 native rebuild
  "weak_link": "boolean"              // true if the node's only path to the legislative/program core is 2+ edges; rendered under category "emergent"
}
```

### Company / Payer Edge (additional optional fields, added 2026-09)
```json
{ "relationship_type": "direct | emerging",   // how formalized this specific connection is
  "tension_flag": "boolean",                   // true only for an active, unresolved dispute with 2+ named sides
  "tension_note": "string | null"              // required if tension_flag is true; names both sides
}
```
Category enum extended with `ai_gov` (AI governance stakeholders — FDA DHCoE/DHAC, ONC/ASTP, Joint Commission, Duke AI programs, NIST, ModelOp) and `emergent` (weak-link special-topics nodes). Edge `type` enum extended with `cloud_ehr_partnership`, `regulates`, `certifies`, `sets_voluntary_standard_for`, `provides_internal_governance_for` for the AI-governance and cloud/EHR verticals — these render in the same single Payer & Company Map graph and are toggled via the existing legend, not a separate view.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Visualization | D3.js v7 (CDN) |
| Frontend | Vanilla HTML/CSS/JS (no build step) |
| Data | JSON (embedded + standalone files) |
| CLI | Python 3 + argparse |
| Styling | CSS custom properties, Flexbox/Grid |

---

## Stakeholders

- Policymakers and federal regulators
- Healthcare providers and payers navigating value-based programs
- Health services and policy researchers
- Value-based care implementation teams


