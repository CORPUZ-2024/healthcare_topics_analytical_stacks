# Changelog: Second-Round Audit — Corrections, Error Taxonomy, Protocol Hardening

**Date:** 2026-09-25
**Scope:** all four non-Special-Topics tabs, plus the ~20 external-audit items that had been applied without independent verification.
**Verified under:** Opus 5 (four parallel verification passes). The content being audited had been verified under Sonnet 5.

---

## Why this pass happened

A prior round verified this repo's content and recorded the results. A question about *which model* verified what revealed that essentially all policy substance had been checked under Sonnet 5, while only one narrow slice had been re-checked under Opus. This pass audited the rest.

**It found errors in all four tabs.** The single most useful structural finding: **corrections were landing in one file and not being swept into the others** — the same fact lives in `data/*.json`, the inline mirrors, static HTML, and the companion page, and fixing one instance had repeatedly been treated as done.

---

## Corrections applied

### Tab 2 — Reimbursement Roadmap (most severe: ended models were rendering as active)

| Model | Was | Now |
|---|---|---|
| `BPCI_ADV` | ongoing | ended **2025-12-31** |
| `CJR` | ongoing | ended **2024-12-31** |
| `VBID` | ongoing | ended **2025-12-31** (CMS terminated for excess cost) |
| `HHVBP` | ongoing | ended **2021-12-31** — with a note that the nationwide "expanded HHVBP" from 2023 is a *separate permanent program*, not this model |
| `ViT` | ongoing | ended **2024-12-31** *(moderate confidence — see open items)* |
| `EOM` | open-ended | ends **2030-06-30** |
| `GUIDE` | open-ended | ends **2032-06-30** |
| `IBH` | open-ended | ends **2032-12-31** |
| `AHEAD` | open-ended, old name | ends **2035-12-31**; **renamed** to *Achieving Healthcare Efficiency through Accountable Design* (CMS, Sept 2025 — acronym retained) |

Added **CJR-X** (mandatory nationwide, from 2028-01-01), the episode-side equivalent of the LEAD addition made for ACO REACH.

**`service_types.json`:** removed **Enhancing Oncology Model from End-Stage Renal Disease** — an oncology episode model does not apply to dialysis. Removed the **double-listed HHVBP** from Home Health's `innovationModels` (it belongs in `valueBasedModels` only). Propagated the AHEAD rename. Added **LEAD to the 10 service types carrying ACO REACH**, which ends Dec 2026 and previously had no successor mapped anywhere.

### Tab 1 — Ontology relationships

**Relationships removed as factually wrong:**
- `ACO_REACH → MSSP "successor to"` — REACH replaced **GPDC**; MSSP runs in parallel and still exists. The edge contradicted its own node description.
- `HRSA → PACE "coordinates"` — PACE is CMS-administered; HRSA has no substantive role.
- `AHRQ → QPP "research supports"` — vague filler with no formal relationship.

**Reciprocal duplicates removed** (same fact asserted in both directions): `MSSP → ACA`, `MIPS → QPP`.

Removing the HRSA and AHRQ edges would have orphaned both nodes, so rather than delete-and-orphan or keep-a-falsehood, both were **replaced with genuine relationships**: `ACA → HRSA` (Community Health Center Fund, §10503) and `AHRQ → MIPS` (CAHPS instruments used in patient-experience scoring).

**Tense corrected:** `CMMI → PCF` and `CMMI → MCP` now read "administered" — both models have end dates.

### Tab 1 — stale facts that had never been swept

| Location | Was | Now |
|---|---|---|
| `fda_dhcoe` node **and** a `company_edges` tension note | PCCP "finalized Aug 2025" | **December 3, 2024** |
| `hcc_prog` | "extrapolation methodology finalized" | **vacated** (N.D. Tex., Sept 25 2025), appeal pending at the Fifth Circuit |
| `team_prog` | 3 episode types, "188 metro areas" | **5 episode types**, **188 CBSAs** (which include micropolitan areas), 30-day window added |
| `ma_prog` / `Medicare_PartC` | ~33M / "over 30M, over 50%" | **~35M, ~55%** (Feb 2026) |
| `Medicaid` | "over 80 million" | **~73.5M** (May 2026), with the unwinding-era peak noted |
| `onc_astp` | HTI-1 described as settled | HTI-5 (Jan 2026) proposing removal of those requirements now noted |
| `joint_commission`, Top Shift #6 | "partnered Sept 2025" | **partnership June 2025**, first joint guidance **Sept 17 2025** |
| Top Shift #4 | "721 hospitals across 188 metro areas" | **741 hospitals**, 188 CBSAs |

### Tab 1 — edge-type misuse

- `google_cloud → cms0057_prog` and `aws → cms0057_prog`: `cloud_ehr_partnership` → **`serves`**. The target is a regulation, not an EHR or health system.
- `chai → joint_commission`: `sets_voluntary_standard_for` → **`partner`** (they jointly issued guidance).
- `chai → mayo_clinic`: same retype — membership is not standard-setting.
- `chai → ma_prog` tension edge **removed** — it described general regulatory uncertainty, failing this repo's own "two named sides" bar.
- `obbba_c → ca_dhcs` tension **retyped to `hier`** and the dispute claim removed — the note described states suing HHS/CMS, but the edge connected a statute to a state agency that is itself a co-plaintiff.

Three orphan nodes connected with real relationships (`oracle_health → oracle_hin`, `dosespotco → surescripts`, `ca_dph → cdc`).

### Tab 3 — Data Taxonomy

- Home Health Claims: **`HHA_ID` → `PRVDR_NUM`** (HHA_ID is not a CCW variable).
- MBSF: **`HICNO` → `MBI`** (HIC was replaced in 2018), with a note.
- UDS scope widened — it covers **FQHC Look-Alikes** as well as grantees.

The static coding reference (DRG/HCPCS/HCC/ICD/APC, TOB, claim forms) verified **clean**, and HCC **V28 confirmed current** — 2026 is the first 100% V28 year.

### Tab 4 — Analytical Stacks

| Task | Correction |
|---|---|
| `episode` | IRF is paid by **Case-Mix Group via HIPPS**, not DRG |
| `episode` | Episode window is **model-specific** — 90 days for BPCI-A/CJR, **30 for TEAM**. The task taught 90 as default while naming TEAM as its example, contradicting this repo's own corrected data |
| `rate_measure` | Wilson CI for 2/5 is **~12%–77%**, not the stated 7%–85% (that figure is closer to Clopper-Pearson, which the task lists only as the alternative) |
| `forecast` | The stated reason for COVID distortion contradicted its own example — in a 2017–2024 window the anomalous years are **mid-window**, not most recent |
| `causal` | **Neither scikit-learn nor econml performs propensity score matching** — sklearn estimates scores, econml does doubly-robust/HTE. Corrected to name actual matching libraries |
| `descriptive` | The institutional/professional coding split was wrong: **ICD-10-PCS is inpatient-only**; institutional outpatient (13x) carries HCPCS like professional claims |
| `regression` | Proposed Poisson for a continuous **cost** outcome, contradicting its own Gamma-log-link caveat |
| `risk_score` | V28 removes **~2,294** codes (not ~2,000); added the two omitted structural changes — **86→115 categories** and **constraining** |
| `provider_profile` | scipy ships the `betabinom` **distribution**, not an empirical-Bayes shrinkage routine |
| `comparison` | Declared stack lacked the exact tests its own caveat recommended |

### The external-audit items (applied earlier without verification)

**A figure this project manufactured and propagated:** Georgia's "**246,365 eligible**" was standardised across **8 locations in 3 files** on the audit's say-so. It cannot be sourced — published denominators are ~447,000–536,000 (full-expansion) or a loosely-cited ~240,000–250,000 (Pathways-specific). Replaced everywhere with the sourced range. Two vague-but-defensible numbers had been replaced with one precise-but-unsupported one, which is strictly worse.

**Unverified figures removed:** Alameda's "50,000+ by 2030" and "~400,000 total enrolment", and Santa Clara's "~460,000 enrolled" denominator. The sourced halves — **14,600 of ~159,000** (Alameda BOS) and **129,000 by 2028** (UC Berkeley Labor Center) — are retained, and the Labor Center's statewide decomposition was added.

**Softened:** the claim that nonprofits cannot get CalHEERS/CalSAWS API access — unverifiable, and the CalHHS Data Exchange Framework explicitly names community-based organisations as participating entities. Now describes a governance pathway, not a prohibition.

**Detail corrections:** Vehicle Code **§14902(f)** (not (i)), plus the verification-by-provider requirement · CalAIM renewal submitted **May 12** · Georgia period **FY2021–Q2 FY2025 (ending March)**, care spend **$26.2M** · DSH 11.75% is the **DSH adjustment percentage**, a formula output, not "Medicaid inpatient days" (and 8% for sole community hospitals) · §71109 effective **Oct 1 2026**, with its ~200,000 California figure attributed specifically to **refugees and asylees** · retroactive coverage **1 month expansion / 2 months traditional**.

**Upgrades where the verified fact was better than what was published:** the ILOS durability argument is now stated precisely — **12 of 14 Community Supports** are authorised under 42 CFR §438.3(e)(2), independent of the waiver; only **2** are waiver-dependent. Arkansas now leads with its strongest finding: **>95% of the target population appeared to meet the requirement or qualify for exemption**, with ~47% of the manual-reporting group (18,164 people) losing coverage.

---

## Error taxonomy — the patterns, now encoded in the protocol

Ten recurring patterns were extracted from this repo's own error history and written into `CLAUDE.md` as a pre-flight checklist: false precision, statistic misattribution, unswept correction, direction inversion, superlative inflation, stale-as-current, scope overreach, relationship invention, cited-but-unchecked, and adjacent-date conflation. Each entry carries the real example that produced it.

A **conflation register** was also added — 15 pairs of facts this project has demonstrably mixed up, each being two different true things that read as one (TEAM's 30-day vs BPCI/CJR's 90-day window; original vs expanded HHVBP; §71109 vs §71301/§71302; the three different provider-tax dates; Wilson vs Clopper-Pearson; and so on).

---

## Protocol changes

**New Step 00 — Verification standard.** Six rules, the sweep rule (with the `grep` command that makes a correction complete), the error taxonomy, and the conflation register.

**New Step 01 — Model escalation check.** Seven concrete triggers for recommending a stronger reasoning model, with instruction to **notify the user out loud at the moment a trigger fires** rather than silently continuing. Also requires changelogs to **record which model verified what**, since provenance is otherwise unrecoverable — the gap that prompted this entire pass.

**Step 9 — Validate and commit** now runs **four gates** instead of one, because every error found in this audit passed the original referential-integrity check: cross-references, graph integrity (orphans, reciprocal duplicates, edge-type conformance, tension notes), stale-status sweep, and mirror equivalence.

**Steps 1 and 2** gained relationship-validity and edge-type-discipline rules, each citing the specific failure that motivated it.

---

## Open items — deliberately not resolved

- **`ViT` end date** set to 2024-12-31 at *moderate* confidence; the CMS status page did not render during verification.
- **`IBH` start date** — repo says 2024-01-01, CMS describes the model as running 2025–2032. Not changed; needs a primary source.
- **TEAM participation count** — corrected to 741 per CMS and trade press, but this repo previously asserted 721 with a stated IHS/Tribal-exclusion rationale that could not be confirmed either way.
- **Two `emergent` orphan nodes** (`opioid_special`, `ed_special`) still have no edges. The `weak_link` definition implies they should connect via an intermediary; inventing one would be worse than leaving the gap visible.
- **Eight dataset linkage IDs** remain unverified (`MEDPAR_ID`, `REV_CNTR`, `PLAN_ID`, `PROD_SRVC_ID`, `RPT_REC_NUM`, `ACO_ID`, `OSHPD_ID`, TAF `MSIS_ID`/`STATE_CD`).
- **14 `joint_commission → X "accredits"` edges** are plausible but unverified per-system; some large systems use DNV or other CMS-approved accreditors.
- **Tab 4 internal references** (`core/analysis/*` module paths, ANL-xxx/VAL-042 codes) are project-internal and not externally checkable.

---

## Verification performed

- All 9 JSON files parse; service-type → CMMI cross-references resolve
- Graph integrity: **zero orphans** in the Legislative Map, **zero reciprocal duplicates**, all edge types within the documented vocabulary, all `tension` edges carrying notes
- One broken reference introduced mid-pass (`ohin` for `oracle_hin`) was caught by the edge-resolution check and fixed before commit
- All 8 inline mirrors re-synced and confirmed data-identical to source
- Tag balance across 16 element types on both HTML files: zero mismatches
