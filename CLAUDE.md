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

---

## Step 00 — Verification standard (read before any content step)

Every factual claim published anywhere in this repo must clear this bar. A September 2026 second-round audit of content that had already passed a first-round check found errors in **all four tabs**, so these rules exist because they were each violated at least once.

### The bar

1. **Traceable or absent.** A claim is publishable only if a named source can be opened and checked. If it cannot be traced, it does not go on the page — not even hedged. Put it in an excluded register with the reason.
2. **Cite the issuer, not the repeater.** Link the agency, court, or journal that produced the figure, not the news story summarising it.
3. **Lead with the conservative figure.** Where a range exists, publish the issuing agency's central estimate and name any high-end scenario separately.
4. **Never manufacture precision.** If sources give ~240,000-250,000, publish the range. Converting a range to a single precise number is a fabrication even when the number falls inside the range. *(This happened: an unsourced "246,365" was propagated to 8 locations before being caught.)*
5. **No superlatives without evidence.** "First", "most", "largest", "only" are empirical claims. Verify or drop the superlative.
6. **A correction is not done until it is swept.** See the sweep rule below.

### The sweep rule

Facts in this repo are duplicated across `data/*.json`, the inline `window.__XXX__` mirrors, static HTML in `index.html`, and `special-topics/`. **Fixing one instance and stopping is the single most common failure mode in this project's history.** After correcting any fact:

```bash
grep -rn "<the old string>" index.html data/ special-topics/ README.md
```

Only when that returns nothing is the correction complete. Then re-sync mirrors (Step 7) and confirm with the mirror check.

### Error patterns to check for

Observed repeatedly in this repo's own history. Treat as a pre-flight checklist:

| Pattern | What it looks like | Real example caught |
|---|---|---|
| **False precision** | A range collapsed to one exact-looking number | "246,365 eligible" from a ~240-250k range |
| **Statistic misattribution** | A real number attached to the wrong claim | KFF's 77% *satisfaction* figure cited as an *eligibility* finding |
| **Unswept correction** | Fixed in one file, stale in three others | FDA PCCP date fixed in Top Shifts, left wrong in two graph files |
| **Direction inversion** | A constraint reported as its opposite | "PE closes in 30-60 days" — actually the regulatory notice period *before* closing |
| **Superlative inflation** | Unearned "first/most/only" | "First mandatory CMMI model since CJR" — ETC was mandatory in between |
| **Stale-as-current** | `endDate: null` on an ended program; present-tense on a closed model | 5 CMMI models rendering as active after ending |
| **Scope overreach** | Subgroup finding applied to a general population | "$1 removed → $3-5 downstream" holds for high utilizers, not the average enrollee |
| **Relationship invention** | An edge asserting a lineage that does not exist | `ACO_REACH → MSSP "successor to"` — REACH replaced GPDC |
| **Cited but unchecked** | Real source attached to a claim it does not support | "AB 2468" for CHW billing — the authority is AB 133 |
| **Adjacent-date conflation** | Two nearby dates merged into one | CHAI/Joint Commission June 2025 partnership vs Sept 2025 guidance release |

### Conflation register — pairs this project has actually mixed up

Check against this list whenever touching the relevant subject. Each pair is two *different true things* that read as one:

| Do not confuse | With |
|---|---|
| TEAM's **30-day** post-discharge window | BPCI Advanced / CJR's **90-day** window |
| **Original HHVBP** (9-state model, ended 2021) | **Expanded HHVBP** (nationwide, permanent, 2023–) |
| ACO REACH's predecessor: **GPDC** | MSSP, which runs in parallel and still exists |
| **§71109** — Medicaid eligibility (Oct 1, 2026) | **§71301/§71302** — marketplace PTC eligibility |
| CMS-0057-F **decision timeframes** (Jan 1, 2026) | CMS-0057-F **FHIR API deadline** (Jan 1, 2027) |
| Provider-tax **freeze** (Oct 1, 2026) | **Phase-down** (FFY2028) and **SDP caps** (Jan 1, 2028) — three different dates |
| DHCS **1.1M** central estimate | DHCS **3.4M** high-end scenario, and LAO's **~2M** net-uninsured projection — three different measures |
| **FQHC** 340B path (Health Center Program status) | **DSH hospital** 340B path (11.75% DSH adjustment percentage — a formula output, not "Medicaid inpatient days") |
| Retroactive coverage **1 month** (expansion) | **2 months** (traditional — seniors, children, people with disabilities) |
| DHCS housing supports: **ED −13.2%, inpatient −24.3%** | LA County psychiatric recuperative care: **71%/24%** — a different service entirely |
| **Wilson** score interval | **Clopper-Pearson** exact interval — they give materially different bounds |
| Texas's application backlog (**SNAP/redetermination**-driven; non-expansion state) | Work-requirement enforcement, which Texas has no population for |
| Partnership HealthPlan serves **Solano** (a nine-county Bay Area county) | It does **not** serve SF, Alameda, Santa Clara, Contra Costa or San Mateo |
| CHAI/Joint Commission **partnership** (June 2025) | First **joint guidance** release (Sept 17, 2025) |
| HCC **V28** (100% weight from 2026) | **V24**, fully retired |

---

## Step 01 — Model escalation check (run at start, and re-run whenever scope grows)

**Notify the user — out loud, in the response, at the moment the trigger fires — when the task has outgrown the current model.** Do not wait to be asked, and do not silently continue. The user decides; the job here is to surface the recommendation promptly.

### Escalation triggers

Recommend switching to a stronger reasoning model when **any** of these becomes true:

- More than **10 external factual claims** need verification in one pass
- Sources **contradict each other** and the conflict must be adjudicated
- The task **audits a previous pass's output** (meta-verification — historically the highest error-yield work in this repo)
- **Statistical or methodological content** is being authored or corrected (Tab 4, risk adjustment, confidence intervals, causal claims)
- **Legal or regulatory citation** with section numbers, effective dates, or litigation status
- Edits span **more than three files** with cross-file consistency requirements
- The running **error rate in the current pass exceeds ~20%** of claims checked — that is evidence the material is unreliable and needs more careful handling, not faster handling

### How to notify

State it plainly and briefly, then continue working unless told otherwise:

> "This pass now involves [trigger]. That is the kind of work where a stronger reasoning model materially reduces error rate — recommend `/model` → Opus 5 before I go further. Continuing for now; say the word and I'll pause."

### Why this is in the protocol

A September 2026 audit compared verification passes by model. The content verified under the weaker model carried errors into production across all four tabs, including the ten patterns tabulated above. The escalation check is cheap; re-auditing a published page is not.

**Also record which model verified what.** When a changelog entry documents verification, name the model. Provenance is otherwise unrecoverable, and the question "what here was never checked properly?" becomes unanswerable.

---

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

**Relationship validity (added after the September 2026 audit).** An edge label is a factual claim and must be verifiable. Before adding or keeping one, confirm:

1. **The relationship genuinely exists.** Check the node descriptions for contradiction — `ACO_REACH → MSSP "successor to"` survived a full review round while its own node description correctly stated that REACH replaced the Global and Professional Direct Contracting model. The graph contradicted itself and nothing caught it.
2. **The reverse edge does not already exist.** Reciprocal pairs (`ACA → MSSP "authorized"` alongside `MSSP → ACA "authorized by"`) assert the same fact twice and double-count in any path analysis.
3. **Direction follows the convention:** legislation and agencies are sources; programs, models and rules are targets.
4. **Tense matches status.** A model with an `endDate` takes "administered", not "administers".

**Never add a vague edge purely to keep a node connected.** Two edges (`HRSA → PACE`, `AHRQ → QPP`) existed only to avoid orphaning their source nodes and asserted relationships that do not meaningfully exist. Find the real relationship or leave the node unconnected and flag it.

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

**Edge-type discipline (added after the September 2026 audit).** Each type carries a specific meaning, and three were found misapplied:

- `cloud_ehr_partnership` was used on edges pointing at **a regulation** (`cms0057_prog`) rather than an EHR or health system — the type's documented definition is "cloud vendor ↔ EHR/health-system relationship".
- `sets_voluntary_standard_for` was used for a **peer partnership** (CHAI ↔ Joint Commission, who jointly issued guidance) and separately for **plain membership** (CHAI → Mayo Clinic).

Before assigning a type, confirm the target is the kind of entity the type describes.

For `tension`, this file's own bar applies and was found violated twice: an **active, unresolved dispute with two named sides**, whose **endpoints are the actual parties**. A general statement that "vendors and CMS have not converged" is regulatory uncertainty, not a dispute. An edge from a statute to a state agency that is itself a co-plaintiff does not describe the litigation between that coalition and CMS.

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

#### 6d — Reference: Commonly Conflated Distinctions (static HTML in `index.html`)

**Location in index.html:** Search for `id="taxonomy-reference"` → Section C (`ref-section` for "Commonly Conflated Distinctions"), grouped into three `ref-block` tables: Payment Models & Episodes, Policy/Coverage/Statute, Data & Method.

This is the **reader-facing** counterpart to the conflation register in Step 00. The two must stay aligned, but they are not the same document:

| | Step 00 register | Section C |
|---|---|---|
| Audience | Whoever is editing this repo | Whoever is reading the site |
| Framing | "Do not merge these when writing" | "These are two different things; here is the error the merge produces" |
| Entry bar | Any pair this project has confused | A pair whose distinction changes how a reader would use the number |

**Rules for this section:**

1. **Every entry must be a real correction from this repo's history.** Not a hypothetical, not a textbook distinction. Its authority comes from the fact that these errors were actually made here. If a pair is added, the changelog entry that corrected it must exist.
2. **Each row states both true things, not one true and one false.** A conflation is two correct facts merged — that is what makes it hard to catch. A row that reads "X is wrong, Y is right" is a correction, not a conflation, and belongs in the changelog instead.
3. **The third column names the consequence.** "Different windows" is not useful; "attributing the wrong window to the one model still operating" is.
4. **Use only existing `ref-*` classes.** `css/styles.css` is frozen — Section C uses `ref-section`, `ref-section-title`, `ref-section-desc`, `ref-block`, `ref-block-title`, `ref-table-wrap`, `ref-table`, `ref-feature-col` and adds no new ones.

**When to add a row:** after any correction pass that finds two facts were merged. **When to remove one:** when the underlying distinction ceases to exist (e.g. a superseded coding system retires), not merely because the error feels unlikely to recur.

**Keep the README count current** — the Tab 3 table in `README.md` states the number of pairs.

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

Referential integrity is necessary but **not sufficient** — every error found in the September 2026 audit passed the check below. Run all four gates.

**Gate 1 — cross-references resolve:**
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

**Gate 2 — graph integrity.** Every node has ≥1 edge; no reciprocal duplicate pairs (the same relationship asserted in both directions); no edge type used outside its documented meaning; every `tension` edge carries a `tension_note` naming two sides of a live dispute.
```bash
node -e "
  const e = require('./data/company_edges.json'), n = require('./data/company_nodes.json');
  const ids = new Set(n.map(x => x.id));
  const touched = new Set(); e.forEach(x => { touched.add(x.source); touched.add(x.target); });
  e.forEach(x => { if (!ids.has(x.source) || !ids.has(x.target)) console.log('BROKEN EDGE', x.source, '->', x.target); });
  n.filter(x => !touched.has(x.id)).forEach(x => console.log('ORPHAN', x.id));
  const seen = new Set();
  e.forEach(x => { if (seen.has(x.target + '>' + x.source)) console.log('RECIPROCAL DUP', x.source, '<->', x.target); seen.add(x.source + '>' + x.target); });
  e.filter(x => x.type === 'tension' && !x.tension_note).forEach(x => console.log('TENSION W/O NOTE', x.source));
  console.log('Graph check complete.');
"
```

**Gate 3 — stale-status sweep.** Anything with an end date that has passed must not be described in the present tense, and no ended program may carry `endDate: null`:
```bash
node -e "
  const m = require('./data/cmmi_models.json'); const today = new Date().toISOString().slice(0,10);
  m.filter(x => !x.endDate).forEach(x => console.log('ASSERTED ONGOING — verify:', x.id, x.name));
  m.filter(x => x.endDate && x.endDate < today).forEach(x => console.log('ended', x.endDate, x.id));
"
```
Then confirm the ontology edges for any ended model use past tense ("administered", not "administers").

**Gate 4 — mirrors match.** Every `window.__XXX__` block must be data-identical to its `data/*.json` source. Parse both and compare `JSON.stringify` output; formatting may differ, content may not.

**Then apply the Step 00 sweep rule** to every fact changed in this pass before committing.

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
