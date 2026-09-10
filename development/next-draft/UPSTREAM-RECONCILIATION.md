# Upstream reconciliation — candidate next-TRQP

Status: **downstream reconciliation record; not normative TRQP**

This document reconciles the evidence-backed downstream candidate propositions in `development/verification-material/WP8-candidate-spec-synthesis.md` against known upstream TRQP work. It is an authority and traceability record, not a claim that an upstream issue constitutes acceptance.

## Authority rule

Upstream specification text and formally adopted upstream decisions are authoritative for TRQP. Open upstream issues are proposals/problem statements. Closed historical issues provide provenance only unless their result is incorporated into current approved text.

Accordingly, the relationship vocabulary below is deliberately narrower than “supported”:

- **aligned** — current upstream work addresses materially the same semantic requirement;
- **partially aligned** — upstream work addresses part of the requirement but not its complete downstream semantics;
- **conflicting** — current upstream semantics or proposal direction permits behaviour contradicted by downstream falsification evidence;
- **unresolved** — upstream disposition is required before normative adoption;
- **no disposition** — no sufficiently direct upstream disposition has yet been identified.

No proposition is marked upstream-reconciled merely because a related issue exists.

## Proposition reconciliation matrix

| Candidate | Upstream provenance | Relationship | Authority judgment | Downstream disposition |
|---|---|---|---|---|
| NTRQP-01 principal/material separation | #194 | partially aligned | Upstream PKI/key-identifier work creates direct alignment pressure around identity separation and key/certificate lifecycle, but does not by itself establish the broader downstream semantic-principal model. | Retain as evidence-supported downstream candidate; do not claim upstream adoption. |
| NTRQP-02 exact material-bound evaluation | #194 | partially aligned | Upstream material-identifier work is relevant, but exact principal/material/authority/action/resource binding and prohibition of principal-only fallback remain downstream evidence-backed processing requirements. | Retain candidate; require explicit upstream processing disposition. |
| NTRQP-03 unsupported decision-critical conditions fail closed | historical #115, #113; current profile/version work #181/#183 | unresolved | Upstream provenance recognizes missing-context/result-semantic problems, but no identified current authority establishes the downstream critical-condition rule. Generic v2 unknown optional-context behaviour remains the compatibility pressure. | Retain candidate; treat exact mechanism as unresolved. |
| NTRQP-04 independent material lifecycle | #176, #194; historical #158/#10 | aligned in problem, partially aligned in processing | Current upstream work materially addresses lifecycle/time semantics. Optional/profile-based treatment may be insufficient where lifecycle is decision-critical. | Retain candidate; reconcile mandatory processing obligations before promotion. |
| NTRQP-05 authoritative complete absence may support negative | historical result/context work; #176 where temporal sufficiency applies | no disposition | No identified upstream issue establishes the full authority + completeness + temporal-sufficiency rule for interpreting absence. | Retain downstream evidence-backed candidate; upstream normative treatment required. |
| NTRQP-06 insufficient evidence preserves indeterminate | historical #115/#113 | partially aligned | Upstream history recognizes missing context and overloaded result semantics, but the downstream authoritative-negative/indeterminate evidence model is broader. | Retain candidate; vocabulary and normative class remain unresolved. |
| NTRQP-07 historical evaluation at T | #176; historical #158/#10 | aligned | Upstream lifecycle/time work materially aligns with effective-dated evaluation. Exact handling of missing/conflicting/incomplete historical evidence still needs normative reconciliation. | Candidate remains evidence-supported; reconcile outcome semantics. |
| NTRQP-08 not-applicable distinct from negative/unknown | historical #113 and related result semantics | partially aligned | Upstream provenance supports the problem of overloaded outcomes but does not establish the exact downstream distinction/vocabulary. | Retain candidate; wire vocabulary unresolved. |
| NTRQP-09 legacy unknown-context downgrade unsafe | approved v2 extensibility semantics; #181/#183 | conflicting compatibility boundary | Generic v2 treatment of unknown optional context permits qualifier loss, while downstream falsification demonstrates a false-positive risk for decision-critical qualifiers. | Treat as compatibility requirement. Do not describe candidate semantics as transparent v2 extension. |
| NTRQP-10 negotiated compatibility binds processing obligations | #181/#183; historical #83 | partially aligned | Current profile proposals support negotiated strengthening, but a profile identifier that does not bind mandatory processing is insufficient under downstream downgrade tests. | Profiles may be transitional only with explicit mandatory semantics and exclusion of generic legacy interpretation. |
| NTRQP-11 explicit material qualification + critical-member mechanism | #194; #181/#183 | partially aligned | Material qualification has upstream alignment pressure; exact critical-member mechanism and wire spelling are not upstream-settled. | Keep as experimental proposition; do not promote wire names. |
| NTRQP-12 machine-actionable decision/reason/evidence classes | historical #113/#115 | partially aligned | Upstream provenance identifies result/context ambiguity; exact positive/authoritative-negative/indeterminate/stale/not-applicable model remains downstream candidate work. | Keep mechanism/vocabulary experimental pending upstream disposition. |
| NTRQP-13 major-version/profile boundary | #181/#183 plus approved v2 versioning behaviour | unresolved | Version ownership is upstream. Downstream evidence establishes a breaking-processing hazard but cannot assign the upstream version number. | Preserve “candidate major-version semantic change” language; do not claim TRQP 3.0 as adopted. |
| NTRQP-14 wire names, reasons, discovery/negotiation, migration | #177, #181/#183, #194; #178 where transport separation matters | unresolved | Multiple upstream work items affect the mechanism, but exact normative composition is unsettled. | Keep wire vocabulary and migration rules experimental. |

## Adjacent upstream work not yet promotable into candidate requirements

### Transport independence — upstream #178

The upstream direction is supportive of separating core semantics from transport binding. Historical #174/#82/#56/#118 provide provenance. This is relevant to the next draft architecture, but the WP8 proposition set does not currently contain an independently evidenced transport-independence requirement. It therefore remains adjacent work rather than being silently added as a promoted candidate requirement.

### Endpoint/capability discovery — upstream #177

Discovery is relevant to capability/profile negotiation and migration. The current downstream evidence does not yet establish an executable discovery contract. Discovery therefore remains unresolved mechanism work under NTRQP-14 rather than a separately promoted behavioural requirement.

### Recognition semantics — upstream #182

Recognition modeling and proof propagation are directly relevant to trust-registry semantics. The downstream candidate must not infer recognition transitivity merely from graph connectivity. No new recognition proposition is promoted here without executable/falsification evidence.

### Governance/security profiles — upstream #181/#183

Profiles may strengthen governance or security assurance without redefining the query proposition. They become relevant to compatibility only where negotiation binds mandatory processing obligations. Profile labels alone are not evidence that a peer safely evaluates decision-critical qualifiers.

## Compatibility judgment

The upstream reconciliation does not remove the WP7/WP8 compatibility finding.

The downstream falsification boundary is semantic: a legacy processor allowed to ignore an unknown optional condition can evaluate a broader proposition than the requester intended. Adding a syntactically optional field or profile label does not solve that problem unless the receiving peer is already bound to understand and enforce the relevant processing obligation.

Therefore:

1. transparent generic-v2 extension is not currently justified;
2. a negotiated profile is potentially viable only if it establishes mandatory processing semantics before evaluation and excludes legacy fallback;
3. the final version/profile mechanism remains an upstream authority decision;
4. downstream documentation should use **candidate major-version semantic change** rather than presenting “TRQP 3.0” as an upstream decision.

## Evidence and promotion gates

A proposition may advance from downstream candidate toward stable adoption only when all applicable gates are satisfied:

- repository-local implementation and negative/falsification tests;
- independent cross-repository evidence;
- explicit authority/source/completeness/freshness treatment where evidence semantics are involved;
- upstream normative disposition or adopted specification text;
- compatibility/migration treatment;
- artifact-level promotion judgment.

Open issue alignment alone satisfies none of these gates.

## Residual normative questions

The following remain unresolved and MUST stay visibly unresolved in candidate text:

1. final major-version versus mandatory-profile mechanism;
2. normative wire name for verification-material qualification;
3. normative mechanism for declaring decision-critical context;
4. exact decision/result/reason vocabulary;
5. capability/profile discovery and negotiation contract;
6. migration behaviour between generic v2 and the candidate processing model;
7. exact normative treatment of incomplete, stale, conflicting and unavailable evidence;
8. recognition proof propagation/transitivity semantics;
9. transport-profile boundaries where they interact with capability discovery.

## Promotion disposition

**Current judgment: HOLD experimental candidate semantics on `draft/next-trqp`.**

The evidence is sufficient to maintain and refine the candidate processing model. It is not sufficient to merge the candidate semantics wholesale into stable `main`, nor to describe them as upstream-approved TRQP.

Stable `main` remains the synchronization/stability boundary. Reusable tooling may be considered separately through bounded PRs after independent artifact-level review.

```yaml
change:
  type: docs
  scope: upstream-reconciliation
  breaking: false
  authority_impact: high
  assurance_impact: high
  normative_status: downstream-experimental
  promotion: hold
```
