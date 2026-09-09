# Downstream TRQP development roadmap

Status: working execution plan as of 2026-09-09.

Canonical semantic tranche: https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/issues/1

WP7 wire/versioning tranche: https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/issues/4

Candidate evidence/indeterminacy specification issue: https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/issues/3

External motivating reference: https://github.com/ayraforum/ayra-trust-registry-resources/issues/43

Relevant upstream TRQP issues will be added using full URLs when available. Downstream implementation does not imply upstream normative acceptance.

## Current position

WP0–WP6 have repository-local implementation/falsification evidence. WP7 has established the v2 compatibility boundary, implemented critical-context/profile experiments, and added candidate request/response schemas plus conformance vectors. WP8 independent interoperability/assurance evidence remains the principal graduation gate.

No development branch should be merged into `main` until the promotion review described below.

## Execution timeline

| Window | Tranche | Deliverable | Gate |
| --- | --- | --- | --- |
| 9 Sep | WP7-A | candidate request/response schemas, dependency-free conformance validator, downgrade vectors | repository CI GREEN |
| 10 Sep | WP7-B | complete response reason vocabulary, profile/critical-context capability contract, update traceability and close WP7 if all tests pass | evidence-backed TRQP 2.x vs 3.0 recommendation |
| 10–11 Sep | WP8-A | Interop Lab `IC-TRQP-PKI-001` fixtures/adapters covering positive, revoked, superseded, absent/incomplete, stale, wrong-purpose and unsupported-critical cases | independent machine-verifiable evidence |
| 11 Sep | WP8-B | TSPP validation of lifecycle/invalidation, evidence completeness/freshness and historical semantics | independent TSPP evidence |
| 12 Sep | Candidate draft | reconcile issues #3/#4 and NTRQP traceability into coherent downstream candidate specification text | every normative candidate maps to implementation/test evidence |
| 13 Sep | Regression/assurance | broad repository regression, schema examples, docs/link audit, compatibility matrix, residual-risk register | no unexplained failures/dead links; v2 baseline preserved |
| 14 Sep | Promotion review | compare development branch with upstream-synchronized `main`; decide retain experimental branch vs downstream release/promotion | explicit human judgment; no automatic merge |
| After upstream issues appear | Upstream reconciliation | add full upstream issue URLs; compare disposition with downstream propositions; revise candidate text/evidence status | `upstream-reconciled` before claiming stability |

Dates are execution targets, not upstream commitments.

## Remaining downstream issue disposition

### https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/issues/4

**Priority: P0 / active.** Finish WP7 before expanding specification prose. Remaining work: reason vocabulary, capability/profile contract, conformance vectors, traceability update, final versioning recommendation. Close when repository-local WP7 evidence is GREEN and the compatibility conclusion is documented.

### https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/issues/3

**Priority: P1 / specification synthesis.** WP5 evidence is already sufficient for candidate text, but this issue should stay open through WP8 so response/evidence semantics can be reconciled with independent evidence. Target closure during candidate-draft synthesis.

### https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/issues/1

**Priority: P1 / umbrella graduation gate.** Do not close merely because WP0–WP7 are implemented. Its acceptance criteria explicitly require schema/conformance coverage, regression coverage, Interop Lab evidence, cross-repository linkage and final branch promotion judgment. Target closure only after WP8 and the promotion review.

## Cross-repository work queue

1. https://github.com/sankarshanmukhopadhyay/trust-protocol-interop-lab/issues/206 — execute WP5/WP6 evidence-state and historical cases as part of `IC-TRQP-PKI-001` rather than creating fragmented duplicate cases.
2. https://github.com/sankarshanmukhopadhyay/trust-protocol-interop-lab/issues/205 — reconcile the broader verification-material interop tracker with the concrete WP7/WP8 matrix and close/retain as appropriate.
3. https://github.com/sankarshanmukhopadhyay/TRQP-TSPP/issues/80 — implement independent completeness/freshness/indeterminacy validation.
4. https://github.com/sankarshanmukhopadhyay/TRQP-TSPP/issues/79 — reconcile lifecycle/invalidation evidence with WP4/WP6 effective-dated semantics.

## Promotion criteria

Promotion is a governance decision, not a CI side effect. Before any merge toward `main`, require:

- repository-local unit/conformance tests GREEN;
- independent Interop Lab evidence;
- independent TSPP evidence where applicable;
- explicit v2 compatibility/versioning conclusion;
- candidate specification propositions traceable to evidence;
- upstream issue URLs incorporated when available;
- residual normative uncertainty documented;
- upstream-synchronized `main` compared against the development head to identify drift;
- explicit decision whether the fork remains an experimental reference implementation or publishes a downstream release.

## Expected downstream outcome

If the remaining falsification evidence continues to support WP7, the likely downstream package is:

1. a reference implementation of principal/verification-material separation;
2. effective-dated lifecycle and historical evaluation;
3. evidence authority/completeness/freshness semantics;
4. fail-closed processing for decision-critical qualifiers;
5. candidate request/response schemas and conformance vectors;
6. an evidence-backed recommendation that these processing changes form a TRQP 3.0 candidate rather than a transparent TRQP 2.x minor extension;
7. independent interoperability evidence suitable for upstream discussion and assurance review.
