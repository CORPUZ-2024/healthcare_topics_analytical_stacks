# CLAUDE.md — Healthcare Reference Materials

## Project overview
Single-page app at https://corpuz-2024.github.io/healthcare_topics_analytical_stacks/ with four tabs:
1. **Ontology** — Legislative Map + Payer & Company Map force-directed graphs + Top Shifts cards
2. **Reimbursement Roadmap** — 3-level swimlane (Service Type → CMMI Category → Model) + Program Eligibility Outline
3. **Data Taxonomy** — filterable/sortable dataset table
4. **Analytical Stacks** — 14 analysis task types with tech/analytical stacks, healthcare use cases, caveats, and cross-cutting reference tables

**Layout and visualization code are frozen.** All updates are data-only.

---

## Refresh workflow

Trigger phrase: *"update the contents of all the tabs with new information as of today"* (or any variant).

### Step 0 — Establish the update baseline

Check today's date. Cross-reference the README freshness table to identify what has changed since the last update.

Sources to consult (web search each):
- **CMS.gov / CMMI** — new or ended innovation models, mandatory model expansions, new rule publications (IPPS, OPPS, PFS, ESRD final rules)
- **Federal Register** — new legislation, significant proposed/final rules affecting payment
- **CMS Newsroom / MLN** — QPP updates, MA rate notices, Part D changes
- **CMS Innovation Center** — model announcements, ends, expansions
- **OIG / DOJ** — enforcement trends affecting Top Shifts
- **Health system & payer news** — company acquisitions, exits, new entrants relevant to Company Map

---

### Step 1 — Tab 1: Ontology Graph (Legislative Map)

**Files to update:**
- `data/ontology_nodes.json` ← then mirror into `window.__NODES__` in `index.html`
- `data/ontology_edges.json` ← then mirror into `window.__EDGES__` in `index.html`

**Node schema:**
```json
{
  "id": "string (unique, no spaces)",
  "name": "string (display label)",
  "category": "legislation | agency | program | model | rule",
  "ptype": "string (subcategory label)",
  "enacted": "YYYY-MM-DD | null",
  "description": "string (1–3 sentences)",
  "links": [{ "label": "string", "url": "string" }]
}
```

**Edge schema:**
```json
{ "source": "node_id", "target": "node_id", "label": "string" }
```

**What to check and update:**
| Change type | Action |
|-------------|--------|
| New major legislation enacted | Add node (category: legislation), add edges to affected agencies/programs |
| New CMS final rule published (IPPS, PFS, etc.) | Add rule node if significant, update `enacted` date |
| Existing node description outdated | Update `description` field |
| Program ended or renamed | Update `description`; do NOT delete nodes (preserve graph topology) |
| New link reference (Federal Register, CMS page) | Add to `links[]` array |

---

### Step 2 — Tab 1: Payer & Company Map

**Files to update:**
- `data/company_nodes.json` ← then mirror into `window.__COMPANY_NODES__` in `index.html`
- `data/company_edges.json` ← then mirror into `window.__COMPANY_EDGES__` in `index.html`

**Node schema:**
```json
{
  "id": "string (unique)",
  "name": "string",
  "category": "legislation | program | payer | provider | hit | pharma | analytics | govt | digital | ai_gov | emergent",
  "description": "string",
  "qhin_designated": "boolean (optional — interoperability nodes only, TEFCA QHIN status)",
  "cms_aligned_network": "boolean (optional — interoperability nodes only, CMS-Aligned Network pledge status; independent of qhin_designated — a node can be either, both, or neither)",
  "transitional": "boolean (optional — node is mid-transition, e.g. a recent acquisition/rebuild)",
  "weak_link": "boolean (optional — true if the node's only path to the legislative/program core is 2+ edges removed, i.e. via an intermediary company rather than directly to a program/legislation/govt node; such nodes use category \"emergent\")"
}
```
`ai_gov` is for AI-governance stakeholders (FDA DHCoE/DHAC, ONC/ASTP, Joint Commission, CHAI-adjacent assurance providers, etc.) — it renders in this same graph and is toggled via the legend like any other category, not a separate view. `emergent` is for `weak_link: true` special-topics nodes that should not be intermingled with the main graph.

**Edge schema:**
```json
{
  "source": "node_id",
  "target": "node_id",
  "type": "hier | serves | partner | funds | tension | cloud_ehr_partnership | regulates | certifies | sets_voluntary_standard_for | provides_internal_governance_for",
  "label": "string",
  "relationship_type": "direct | emerging (optional — how formalized this specific connection is: direct = contractual/ownership/formal program participation with a verifiable public record; emerging = pilot/exploratory/distributed/not yet formalized)",
  "tension_flag": "boolean (optional — true ONLY for an active, unresolved dispute with at least two named sides; general regulatory uncertainty does not qualify)",
  "tension_note": "string | null (required if tension_flag is true — one sentence naming both sides of the dispute)"
}
```

Edge type meanings:
- `hier` — structural/mandated relationship
- `serves` — vendor or service relationship
- `partner` — voluntary collaboration
- `funds` — funding flow
- `tension` — structural conflict or competitive tension (pair with `tension_flag`/`tension_note`)
- `cloud_ehr_partnership` — cloud vendor ↔ EHR/health-system relationship
- `regulates` / `certifies` / `sets_voluntary_standard_for` / `provides_internal_governance_for` — AI-governance-specific vocabulary (distinct from the legislation→program edge vocabulary used elsewhere in this graph)

**What to check and update:**
| Change type | Action |
|-------------|--------|
| Company acquired / merged | Update `name` and `description`; update affected edges |
| New market entrant relevant to CMS ecosystem | Add node + minimum 1 edge |
| Company exited market or went bankrupt | Update `description` to reflect status; do NOT delete (preserve topology) |
| New partnership announced | Add `partner` edge |
| New regulatory tension (e.g., DOJ investigation) | Add or update `tension` edge |
| Program node description outdated | Update `description` |

---

### Step 3 — Tab 1: Top Shifts

**File to update:**
- `data/top_shifts.json` ← then mirror into `window.__TOP_SHIFTS__` in `index.html`

**Schema:**
```json
{
  "id": "string",
  "rank": "integer (1–6, display order)",
  "trend": "critical | rising | watch",
  "title": "string (≤80 chars)",
  "activeNode": "string (matches a node name in company_nodes.json)",
  "catalyst": "string (2–4 sentences: what changed and why it matters now)",
  "implications": ["string", "..."]  // 4–6 bullets, each naming a specific company/program
}
```

**What to check and update:**
| Change type | Action |
|-------------|--------|
| Shift resolved or no longer active | Remove entry (re-rank remaining); replace with new shift if applicable |
| New critical development in existing shift | Update `catalyst` and `implications` |
| Trend severity changed | Update `trend` field |
| New policy shift emerged | Add new entry (max 6 total); demote lower-priority entry if needed |
| Company names/positions changed | Update any `implications` bullets that reference that company |

Always maintain exactly **6 shifts**, ranked 1–6 by urgency. Keep at least 2 entries at `critical`.

---

### Step 4 — Tab 2: CMMI Models

**File to update:**
- `data/cmmi_models.json` ← then mirror into `window.__CMMI_MODELS__` in `index.html`

**Schema:**
```json
{
  "id": "string (unique, no spaces)",
  "name": "string (official CMS name)",
  "category": "Accountable Care Models | Disease-Specific & Episode-Based Models | Health Plan Models | Prescription Drug Models | State & Community-Based Models | Statutory Demonstrations and Other Projects",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD | null",
  "description": "string (2–4 sentences)"
}
```

**What to check and update:**
| Change type | Action |
|-------------|--------|
| Model ended | Set `endDate` to the termination date |
| New CMMI model announced/launched | Add node; assign to one of the 6 official categories |
| Existing model extended | Update `endDate` to null or new date |
| Model expanded to new population/geography | Update `description` |
| Category reassigned by CMS | Update `category` field |

**CRITICAL:** The `name` field must exactly match the names used in `data/service_types.json` `innovationModels` arrays. If a model name changes, update both files.

---

### Step 5 — Tab 2: Service Types

**File to update:**
- `data/service_types.json` ← then mirror into `window.__SERVICE_TYPES__` in `index.html`

**Schema:**
```json
{
  "name": "string",
  "description": "string",
  "feeSchedule": "string",
  "valueBasedModels": ["string"],
  "innovationModels": ["string"]  // must match name field in cmmi_models.json exactly
}
```

**What to check and update:**
| Change type | Action |
|-------------|--------|
| Fee schedule methodology changed (e.g., new PPS) | Update `feeSchedule` and `description` |
| New VBP program added | Add to `valueBasedModels[]` |
| Existing VBP ended | Remove from `valueBasedModels[]` |
| New CMMI model eligible for this service type | Add to `innovationModels[]` |
| Model ended and no longer relevant | Optionally remove from `innovationModels[]` (keep if historical context is useful) |

---

### Step 6 — Tab 3: Data Taxonomy

The taxonomy tab has two distinct content areas, each with its own update rules.

---

#### 6a — Dataset Catalog (`data/datasets.json`)

**File to update:**
- `data/datasets.json` ← then mirror into `window.__DATASETS__` in `index.html`

**Schema:**
```json
{
  "name": "string",
  "description": "string",
  "category": "Claims | Enrollment | Provider | Survey | Synthetic | Drug/Formulary",
  "years": "string (e.g. '1991-present')",
  "unit": "string",
  "payers": ["string"],
  "states": "All | [list]",
  "linkageIds": ["string"],
  "use_case_by_stakeholder": [{ "stakeholder_type": "string", "intent": "string" }]
}
```
`use_case_by_stakeholder` is optional and additive — it answers "who uses this dataset and why" (cross-tabulated a second way against the dataset's category), and does not replace or require any other use-case field.

**What to check and update:**
| Change type | Action |
|-------------|--------|
| Dataset now covers additional years | Update `years` field |
| Dataset retired or access policy changed | Update `description` to note the change |
| New public dataset released by CMS/AHRQ/CDC | Add entry with correct category and schema |
| Linkage variable renamed in new release | Update `linkageIds[]` |
| Dataset moved to a new access pathway (ResDAC, etc.) | Update `description` |

---

#### 6b — Reference: Coding System Distinctions (static HTML in `index.html`)

This section lives in `<div id="taxonomy-reference">` directly in `index.html` — it has no backing JSON file. Edit the HTML in place.

**Location in index.html:** Search for `id="taxonomy-reference"` → Section A (`ref-section` for "Coding System Distinctions").

**Covers:** DRG, HCPCS, HCC, ICD, APC — comparison table (8 rows: primary use, care setting, payment model, basis of grouping, scope, additivity, typical inputs, governing body) plus per-system deep-dive cards and claim form / TOB reference.

**What to check and update:**
| Change type | Action |
|-------------|--------|
| CMS releases a new HCC model version (e.g., V29+) | Update HCC column rows for care setting, payment model, and governing body; update deep-dive card bullets referencing RAF/benchmark methodology |
| CMS restructures MS-DRG grouper (new MDC, CC/MCC tier changes) | Update DRG column "basis of grouping" and "typical inputs" rows; update DRG deep-dive card |
| CMS introduces a new OPPS C-APC logic change or APC restructure | Update APC column rows; update APC deep-dive card |
| AMA releases a new CPT structure that affects HCPCS Level I | Update HCPCS column and deep-dive card |
| New TOB code series introduced (NUBC) | Add row to claim form / TOB reference block |
| ICD-11 transition announced with a U.S. implementation date | Update ICD column and deep-dive card; note transition timeline |
| Claim form replaced or renamed (UB-04 → successor, CMS-1500 revision) | Update claim form glossary block |

---

#### 6c — Reference: Important Variables & Cross-Program Linkage (static HTML in `index.html`)

**Location in index.html:** Search for `id="taxonomy-reference"` → Section B (`ref-section` for "Important Variables & Cross-Program Linkage").

**Covers:** Cross-program variable map table (FFS A/B, MA Encounters C, Professional B, Part D D, Medicaid TAF), analytic domain cards (Cost/Utilization/Disease Burden), mini-glossary, and quick starter variable list.

**What to check and update:**
| Change type | Action |
|-------------|--------|
| CCW/ResDAC renames a variable (e.g., `BENE_ID` → successor) | Update all occurrences in variable map table, mini-glossary, and quick starter grid |
| CMS releases a new Medicare Part or program that introduces new claim types | Add column to cross-program variable map; add relevant entries to mini-glossary and starter grid |
| TAF structure changes (T-MSIS schema update) | Update TAF column in variable map; update TAF mini-glossary entry |
| Part D PDE variable names change in new release | Update Part D column in variable map and relevant starter grid entries |
| New TOB series added affecting site/setting identification | Update site/setting row in variable map and TOB entries in mini-glossary |
| HCC model version change affects RAF inputs or demographic interaction rules | Update HCC/RAF mini-glossary entry and disease burden analytic card |
| ResDAC access pathway changes for a variable type | Update relevant mini-glossary entry `description` |
| New linkage variable becomes standard across CMS files | Add to mini-glossary and quick starter grid under appropriate domain |

**Do NOT update** this section for minor annual routine changes (e.g., new ICD-10-CM codes, yearly HCPCS code additions). Update only when the structure, name, or cross-program availability of a key variable class changes.

---

### Step 7 — Sync inline data in index.html

After updating any JSON file, find the matching `window.__XXX__` block in `index.html` and replace its contents with the updated JSON array.

| JSON file | Variable in index.html |
|-----------|------------------------|
| `data/ontology_nodes.json` | `window.__NODES__` |
| `data/ontology_edges.json` | `window.__EDGES__` |
| `data/company_nodes.json` | `window.__COMPANY_NODES__` |
| `data/company_edges.json` | `window.__COMPANY_EDGES__` |
| `data/top_shifts.json` | `window.__TOP_SHIFTS__` |
| `data/cmmi_models.json` | `window.__CMMI_MODELS__` |
| `data/service_types.json` | `window.__SERVICE_TYPES__` |
| `data/datasets.json` | `window.__DATASETS__` |

---

### Step 8 — Update README freshness table

Update the table at the bottom of `README.md`:

```markdown
| Layer | Current as of |
|-------|--------------|
| Legislation | [most recent major law] |
| CMMI Models | [month year of most recent model change] |
| Fee Schedules | [CY/FY year of most recent final rule] |
| Datasets | [month year] |
```

---

### Step 9 — Validate and commit

Run a quick cross-reference check:
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

Then commit:
```bash
git add data/ index.html README.md special-topics/
git commit -m "Refresh content as of [YYYY-MM-DD]: [brief summary of changes]"
git push origin master
```

---

### Step 10 — Tab 5: Special Topics (OBBBA Access & Cost)

Added September 2026. This tab has **no backing JSON file** — it lives entirely as static HTML in `<div id="tab-special">` in `index.html`, following the same edit-in-place pattern as the Taxonomy reference sections (Steps 6b/6c). It is **not** touched by the standard "update all tabs" pass (Steps 0–9) — it has its own trigger conditions, checked as an explicit extra step whenever a refresh explicitly asks for it, or on the cadence noted in the tab's own "Static/Dynamic Refresh Protocol" section.

**Location in index.html:** Search for `id="tab-special"`.

**What to check and update, each refresh cycle:**
| Change type | Action |
|-------------|--------|
| CBO publishes a new OBBBA coverage-loss score | Update the figure in National Context and Affected Populations sections; update the citation |
| KFF or Georgetown CCF tracker data changes materially | Update the relevant Categories of Impact table row and its evidence grade, **and the matching record in the any-state dataset** (see below) |
| A state case-study number is superseded (NE, MT, GA, TX figures) | Update the Categories of Impact table, the corresponding Case Study card, **and that state's record in the any-state dataset** |
| A state gains its first verifiable coverage-loss figure | Fill in that state's `est` and `grade` in the any-state dataset — it currently renders "no verified state-specific estimate" for 44 of 51 jurisdictions, which is the intended conservative default, not a gap to paper over |
| Litigation status changes (ruling, injunction, dismissal) | Update the Litigants category row, the any-state dataset's litigation copy, and the National Context tension edge (`data/company_edges.json`, `obbba_c` → `ca_dhcs`) |
| A state changes its individual mandate penalty (annual, CY change) | Update the Individual Mandate Variation table |
| Evidence grade should change (e.g. an "insufficient" figure becomes verifiable) | Update the grade badge and remove the corresponding Limitations bullet if resolved |
| A new state moves to enforcement ahead of the federal deadline | Add to the relevant Categories of Impact row, update its any-state record's timeline, or create a new Case Study card if it becomes one of the deep-dive states |
| A new catalyst belongs on the coverage/cost quadrant | Add a `.sp-chip` to the correct quadrant cell with a `data-tip` carrying the full detail, and colour it by the existing three-way legend (direct OBBBA provision / separate catalyst / partial offset) |

**Terminology:** this tab says **category**, not "archetype" — the section is "Categories of Impact." Keep that consistent when editing.

**Estimate policy (applies to every figure added here):** lead with the most conservative credible number — normally the issuing agency's own central estimate — and name any higher-end scenario separately rather than headlining it. Never derive a state- or org-specific figure from a national average; if no attributable figure exists, say so. Every headline figure carries a source link.

**Inline any-state dataset:** the drill-down in the Case Studies section is driven by a `var S = [...]` array inside a `<script>` block at the end of `<div id="tab-special">`. Each row is `[code, name, category, isExpansion, isLitigant, verifiedEstimate|null, grade, note]`. When editing it, keep these invariants true — they are cross-checked against figures published elsewhere on the tab:
- 51 jurisdictions, no duplicate codes
- 41 expansion jurisdictions (40 states + DC)
- 26 litigant jurisdictions (25 states + DC)

**Scoped styling:** the tab's headers, quadrant, and picker are styled by a `<style>` block scoped under `#tab-special`, inside `index.html`. Edit that block rather than `css/styles.css`, which stays frozen.

**Also touches the standard data files** (these ARE covered by Steps 1–3 above, since OBBBA is now permanent content in the main graphs):
- `data/ontology_nodes.json` / `ontology_edges.json` — `OBBBA2025` node and its 3 edges
- `data/company_nodes.json` / `company_edges.json` — `obbba_c`, `cbo`, `kff`, `georgetown_ccf`, `ga_dch`, `rhtf_prog` nodes and their edges
- `data/top_shifts.json` — the `ts_obbba` shift (rank 1); keep its catalyst/implications current the same way any other shift is maintained

**Companion file:** `special-topics/bay-area-navigation.html` is a standalone page (not part of the SPA's tab system) linked from the Bay Area sub-section. It has its own Methodology & Limitations section — update its organization rankings only if new structural information (not full financial audits) becomes available.

**Do NOT** touch this tab as part of a routine Steps 0–9 pass unless one of the triggers above applies — it is intentionally decoupled so routine refreshes stay fast.

---

## Files that must NOT change during a content refresh

| File | Why |
|------|-----|
| `js/ontology.js` | Visualization logic — frozen |
| `js/reimbursement.js` | Visualization logic — frozen |
| `js/taxonomy.js` | Visualization logic — frozen |
| `js/app.js` | Tab controller — frozen. Exception: the 5-tab keyboard-shortcut map (`tabMap`) was extended once, Sept 2026, to add the Special Topics tab; do not modify further during routine content refreshes |
| `css/styles.css` | Styles — frozen |
| `index.html` (structure) | Tab containers, nav, and the `js/` script tags are frozen. Editable zones: (1) `window.__XXX__` inline data blocks; (2) `<div id="taxonomy-reference">` static reference HTML (Steps 6b/6c); (3) `<div id="tab-special">` — its static reference HTML, its scoped `<style>` block, and its inline any-state drill-down `<script>` (Step 10) |
| `.nojekyll` | Required for GitHub Pages static serving |
| `.github/` | CI/CD — do not touch |

---

## Branch and deploy

- Active branch: `master`
- GitHub Pages source: Deploy from branch → master → root
- Deploy is automatic on push; allow ~60 seconds then verify at https://corpuz-2024.github.io/healthcare_topics_analytical_stacks/
