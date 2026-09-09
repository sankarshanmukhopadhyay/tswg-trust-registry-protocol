# WP2 — Material-bound evaluation

Status: **implemented as downstream reference behaviour**  
Canonical tracker: https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/issues/1  
External motivating evidence: https://github.com/ayraforum/ayra-trust-registry-resources/issues/43  
TSPP impact tracker: https://github.com/sankarshanmukhopadhyay/TRQP-TSPP/issues/79  
Interop evidence tracker: https://github.com/sankarshanmukhopadhyay/trust-protocol-interop-lab/issues/205

## Purpose

WP2 proves the behavioural proposition that a TRQP-style authorization evaluation can be explicitly bound to independently represented verification material without changing the upstream TRQP v2 wire schemas.

WP2 assumes that the evaluator understands the material constraint. Handling an endpoint that does **not** understand a decision-critical qualifier belongs to WP3.

## Evaluation tuple

The reference evaluator binds the decision to the complete tuple:

```text
authority_id
+ principal_id
+ verification_material_id
+ action
+ resource
```

A positive result is eligible only when all five dimensions match a known authorization record and the requested material is currently represented as `valid` in the experimental model.

## Safety invariant

> Failure to match the requested verification material MUST NOT fall back to a principal-only authorization decision.

This is enforced structurally: `verification_material_id` is required by the material-bound evaluator, and all returned decisions carry `material_bound: true`.

## Explicit downstream outcomes

WP2 uses internal diagnostic outcomes so tests can prove why a decision failed:

- `match`;
- `principal-not-found`;
- `material-not-found`;
- `material-principal-mismatch`;
- `material-not-valid`;
- `authority-mismatch`;
- `action-mismatch`;
- `resource-mismatch`.

These are **not proposed normative TRQP response values**. They are reference-implementation evidence. WP5/WP7 and upstream TRQP disposition will determine whether and how such distinctions appear on the wire.

## Tests

The WP2 suite proves:

1. exact principal/material/authority/action/resource match can yield a positive result;
2. unknown material cannot degrade into principal-only authorization;
3. material associated with another principal is rejected explicitly;
4. revoked material cannot authorize even when principal and scope otherwise match;
5. wrong authority is rejected;
6. wrong action is rejected;
7. wrong resource is rejected;
8. unknown principal remains distinguishable from unknown material;
9. omission of `verification_material_id` is rejected rather than treated as an unqualified query.

Reference implementation:
https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/blob/feat/verification-material-reference/development/verification-material/evaluator.js

Executable tests:
https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/blob/feat/verification-material-reference/tests/wp2-material-bound-evaluation.test.js

## Relationship to HAVID

The WIP High Assurance Verifiable Identifiers specification remains an architectural input:
https://trustoverip.github.io/high-assurance-verifiable-identifiers/

WP2 does not attempt to implement HAVID cross-endorsement or key-alignment semantics. Its relevance here is the separation discipline: independently governed identifiers/material should not be collapsed merely because they participate in a higher-assurance relationship.

## Explicit non-decisions

WP2 does not decide:

- the TRQP v2 wire representation of `verification_material_id`;
- whether material qualification uses `context`, a top-level field, a profile, or a new query type;
- capability negotiation / `must-understand` semantics;
- authoritative source completeness or freshness;
- historical evaluation at `context.time`;
- normative result taxonomy;
- upstream compatibility/versioning consequences.

## WP2 gate

- [x] Material-bound evaluator implemented.
- [x] Exact material match required for positive material-bound evaluation.
- [x] Unknown material cannot degrade to principal-only positive.
- [x] Cross-principal material mismatch is testable.
- [x] Invalid/revoked material blocks positive result.
- [x] Authority/action/resource constraints remain independently enforced.
- [x] Upstream TRQP schemas remain untouched.
- [x] Full URLs used for cross-repository references.

Next: **WP3 — critical qualifier handling**, whose primary falsification case is an endpoint that does not understand the material qualifier. That endpoint must not silently discard the qualifier and return an unqualified positive result.
