# Changelog: Actionable Insights Restructured to Present Only Vetted Material

**Date:** 2026-09-23
**Scope:** the Potential Actionable Insights section of `special-topics/bay-area-navigation.html`.

---

## The problem this fixes

The previous pass verified the source framework's evidence claims and recorded the results honestly — but it recorded them *in place*, as hedges attached to the claims themselves. The result was a section where verified and unverified material sat side by side, distinguished only by qualifying language a reader had to parse.

Worse, it was internally inconsistent. Two claims that had **failed verification were still being asserted in the card bodies** while the evidence footer directly beneath them said they were untraceable:

- *"turnover costs ~$8,000-15,000 per hire"* — asserted in the workforce card's lead option; footer said not traceable to any CHW study
- *"private equity can close in 30-60 days vs. 6-12 months for a nonprofit"* — asserted in the FQHC card's fallback option; footer said untraceable and probably inverted

A page cannot both assert a figure and disclaim it. The hedge-in-place approach produced exactly that.

---

## What changed

**The card bodies now carry only claims traceable to a named, openable source.** Everything that failed verification was removed from the cards entirely and relocated to a single register at the foot of the section.

### Removed from card bodies

| Claim | Card | Disposition |
|---|---|---|
| "turnover costs ~$8,000-15,000 per hire" | Workforce | Removed; card now argues from the verified BLS wage figure and CHCF's retention finding instead |
| "PE closes in 30-60 days vs 6-12 months" | Market structure | Removed; the argument for pre-positioned CDFI financing stands without the comparison |
| "housing placement worth $1,000-3,000" / "10-30x leverage" | Funding | Removed; card now rests on the structural point — a Community Support converts an unpredictable grant expense into a billable one — which needs no multiplier |

### Rebuilt around verified evidence

Each card's lead and fallback options were rewritten so their load-bearing claims carry inline source links rather than being asserted and footnoted separately. The section now carries **28 source links across the six cards**, up from a handful.

Where a claim was corrected rather than dropped, the card was rewritten around the corrected fact rather than patched. The clearest case: the CHW wage correction ($45-60K → $69,030 BLS) *undercuts* the framework's original argument, so the workforce card now makes the retention case from Bay Area cost of living rather than from low pay — which is what the evidence actually supports.

### New: "What was excluded, and why"

A distinct register at the foot of the section, visually set apart (red rule, separate card), grouped three ways:

- **Wrong — not used** (2 items): the 77% satisfaction/eligibility misattribution; the inverted PE timing claim
- **Corrected before use** (4 items): DHCS 1.4M → 1.1M; CHW wage; AB 2468 → AB 133; housing-support utilization figures
- **Untraceable — not stated as fact anywhere in the cards** (4 items): navigator documentation percentage; turnover cost; "most common preventable barrier"; personal-spending survey

Each entry says what the claim was, why it failed, and what the card does instead. The register is linked from the section intro and from the individual cards whose claims it covers, so a reader following any thread can reach it.

### Section framing

The intro callout now states the standard plainly: every factual claim in the cards is traceable to a source you can open; material that failed is listed rather than hedged; nothing was quietly dropped and nothing unverified is stated as fact.

---

## Editorial principle applied

Hedged language is not a substitute for editorial judgement. If a claim is not good enough to state plainly, it is not good enough to state with a qualifier attached — it belongs in a register of what was rejected, where a reader can audit the decision without having to weigh every sentence for reliability while reading.

The distinction that matters is between *uncertainty about the world* and *uncertainty about the evidence*. The cards still carry plenty of the former — these are options whose outcomes depend on unsettled decisions (CalAIM renewal, MCP contracting, litigation), and they say so. What they no longer carry is the latter.

One caveat retained deliberately: the infrastructure card cites physician documentation-burden data as an *analogue*, labelled as such, because no navigator-specific study exists. That is a scope limitation on good evidence, not weak evidence — and the absence of navigator time-use data is itself worth naming, so it appears in the excluded register too.

---

## Verification performed

- Programmatic check that all nine previously-failed or unsourced claims are absent from the card bodies and, where applicable, present in the excluded register — all nine confirmed correctly placed
- All 6 cards confirmed to retain their full structure (lead option, fallback, incentive, evidence, day-to-day)
- Tag balance across 16 element types on both files: zero mismatches
- Anchor targets and the four inbound `#excluded` references confirmed resolving
