# 2026-11-17 — Content refresh (Tabs 1–5)

**Verified under:** Claude Opus 5.5 (`claude-opus-5-5`). This is a refresh pass, not a full re-audit: every item **changed or added** here was checked against a named source, but unchanged content was not re-verified.

**Baseline:** previous refresh 2026-09-27. Window covered: late September – November 17, 2026.

## Tab 1 — Ontology, Payer & Company Map, Top Shifts

| Change | Source |
|---|---|
| Ontology `IPPS_Rule`, `OPPS_Rule`, `PFS_Rule`, `ESRD_Rule`: added FY2027 / CY2027 final-rule summaries | CMS PFS fact sheet; CMS ESRD fact sheet (CMS-1846-F); Holland & Knight and HFMA summaries for OPPS (CMS-1850-FC) and IPPS |
| Ontology `ONC`: HTI-5 final rule (Oct 26, 2026) | healthit.gov HTI-5 removals/revisions table; AHA; Hooper Lundy |
| Ontology `CJR`, `BPCI_ADV`, `PCF`: open-ended "(2016–)" style dates replaced with end dates; `CMMI → CJR` and `CMMI → BPCI_ADV` edges changed to "administered" | Already-recorded `endDate`s in `cmmi_models.json` (stale-as-current fix) |
| `onc_astp`, `joint_commission` nodes: HTI-5 finalized; Joint Commission Responsible Use of AI certification launched June 1, 2026 (node had still described it as planned) | healthit.gov; Joint Commission news release (June 1, 2026) |
| `onc_astp → epic` edge label: no longer describes the removed HTI-1 model-card mandate as current | as above |
| `ira_c`, `ira_drug_prog`: Cycle 2 effective Jan 2027; Cycle 3 negotiation period closed Nov 1, 2026, prices due by Nov 30, 2026 | CMS Nov 25, 2025 press release (Cycle 2); CMS third-cycle fact sheet |
| `obbba_c`: Oct 29, 2026 ruling and Nov 13, 2026 hold-harmless guidance | KFF (Nov 2, 2026); Morgan Lewis (Nov 6, 2026); CMS SMD #26-006 |
| `lead_prog`: 10-year voluntary term; implementation-period list (Sept 21, 2026); final PY2027 roster not yet published | CMS LEAD model page; CMS implementation-period participant list |
| Top Shift `ts_obbba`: litigation status, hold-harmless period, four-state coercion suit (Nov 5, 2026) | as above; Minnesota AG release (Nov 6, 2026) |
| Top Shift `ts_obbba` implications: **"CA-led coalition" corrected to Massachusetts-led** (contradicted the shift's own catalyst); **DHCS figure now leads with the 1.1M central estimate**, with 3.4M named as the high-end scenario (Step 00 conservative-figure rule) | DHCS figures as already published on Tab 5 |
| Top Shift `ts1`: Cycle 3 status | CMS |
| Top Shift `ts4`: **741 → 721 hospitals**, aligning with `team_prog` and `cmmi_models.json` (741 was the original 2024 list); CJR-X finalized; ASM implication added | `team_prog` sourcing; FY2027 IPPS final rule summaries; CMS ASM page |
| Top Shift `ts6`: HTI-5 finalized; Joint Commission certification launched | as above |

## Tab 2 — Reimbursement Roadmap

- **New models:** WISeR (2026–2031), ACCESS (began July 5, 2026), Ambulatory Specialty Model (2027–2031). Source: CMS Innovation Center model pages. Category assignments follow the CMS pages.
- **TEAM:** `endDate` set to 2030-12-31 (was `null`); "188 metro areas" corrected to 188 CBSAs.
- **CJR-X:** description rewritten from the FY2027 IPPS final rule (start delayed from Oct 1, 2027 to Jan 1, 2028; TEAM participants and Maryland hospitals excluded). Now appears in service-type lanes, where before it was in the data but did not render.
- **LEAD:** name corrected to CMS's "Long-term Enhanced ACO Design (LEAD)". The prior name read "ACO … Accountable Care Organization Design". Updated in both `cmmi_models.json` and `service_types.json`.
- **HHVBP and Home Health:** the expanded nationwide model is now dated to its CY2022 rule with performance measured from 2023, per the Step 00 conflation register (the text had said "nationally since 2022").
- **Service-type fee-schedule notes added:** CY2027 PFS conversion factors ($32.9548 QP / $32.6286 non-QP); CY2027 OPPS (2.3% update, 340B at ASP−28%, remedy offset 0.5%→2%, imaging site-neutral expansion); FY2027 IPPS (2.3%); CY2027 ESRD ($297.52 base rate, ~2.7%); CY2027 HH (behavior adjustment, recalibration).

## Tab 3 — Data Taxonomy

- Section C: two pairs added (21 total). They are "Medically-frail ruling vs hold-harmless period" and "Requirement removed vs criterion removed (HTI-5)".
- Dataset catalog: no changes this pass. No new dataset releases or access changes were checked in this window.

## Tab 4 — Analytical Stacks

- **Unswept correction from the 2026-09-25 audit fixed.** That audit corrected `data/analytical_tasks.json`, but the inline `window.__ANALYTICAL_TASKS__` mirror the page renders from was never re-synced. The live page still showed the pre-audit text: Clopper-Pearson-like "7%–85%" bounds labelled as the CI for 2/5, Poisson for cost, the older V28 code counts, and the missing V28 constraining caveat. The mirror is now synced. The Wilson bound (11.8%–76.9% for 2/5) was independently recomputed.
- `window.__ANALYTICAL_TASKS__` is not in CLAUDE.md's Step 7 mirror table, which is likely why the sync was missed.

## Tab 5 — Special Topics (trigger: litigation status change)

- Litigants row, quadrant tooltip, California case study, Limitations bullet, and `LIT_ANALYSIS` (any-state litigation copy) were updated for the Oct 29 ruling, the Nov 13 hold-harmless guidance and the Nov 5 four-state suit. The superseded "motion to reconsider pending" text was removed.
- The July 29, 2026 preliminary-injunction denial date was re-confirmed against the order on the Georgetown Litigation Tracker. One law-firm summary gave July 31; that date was not adopted.
- `special-topics/bay-area-navigation.html`: litigation confirmation line updated.
- Coverage estimates, state records and invariants (51 / 41 / 26) are unchanged.

## Excluded or left open (not published)

- **Scope of the Oct 29 ruling** (nationwide vs plaintiff states): KFF says nationwide; other coverage says plaintiff states only. The order PDF could not be text-extracted, so the page does not state the scope.
- **HTI-5 calendar effective date** for the DSI change: ONC states "effective date of final rule". A secondary source gave Dec 28, 2026, which was not adopted.
- **Cycle 3 negotiated prices:** due by Nov 30, 2026. Not published as of this pass.
- **HH PPS aggregate % change:** secondary sources conflict (2.1% market basket vs "net 2.4%"). Not published.
- **OPPS 340B savings:** $4.35B (HFMA, citing CMS) vs $4.65B (Holland & Knight). Not published.
- **Cell and Gene Therapy Access Model** expansion (Oct 27, 2026): verified, but the model is not added because no Tab 2 service type fits a Medicaid-only drug model.

## Pre-existing gate findings, not changed

- Gate 1: HHVBP, SIM and PACE Innovation are in `cmmi_models.json` but in no service-type lane, so they do not render.
- Gate 2: `opioid_special` and `ed_special` have no edges.
- Gate 3: `PACE` carries `endDate: null` and was not re-verified this pass.
