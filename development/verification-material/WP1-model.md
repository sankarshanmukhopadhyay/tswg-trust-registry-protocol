# WP1 — Canonical internal principal / verification-material model

Status: **implemented as downstream reference-model primitive**  
Canonical tracker: https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/issues/1  
External motivating evidence: https://github.com/ayraforum/ayra-trust-registry-resources/issues/43  
TSPP impact tracker: https://github.com/sankarshanmukhopadhyay/TRQP-TSPP/issues/79  
Interop evidence tracker: https://github.com/sankarshanmukhopadhyay/trust-protocol-interop-lab/issues/205

## Decision

WP1 introduces an internal reference-model primitive that keeps the semantic principal independent from the cryptographic verification material associated with that principal.

The implementation intentionally does **not** modify the TRQP v2 request/response schemas. Wire-format selection belongs to later work after the behavioural semantics have been exercised.

## Model

```text
Principal
   |
   +---- PrincipalMaterialBinding ----> VerificationMaterial
                                          |
                                          +-- id
                                          +-- type
                                          +-- role (optional)
                                          +-- status
                                          +-- valid_from (optional)
                                          +-- valid_until (optional)
```

The principal identifier and verification-material identifier are independent values. Multiple material versions can therefore bind to the same principal without changing principal identity.

## Supported experimental material categories

The internal model deliberately uses generic categories rather than an X.509-only object:

- `x509-certificate`;
- `did-verification-method`;
- `public-key`;
- `other`.

This is an implementation experiment, not normative TRQP vocabulary.

## Lifecycle state

The internal model currently supports:

- `valid`;
- `revoked`;
- `expired`;
- `superseded`;
- `unknown`.

These states permit WP4 to exercise independent material lifecycle without requiring the TRQP wire response taxonomy to be decided in WP1.

## HAVID alignment

The WIP High Assurance Verifiable Identifiers specification is a useful architectural input:

https://trustoverip.github.io/high-assurance-verifiable-identifiers/

The alignment used here is deliberately narrow: identifier systems and the relationships between them should retain their distinct semantics rather than being collapsed into one identifier. WP1 applies the same separation discipline to a TRQP principal and the material through which that principal may be verified or operationally represented.

HAVID is **not** treated as the solution to TRQP material-bound authorization. It does not replace the need to define safe query qualification, lifecycle evaluation, evidence completeness, historical evaluation, or unsupported-critical-condition behaviour in this workstream.

## Invariants established by tests

1. Principal identity remains independent of material identity.
2. Multiple material versions can be associated with the same principal.
3. The internal abstraction is not restricted to X.509 certificates.
4. Material lifecycle/status is independently representable.
5. Invalid lifecycle intervals are rejected.
6. Empty principal/material identifiers are rejected.
7. WP1 does not silently alter upstream TRQP v2 schemas.

## Explicit non-decisions

WP1 does not decide:

- whether verification material belongs in `context`, a new top-level field, a profile, or a new query type;
- whether a critical-extension mechanism requires a minor or major TRQP version;
- the normative response taxonomy for unknown/stale/unsupported states;
- how source completeness and provenance are represented;
- how HAVID cross-endorsement evidence would be carried or evaluated;
- whether material itself can be a TRQP principal in a distinct use case.

These remain later work packets and/or upstream disposition questions.

## Evidence

Executable tests:

https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/blob/feat/verification-material-reference/tests/wp1-principal-material-model.test.js

Reference model:

https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/blob/feat/verification-material-reference/development/verification-material/model.js

## WP1 gate

- [x] Principal and verification material independently represented.
- [x] Generic material abstraction avoids an X.509-only canonical model.
- [x] Independent material lifecycle represented.
- [x] Validation tests added.
- [x] Baseline TRQP schemas remain unchanged.
- [x] HAVID alignment recorded without importing its model wholesale.
- [x] Full URLs used for cross-repository references.

Next: WP2 — material-bound evaluation, still on `feat/verification-material-reference` and without promotion to `main`.
