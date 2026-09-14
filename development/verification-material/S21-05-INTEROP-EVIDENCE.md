# S21-05 differential interoperability evidence

Status: **local differential evidence; independent external implementation still required for normative promotion**.

## Purpose

This packet tests whether the transport-independent S21-05 capability contract is sufficiently precise for two separately implemented evaluators to converge on externally observable outcomes.

## Independence boundary

Implementation A is `discovery.js`.

Implementation B is `discovery-independent.js`. B deliberately imports neither A nor the `.well-known` binding. It separately parses the wire-shaped capability document and implements the admission rules.

This is stronger evidence than testing one implementation against itself, but it is **not** represented as independent external interoperability: both implementations live in this repository and were produced within the same downstream engineering context.

## Shared vectors

The differential suite requires convergence for:

1. fresh, authorized capability metadata;
2. stale metadata;
3. unauthorized publisher;
4. requested-version downgrade;
5. required-profile downgrade; and
6. endpoint movement without semantic service-identity change.

The existing primary suite separately covers conflict and replay/supersession behavior. A future external interop participant should consume those vectors as well.

## Promotion rule

A green differential suite establishes:

```text
one semantic contract
+ two separately implemented local evaluators
+ shared vectors
+ convergent externally observable outcomes
= local differential interoperability evidence
```

It does **not** establish:

```text
independent external implementation
or independent organizational interpretation
or normative consensus
```

S21-05 therefore remains blocked from normative promotion until an external implementation/adaptor reproduces the required vector outcomes, or the project explicitly records a human governance decision changing that evidence requirement.

## Reproduction

```bash
node --test tests/s21-05-differential-interop.test.js
node --test tests/*.test.js
```

## Evidence state

```yaml
section21: S21-05
evidence_class: local-differential-interop
implementation_a: discovery.js
implementation_b: discovery-independent.js
shared_vectors: 6
external_independence: pending
normative_promotion: blocked
```
