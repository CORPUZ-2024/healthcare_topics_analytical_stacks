# Healthcare Topics Toolkits — Policy Synthesis

[![Live Site](https://img.shields.io/badge/Live%20Site-GitHub%20Pages-0d1b2a?style=for-the-badge&logo=github)](https://corpuz-2024.github.io/healthcare_topics_toolkits/)

**https://corpuz-2024.github.io/healthcare_topics_toolkits/**

A maintainable knowledge base and interactive visualization suite covering U.S. healthcare legislation, payment models, CMMI innovation programs, and research datasets. Built to support policy analysis, regulatory assessment, and evidence-based decision making.

---

## Live Tool

**Open in browser:** [https://corpuz-2024.github.io/healthcare_topics_toolkits/](https://corpuz-2024.github.io/healthcare_topics_toolkits/)

Or open `index.html` directly from the repo — no server required. All data is embedded inline.

> Requires an internet connection to load D3.js v7 from CDN.

---

## What's Inside

### Three Interactive Tabs

| Tab | Visualization | What it shows |
|-----|--------------|---------------|
| **Ontology Graph** | D3.js force-directed graph | Two force-directed graphs: Legislative Map (legislation → agencies → programs → rules) and Payer & Company Map (plans, providers, pharma, health IT connected to CMS mandates) |
| **Reimbursement Roadmap** | 3-level hierarchy swimlane (2010–2028) | Eligibility-based mapping of CMMI innovation models to 12 service types, organized by 6 official CMMI categories |
| **Data Taxonomy** | Filterable, sortable table | CMS and public research datasets with linkage variables and metadata |

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
│   └── app.js                  # Tab controller and initialization
├── data/
│   ├── ontology_nodes.json     # 38 nodes: legislation, agency, program, model, rule
│   ├── ontology_edges.json     # 51 directed relationships
│   ├── company_nodes.json      # 58 nodes: payer, provider, pharma, hit, analytics, govt
│   ├── company_edges.json      # 67 directed relationships (hier, serves, partner, funds, tension)
│   ├── top_shifts.json         # 6 active policy shifts with catalysts and implications
│   ├── cmmi_models.json        # 22 CMMI models with start/end dates (6 official categories)
│   ├── service_types.json      # 12 service types with fee schedules
│   └── datasets.json           # 20 CMS and public research datasets
├── cli/
│   └── update.py               # Phased update CLI (see below)
└── project_specs/              # Original specification documents
```

---

## Tab 1 — Ontology Graph

The Ontology tab contains two switchable force-directed graphs and a Top Shifts section below.

### Legislative Map

**38 nodes across 5 categories:**

| Category | Color | Examples |
|----------|-------|---------|
| Legislation | Red | ACA, MACRA, HITECH, IRA 2022 |
| Agency | Purple | CMS, CMMI, ONC, AHRQ |
| Program | Teal | Medicare Parts A–D, Medicaid, CHIP, QPP, MSSP |
| Model | Steel blue | ACO REACH, BPCI Advanced, EOM, MCP, GUIDE, AHEAD |
| Rule | Orange | IPPS, OPPS, PFS, ESRD Final Rules |

### Payer & Company Map

**58 nodes across 9 categories:**

| Category | Color | Examples |
|----------|-------|---------|
| Legislation | Red | ACA §3021/3022, MACRA, IRA 2022, HITECH, 21st Century Cures |
| Program | Teal | Medicare Advantage, Medicaid/CHIP, QPP/MIPS, TEAM Model, CMS-0057-F, Drug Price Negotiation |
| Payer | Blue | SCAN Health Plan, Alignment Health, Oscar Health, Covered California, Partnership HealthPlan, SFHP, Capital Rx, Included Health |
| Provider | Steel blue | Privia Health, Astrana Health, DaVita, Strive Health, Omada Health, Hinge Health, August Health, AdventHealth |
| Health IT | Green | Epic, Redox, Smile Digital Health, Notable, DoseSpot |
| Pharma | Coral | AbbVie, Merck, Amgen, Roche/Genentech, GSK, Vertex, United Therapeutics, ConnectiveRx, Amazon Pharmacy, EVERSANA, Certara |
| Analytics / AI | Dark teal | Tempus AI, Guardant Health, GeneDx, RTI International, Google for Health, Coalition for Health AI (CHAI), Anthropic |
| Government | Slate | NIH, CDC, CA Dept of Health Care Services, CA Dept of Public Health |

Edge types: **hier** (structural/mandated), **serves** (vendor/service), **partner** (voluntary), **funds** (funding), **tension** (structural tension)

### Top Shifts

Six active shifts displayed as cards below the graphs, each with a trend rating, catalyst narrative, and downstream implications:

| # | Title | Trend |
|---|-------|-------|
| 1 | IRA Drug Price Negotiation — Cycle 3 Live | Critical |
| 2 | CMS-0057-F Prior Auth APIs — Jan 2027 Deadline | Critical |
| 3 | MA Risk Adjustment Tightening (HCC V28 + RADV) | Critical |
| 4 | TEAM Model — Mandatory Episode Accountability | Rising |
| 5 | MIPS Sunset Proposal — Advanced APM Pressure (2029) | Rising |
| 6 | ACO REACH Equity Adjustments + MA Overlap | Watch |

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

**22 CMMI models** (16 original + 6 new): TEAM, MA Value-Based Insurance Design Model, Enhanced Medication Therapy Management, State Innovation Models, Financial Alignment Initiative, and PACE Innovation. Each model row shows the program's full active date range. Ended models display dashed borders. Scroll vertically to see all service types. Hover a bar for program details including CMMI category, start/end dates, and description.

---

## Tab 3 — Data Taxonomy

**20 datasets** across 5 categories, filterable by name, category, and payer:

| Category | Datasets |
|----------|---------|
| Claims | Medicare Carrier, MEDPAR, Outpatient, HH, Hospice, DME, MA Encounter, Part D, HCUP NIS |
| Enrollment | MBSF, CCW Chronic Condition Flags |
| Provider | POS File, HCRIS Cost Reports, MIPS Performance, ACO Public Data, ARF |
| Survey | MCBS, MEPS, NHANES |
| Synthetic | CMS SynPUF |

Each dataset shows: description, years covered, unit of observation, payer scope, and linkage variable IDs (e.g. `BENE_ID`, `NPI`, `CLM_ID`). Rows expand for full detail. Export to CSV available.

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
| Legislation | IRA 2022 (most recent major law) |
| CMMI Models | August 2026 |
| Fee Schedules | CY/FY 2025 Final Rules |
| Datasets | August 2026 |

**Sources:** CMS.gov, CMMI, Federal Register, ResDAC, AHRQ HCUP, NIH, CDC

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
{ "name": "string", "description": "string", "category": "Claims|Enrollment|Provider|Survey|Synthetic",
  "years": "string", "unit": "string", "payers": ["string"], "states": "All|[...]",
  "linkageIds": ["string"] }
```

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

---

## Inspiration 

- Previous projects I worked on
- Positions I was not hired for
- Certain people for certain things 
