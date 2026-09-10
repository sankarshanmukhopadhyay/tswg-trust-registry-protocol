# WP4 — Verification-material lifecycle and invalidation

Status: **reference behaviour and tests implemented**  
Canonical tracker: https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/issues/1  
Upstream lifecycle proposal: https://github.com/trustoverip/tswg-trust-registry-protocol/issues/176  
Upstream PKI identifier proposal: https://github.com/trustoverip/tswg-trust-registry-protocol/issues/194  
TSPP tracker: https://github.com/sankarshanmukhopadhyay/TRQP-TSPP/issues/79  
Interop tracker: https://github.com/sankarshanmukhopadhyay/trust-protocol-interop-lab/issues/205  
External motivating evidence: https://github.com/ayraforum/ayra-trust-registry-resources/issues/43

## Proposition

Verification material has a lifecycle independent of the semantic principal. Rotation, supersession, expiry, revocation, and unknown material state can invalidate propositions that depend on that material without automatically invalidating the principal itself.

Conversely, cryptographically usable material does not establish that the principal is recognized or authorized for a requested action/resource. Material lifecycle is one input to a trust decision, not the trust decision itself.

## Reference lifecycle outcomes

The downstream evaluator distinguishes:

- `valid`;
- `not-yet-valid`;
- `expired`;
- `revoked`;
- `superseded`;
- `unknown`.

These values are implementation evidence, not proposed normative TRQP response vocabulary.

## Temporal behaviour

The evaluator accepts an explicit evaluation time. `valid_from` and `valid_until` are evaluated independently of the material's declared lifecycle status.

This creates the groundwork for WP6 historical evaluation while keeping WP4 narrow: WP4 answers whether material is usable at a requested time; WP6 must address whether sufficient historical evidence exists to justify a historical trust decision.

## Rotation invariant

A rotation from C1 to C2 is represented without changing the principal:

```text
Principal A
   |
   +-- C1  superseded / expired
   |
   +-- C2  valid
```

At a current evaluation time after rotation, C2 may be usable while C1 is not. `Principal A` remains the same semantic principal.

## Invalidation boundary

The reference behaviour establishes:

> A verification-material lifecycle event invalidates material-dependent propositions to the extent that those propositions depend on the affected material. It does not, by itself, revoke recognition or authorization of the semantic principal.

A separate authority/recognition lifecycle event may invalidate the principal-level proposition even when the material remains cryptographically usable. This inverse case is intentionally retained for later composition testing.

## Tests

Executable tests prove:

1. material is usable within its validity interval when its lifecycle status is valid;
2. material is unusable before `valid_from`;
3. material is unusable after `valid_until`;
4. revoked material is unusable without changing the principal identifier;
5. superseded material is unusable for current evaluation;
6. unknown material state cannot become usable;
7. rotation permits replacement material under the same principal;
8. material validity does not itself produce `authorized` or `recognized` state.

Implementation:
https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/blob/feat/verification-material-reference/development/verification-material/lifecycle.js

Tests:
https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/blob/feat/verification-material-reference/tests/wp4-material-lifecycle.test.js

## Candidate next-draft implication

This evidence supports the direction of:
https://github.com/trustoverip/tswg-trust-registry-protocol/issues/176

but adds an important decomposition: lifecycle must identify **what changed** and therefore **which proposition/evidence is invalidated**. Principal recognition, authorization, verification-material association, verification-material usability, and source evidence can have distinct lifecycles.

Candidate traceability remains at:
https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/blob/draft/next-trqp/development/next-draft/TRACEABILITY.md

## Explicit non-decisions

WP4 does not yet decide:

- wire-level lifecycle vocabulary;
- revocation reason taxonomy;
- source completeness/freshness semantics;
- whether historical revocation state can be reconstructed from current state alone;
- caching/invalidation protocol mechanics;
- normative relationship between material status and recognition response;
- how a lifecycle profile composes with core TRQP versioning.

## WP4 gate

- [x] Validity interval evaluation implemented.
- [x] Revocation, expiry, supersession, unknown, and not-yet-valid states testable.
- [x] Rotation beneath stable principal testable.
- [x] Material lifecycle kept separate from authorization/recognition state.
- [x] Candidate invalidation boundary documented.
- [x] Full URLs used for upstream/downstream references.

Next: WP5 — evidence completeness, freshness and indeterminacy, coordinated with https://github.com/sankarshanmukhopadhyay/TRQP-TSPP/issues/79 and https://github.com/sankarshanmukhopadhyay/trust-protocol-interop-lab/issues/205 .
