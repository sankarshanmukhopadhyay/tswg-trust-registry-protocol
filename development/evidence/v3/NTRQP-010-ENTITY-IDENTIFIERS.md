# NTRQP-010 entity identifier semantics — executable research disposition

Status: **downstream experimental / tested locally / not candidate text**

Parent issue: #68  
Implementation tranche: #75

## Research judgment

Repository-local evidence supports a bounded hypothesis:

> TRQP can remain identifier-scheme-neutral only if the active identifier profile makes class, scope, comparison/equivalence, subject binding, lifecycle, resolution dependency, and correlation characteristics explicit.

The evidence does not justify a universal identifier syntax, implicit normalization algorithm, or candidate normative wire change.

## Minimum explicit contract

An identifier profile used to interpret `entity_id` needs, at minimum:

1. identifier class;
2. scope kind and scope identifier where non-global;
3. comparison mode;
4. resolution requirement;
5. subject-binding method;
6. lifecycle/effective-time rules;
7. correlation/publication property.

Repository-local executable evidence deliberately supports only two comparison modes:

- `exact` — lexical equality only;
- `explicit-equivalence` — alternate lexical values are equivalent only when authoritative binding evidence explicitly records the alias.

There is no implicit URI/DID normalization in the research model. Missing normalization/equivalence rules therefore cannot create implementation-specific positives.

## Identifier classes exercised

### Public URI / DID-like identifier

- global scope;
- exact comparison;
- resolution optional;
- registry-owned subject binding;
- publication is explicitly treated as potentially globally correlatable.

### Authority-local opaque identifier

- authority scope;
- explicit-equivalence comparison only;
- no resolver required;
- explicit authority-owned mapping;
- reuse outside the authority scope cannot establish the same proposition.

These classes are intentionally materially different.

## Binding and authority boundary

A syntactically valid or resolvable identifier is not identity proof, recognition, or authorization.

```text
identifier syntax
    ↓
profile + scope
    ↓
binding evidence
    ↓
lifecycle/evaluation time
    ↓
identifier-binding outcome
```

Only after identifier binding is resolved may a separate TRQP evaluator consider recognition or authorization evidence. Credential possession likewise has no binding force unless the active profile explicitly uses credential evidence and the binding evidence is verified.

## Lifecycle and historical semantics

Bindings are effective-dated independently from current identifier state. Rotation, revocation, expiry and supersession can prevent current use without rewriting a historical evaluation performed while the binding was applicable.

Migration between identifier schemes does not create equivalence by implication. Migration requires explicit mapping/equivalence evidence under the relevant profile.

## Failure semantics

The research model uses typed non-positive outcomes:

- unsupported profile/class → `indeterminate`;
- profile or scope mismatch → `indeterminate`;
- resolver/lookup unavailable → `indeterminate`;
- conflicting authoritative binding → `indeterminate`;
- insufficient binding evidence → `indeterminate`;
- inactive authoritative binding → `negative`;
- authoritative complete absence → `negative`.

Lookup or resolver failure is never authoritative negative.

## Correlation and publication boundary

Correlation is not derivable from identifier syntax alone. High-risk cases include global identifiers intentionally reused publicly and scoped identifiers published beyond their intended scope. The research model classifies those risks but does not prescribe a universal privacy mechanism.

## Ownership disposition

| Concern | Owner |
|---|---|
| Exact `entity_id` participates in proposition identity | TRQP core |
| Identifier class/scope/comparison/binding contract | profile |
| Namespace allocation and registry completeness | authority/registry schema |
| CAWG publication choices | CAWG/integration guidance |
| Endpoint discovery | NTRQP-007 / #25 |
| Recognition propagation | NTRQP-009 / #27 |
| General profile composition | NTRQP-008 / #26 |

A profile may constrain identifier semantics but must not silently change proposition identity.

## Local evidence

- `development/verification-material/entity-identifiers.js`
- `development/verification-material/entity-identifiers-independent.js`
- `development/verification-material/fixtures/entity-identifier-profiles.json`
- `tests/entity-identifiers.test.js`

The second implementation is structurally separate but repository-local. It is local differential evidence, not independent organizational interoperability.

## Promotion judgment

NTRQP-010 may advance from `identified / research` to **`tested / bounded-research`** after the local suite passes.

It must not advance to `candidate-text` until #68 obtains independent interoperability evidence from an implementation controlled outside this repository/author context and any warranted privacy/assurance review is complete.

## Residual risks

- external implementations may choose different canonicalization/equivalence rules;
- authority-local identifiers can be accidentally published as global correlators;
- authority claims of completeness may be operationally wrong or stale;
- resolver semantics can be confused with subject-binding semantics;
- identifier migration may be represented inconsistently across ecosystems;
- privacy properties depend on publication context as well as identifier form;
- CAWG or another consumer may impose integration constraints not represented by this downstream model.

```yaml
candidate:
  id: NTRQP-010
  state: tested-bounded-research
  candidate_text: false
  independent_interop: pending
  privacy_review: pending-if-promoted
  authority_impact: none
```
