# CLAUDE.md — Healthcare Reference Materials

## Project overview
Single-page app at https://corpuz-2024.github.io/healthcare_topics_toolkits/ with three tabs:
1. **Ontology** — Legislative Map + Payer & Company Map force-directed graphs + Top Shifts cards
2. **Reimbursement Roadmap** — 3-level swimlane (Service Type → CMMI Category → Model) + Program Eligibility Outline
3. **Data Taxonomy** — filterable/sortable dataset table

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
  "category": "legislation | program | payer | provider | hit | pharma | analytics | govt | digital",
  "description": "string"
}
```

**Edge schema:**
```json
{
  "source": "node_id",
  "target": "node_id",
  "type": "hier | serves | partner | funds | tension",
  "label": "string"
}
```

Edge type meanings:
- `hier` — structural/mandated relationship
- `serves` — vendor or service relationship
- `partner` — voluntary collaboration
- `funds` — funding flow
- `tension` — structural conflict or competitive tension

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

**File to update:**
- `data/datasets.json` ← then mirror into `window.__DATASETS__` in `index.html`

**Schema:**
```json
{
  "name": "string",
  "description": "string",
  "category": "Claims | Enrollment | Provider | Survey | Synthetic",
  "years": "string (e.g. '1991-present')",
  "unit": "string",
  "payers": ["string"],
  "states": "All | [list]",
  "linkageIds": ["string"]
}
```

**What to check and update:**
| Change type | Action |
|-------------|--------|
| Dataset now covers additional years | Update `years` field |
| Dataset retired or access policy changed | Update `description` to note change |
| New public dataset released by CMS/AHRQ/CDC | Add entry with correct category and schema |
| Linkage variable renamed in new release | Update `linkageIds[]` |
| Dataset moved to a new access pathway (ResDAC, etc.) | Update `description` |

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
git add data/ index.html README.md
git commit -m "Refresh content as of [YYYY-MM-DD]: [brief summary of changes]"
git push origin master
```

---

## Files that must NOT change during a content refresh

| File | Why |
|------|-----|
| `js/ontology.js` | Visualization logic — frozen |
| `js/reimbursement.js` | Visualization logic — frozen |
| `js/taxonomy.js` | Visualization logic — frozen |
| `js/app.js` | Tab controller — frozen |
| `css/styles.css` | Styles — frozen |
| `index.html` (structure) | HTML structure is frozen; only `window.__XXX__` blocks change |
| `.nojekyll` | Required for GitHub Pages static serving |
| `.github/` | CI/CD — do not touch |

---

## Branch and deploy

- Active branch: `master`
- GitHub Pages source: Deploy from branch → master → root
- Deploy is automatic on push; allow ~60 seconds then verify at https://corpuz-2024.github.io/healthcare_topics_toolkits/
