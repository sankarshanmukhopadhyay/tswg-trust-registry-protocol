# WP5 — Evidence completeness, freshness, absence and indeterminacy

Status: **downstream reference behaviour implemented; independent interop pending**

Canonical WP5 tracker:
https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/issues/2

Candidate specification tracker:
https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/issues/3

External motivating reference:
https://github.com/ayraforum/ayra-trust-registry-resources/issues/43

TSPP validation:
https://github.com/sankarshanmukhopadhyay/TRQP-TSPP/issues/80

Interop validation:
https://github.com/sankarshanmukhopadhyay/trust-protocol-interop-lab/issues/206

## Problem

A missing record is not inherently a negative trust statement. Its meaning depends on whether the evidence source is authoritative for the proposition, complete for the requested scope, and sufficiently fresh at the requested evaluation time.

Likewise, a listed record is not inherently sufficient for a positive trust statement if the source is non-authoritative or stale.

WP5 therefore introduces a downstream three-way decision model without changing TRQP v2 wire semantics:

- `positive`;
- `authoritative-negative`;
- `indeterminate`.

These are internal reference-model values, not proposed normative response vocabulary.

## Evidence-source properties

The evaluator preserves:

- source identifier;
- authoritative/non-authoritative declaration;
- complete-for-scope declaration;
- declared scope;
- observation time;
- next-update/freshness boundary;
- optional source digest;
- requested evaluation time.

## Decision matrix

| Evidence state | Authoritative | Complete for scope | Fresh | Decision |
| --- | --- | --- | --- | --- |
| listed + applicable | yes | either | yes | positive |
| listed + applicable | no | either | yes | indeterminate |
| listed + applicable | yes | either | no | indeterminate |
| not listed | yes | yes | yes | authoritative-negative |
| not listed | yes | no | yes | indeterminate |
| not listed | no | either | yes | indeterminate |
| not listed | yes | yes | no | indeterminate |
| not applicable | yes | n/a | yes | authoritative-negative / not-applicable |
| revoked | yes | n/a | yes | authoritative-negative / revoked |
| expired | yes | n/a | yes | authoritative-negative / expired |
| unknown | any | any | any | indeterminate |
| source unavailable | any | any | any | indeterminate |

`complete_for_scope` is especially important for absence. It is an explicit assertion that the source is expected to contain all relevant records for the declared scope such that absence carries negative meaning.

## Falsification properties

The tests specifically prove that the implementation cannot produce:

1. a false negative by treating absence from an incomplete source as denial;
2. a false negative by treating absence from a non-authoritative source as denial;
3. a false negative by treating stale absence as current denial;
4. a false positive from listed evidence in a non-authoritative source;
5. a false positive from stale listed evidence.

## Not-listed versus not-applicable

These states are intentionally distinct.

`not-listed` means no applicable record was found in a source whose completeness may determine whether that absence has negative meaning.

`not-applicable` means evidence exists or source semantics establish that the proposition falls outside the applicable purpose/resource/scope. It must not be collapsed into absence because it conveys a different governance fact.

## Revoked and expired

A fresh authoritative source may support an authoritative-negative result for a material-dependent proposition because the referenced material is revoked or expired.

This does **not** assert that the semantic principal itself is revoked. WP4 established the lifecycle separation documented at:
https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/blob/feat/verification-material-reference/development/verification-material/WP4-lifecycle.md

## Freshness

The current reference evaluator treats evidence as insufficient when it has no temporal freshness evidence, is evaluated before its observation time, or is evaluated after `next_update`.

This is intentionally conservative. A future profile/specification may define alternative freshness contracts, but it must do so explicitly and deterministically.

## Candidate requirement

WP5 provides implementation evidence for the following candidate direction:

> A TRQP implementation MUST distinguish an authoritative negative from absence or uncertainty when the evidence source cannot establish authority, completeness for the requested scope, or adequate freshness. It MUST NOT derive a definitive positive or negative result from stale, unavailable, incomplete, or non-authoritative evidence where those properties are material to the proposition.

A second candidate requirement follows:

> When absence is used to support a negative result, the implementation MUST have evidence that the queried source is authoritative and complete for the declared scope at the applicable evaluation time.

These remain downstream candidate requirements until reconciled with upstream TRQP work. Relevant upstream TRQP issues will be added using full URLs when they are available.

## Implementation and tests

Implementation:
https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/blob/feat/verification-material-reference/development/verification-material/evidence.js

Falsification tests:
https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/blob/feat/verification-material-reference/tests/wp5-evidence-indeterminacy.test.js

## WP5 gate

- [x] evidence-source authority represented;
- [x] scope completeness represented;
- [x] deterministic freshness represented;
- [x] positive / authoritative-negative / indeterminate classification implemented;
- [x] not-listed and not-applicable separated;
- [x] stale and unavailable evidence remain indeterminate;
- [x] unsafe false-negative collapse falsified;
- [x] unsafe false-positive collapse falsified;
- [x] provenance retained in evaluator output;
- [ ] CI evidence GREEN;
- [ ] independent TSPP evidence;
- [ ] independent Interop Lab evidence;
- [ ] upstream issue reconciliation when relevant upstream issues become available.

Next after CI validation: WP6 historical evaluation, where the question becomes not merely whether current evidence is fresh, but whether the system can prove what the authoritative state was at a requested historical time.
