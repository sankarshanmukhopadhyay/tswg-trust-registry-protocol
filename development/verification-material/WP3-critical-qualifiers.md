# WP3 — Decision-critical qualifier handling

Status: **reference behaviour and falsification tests implemented**  
Canonical tracker: https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/issues/1  
Candidate next-draft plan: https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/blob/draft/next-trqp/development/next-draft/NEXT-DRAFT-PLAN.md  
Candidate traceability register: https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/blob/draft/next-trqp/development/next-draft/TRACEABILITY.md  
External motivating evidence: https://github.com/ayraforum/ayra-trust-registry-resources/issues/43  
Interop evidence tracker: https://github.com/sankarshanmukhopadhyay/trust-protocol-interop-lab/issues/205

## Problem

WP0 established that current TRQP v2 extensibility semantics require an endpoint to ignore an unrecognized context member and continue processing the query. That rule is safe only for conditions whose omission cannot materially broaden the trust proposition.

Verification material can be decision-critical. A client asking whether Principal A is authorized **when represented by Material C1** is not asking the same question as whether Principal A is authorized without that condition.

Silently removing C1 can therefore transform the proposition and create a false positive.

## Reference behaviour

WP3 introduces an experimental distinction between optional and decision-critical qualifiers.

A verification-material qualifier has:

```text
verification_material:
  id: <material identifier>
  critical: true | false
```

This is an internal reference shape, **not a proposed TRQP v2 wire schema**.

The endpoint also has an explicit capability state indicating whether it can evaluate verification material.

### Supported critical qualifier

If verification-material evaluation is supported, the request is passed to the WP2 material-bound evaluator and the exact material remains part of the evaluated proposition.

### Unsupported critical qualifier

If verification-material evaluation is unsupported and the qualifier is critical:

```text
processed: false
authorized: false
handling: unsupported-critical-qualifier
```

The endpoint does not evaluate the remaining broader principal-only proposition.

### Unsupported optional qualifier

The reference processor records that an unsupported non-critical qualifier is ignorable, but WP3 deliberately does not manufacture a principal-only positive response itself. This keeps the experiment focused on proving the safety boundary rather than defining complete legacy endpoint behaviour.

## Safety invariant

> An implementation MUST NOT silently ignore an unsupported decision-critical query condition when doing so broadens the proposition being evaluated and can produce a positive result that would not establish the client's requested proposition.

This is the first candidate core-protocol normative delta produced by the implementation work. It remains downstream/non-normative pending broader compatibility analysis, WP7 wire design, interoperability evidence, and upstream disposition.

## Falsification tests

The executable suite proves:

1. unsupported critical material qualifier stops processing and cannot return positive;
2. an unknown critical material identifier cannot be stripped into a broader positive query;
3. a supported critical qualifier is evaluated through WP2's material-bound path;
4. supported-but-unknown material remains a bounded negative rather than degrading;
5. unsupported non-critical material is explicitly identified as ignored and is not reported by this processor as a positive material-bound decision;
6. a supported critical material qualifier requires a material identifier.

Implementation:
https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/blob/feat/verification-material-reference/development/verification-material/critical-qualifiers.js

Tests:
https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/blob/feat/verification-material-reference/tests/wp3-critical-qualifier.test.js

## Compatibility consequence

WP3 demonstrates a genuine tension with current TRQP v2 processing rules. If the eventual interoperable design marks conditions as decision-critical, conforming endpoints need a way to recognize that criticality **before** applying the existing ignore-unknown-extension behaviour.

Potential mechanisms remain deliberately unresolved:

- explicit `critical` / `must-understand` query metadata;
- endpoint capability discovery/negotiation;
- a profile identifier whose semantics require material support;
- a dedicated material-bound query type;
- a new major-version processing rule.

WP3 proves the required safety property; WP7 should choose the smallest interoperable wire mechanism that preserves it.

## Candidate versioning implication

This work increases the probability that the eventual change may cross a major-version boundary if safe critical-extension semantics cannot be added while preserving TRQP v2's current processing contract.

No version number is assigned yet. See:
https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/blob/draft/next-trqp/development/next-draft/NEXT-DRAFT-PLAN.md

## WP3 gate

- [x] Endpoint capability represented explicitly in the reference processor.
- [x] Critical versus optional qualifier behaviour is independently testable.
- [x] Unsupported critical qualifier cannot yield positive authorization.
- [x] Unsupported critical qualifier cannot be stripped and reinterpreted as a broader query.
- [x] Supported qualifier composes with WP2 exact material-bound evaluation.
- [x] Candidate normative delta recorded without modifying upstream schemas.
- [x] Versioning consequence identified but not prejudged.
- [x] Full URLs used for issue/specification references.

Next: WP4 — verification-material lifecycle and invalidation semantics, coordinated with https://github.com/sankarshanmukhopadhyay/TRQP-TSPP/issues/79 .
