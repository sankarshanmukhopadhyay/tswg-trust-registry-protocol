# Candidate TRQP v3 Implementer's Guide

**Status:** informative downstream implementation guidance. Normative protocol behavior is defined by [`../TRQP-V3.md`](../TRQP-V3.md).

This guide is written for an engineering team implementing the downstream v3 candidate for the first time. It explains how to turn the normative requirements into service boundaries, data models, processing stages, failure behavior, tests, and operational evidence without requiring knowledge of the development work packets that produced the candidate.

## 1. What to implement

A minimal candidate-v3 implementation has four logical concerns:

1. **consumer/relying-party behavior** — construct an exact proposition and interpret semantic decisions correctly;
2. **processor behavior** — validate, negotiate, resolve evidence, evaluate, and produce a bounded decision;
3. **binding behavior** — carry the semantic request/response without changing its meaning; and
4. **evidence/authority integration** — resolve authoritative, complete, fresh, temporally applicable evidence for the proposition being evaluated.

The candidate HTTP binding is documented in [`../API.md`](../API.md) and [`../openapi.yaml`](../openapi.yaml). The semantic contract remains transport-neutral.

## 2. Start with the proposition, not the endpoint

The most important implementation decision is to model the proposition explicitly before writing transport code. A useful internal representation is conceptually:

```text
Proposition {
  principal
  authority
  action
  resource
  verification_material?
  evaluation_time?
  critical_context{}
  required_profiles[]
}
```

Your exact language or storage model may differ. The invariant is that every decision-critical dimension remains explicit and immutable for the life of a single evaluation.

Do not derive semantic identity from routing state. An endpoint URI answers “where do I send this?”; it does not answer “which authority is being asked?” or “which principal is being evaluated?”.

## 3. Recommended processing pipeline

A candidate implementation should make the following stages explicit in code and telemetry:

1. **parse** the transport message;
2. **validate** syntax, required members, and internally consistent critical declarations;
3. **resolve the exact proposition** and freeze all decision-critical dimensions;
4. **negotiate** candidate version, required profiles, and support for every critical semantic;
5. **resolve lifecycle state** for principal, relationship, and verification material independently;
6. **acquire evidence** from sources whose authority and scope are known;
7. **classify evidence sufficiency** for authority, completeness, freshness, temporal coverage, provenance, and conflict;
8. **evaluate** the exact proposition without broadening or fallback;
9. **construct the semantic decision** and stable reason;
10. **bind the response** to the evaluated proposition and evaluation time; and
11. **retain bounded audit evidence** sufficient for challenge and re-evaluation.

Internal implementation may combine stages, but the externally observable failure classes must remain distinguishable.

## 4. Validation before evaluation

Reject malformed requests before touching registry evidence. Examples include:

- a critical-context declaration that names no corresponding context member;
- a verification-material qualifier supplied without being declared critical where the active profile requires critical treatment;
- contradictory profile requirements;
- a missing required principal, authority, action, or resource; or
- a malformed evaluation time.

Do not “repair” a request by deleting the condition that caused validation to fail. Doing so can broaden the proposition.

## 5. Negotiation and downgrade resistance

A peer that can parse candidate JSON is not automatically candidate-capable.

Before evaluation, establish:

- candidate processing-contract/version support;
- every required profile and its mandatory semantics; and
- every decision-critical context member.

If any required semantic is unsupported, fail before evaluation. Do not retry the same request as generic v2 and do not remove a qualifier to obtain a result.

A practical implementation should represent negotiation outcome separately from semantic decision outcome, for example:

```text
processing_status = accepted | unsupported | malformed | conflict | unavailable
semantic_decision = positive | negative | indeterminate | not-applicable | <none>
```

When `processing_status` is not `accepted`, there may be no semantic decision at all.

## 6. Evidence model

Do not treat evidence as a list of records without metadata. The processor needs enough information to determine whether the evidence can authoritatively resolve the exact proposition.

At minimum, evidence handling should be able to reason about:

- source identity and authority;
- scope applicability;
- completeness for the relevant scope;
- freshness;
- effective-from/effective-until interval;
- integrity/provenance;
- conflict with other authoritative evidence; and
- disclosure constraints.

An implementation should make evidence-state classification a first-class step rather than an incidental property of the final decision.

### 6.1 Absence is conditional evidence

“No record returned” is not inherently negative. Absence can support an authoritative negative only when the source is authoritative, complete for the evaluated scope, and temporally sufficient.

Timeout, unavailable source, stale cache, incomplete source, or unauthorized mirror → `indeterminate`, not `negative`.

## 7. Lifecycle model

Treat these lifecycle domains independently unless governance explicitly couples them:

- principal lifecycle;
- authorization/recognition relationship lifecycle; and
- verification-material lifecycle.

A principal can remain recognized while an old key is revoked or superseded. A valid key does not itself authorize an action. A relationship can end without invalidating the principal's identity.

Historical evaluation requires effective-dated evidence. Do not answer a historical request by reading current state and projecting it backwards.

## 8. Decision handling

Do not use a boolean as the sole externally meaningful result. Consumers need four semantic classes:

| Decision | Meaning | Consumer behavior |
|---|---|---|
| `positive` | authoritative evidence supports the exact proposition | rely only within the exact evaluated scope |
| `negative` | authoritative complete evidence establishes the proposition is not satisfied | treat as authoritative denial/non-satisfaction for that proposition |
| `indeterminate` | proposition cannot be authoritatively resolved | retry, escalate, seek more evidence, or fail safely according to relying policy |
| `not-applicable` | the applicable rule does not govern this proposition | follow the relying system's rule-selection logic; do not treat as denial |

Transport and processing failures sit outside this semantic axis.

## 9. Stable reasons

Use machine-readable reasons, not human prose parsing. A production implementation should define a stable vocabulary covering at least:

- material mismatch;
- material revoked;
- material expired;
- material superseded;
- unsupported critical context;
- unsupported required profile;
- conflicting profile obligations;
- incomplete evidence;
- stale evidence;
- unavailable evidence;
- non-authoritative evidence;
- conflicting evidence;
- insufficient historical evidence; and
- proposition not applicable.

Human-readable detail may be added for operators but should not be the contract consumed by software.

## 10. Binding and HTTP implementation

Core processing is transport-neutral. An HTTP binding maps semantic messages and processing failures but cannot change proposition scope, evaluation time, critical context, or semantic identity.

For the downstream candidate HTTP realization:

- use [`../API.md`](../API.md) for parameter semantics;
- use [`../openapi.yaml`](../openapi.yaml) for machine-readable interface shape; and
- use RFC 9457 Problem Details for materially revised HTTP processing errors unless a profile explicitly defines another representation.

HTTP `200` means the transport/application request completed sufficiently to return a semantic response; it does not mean `positive`. HTTP `404`, timeout, or `503` does not mean semantic `negative`.

## 11. Discovery and capability metadata

Discovery tells you where a service is and which processing capabilities it claims. Treat capability metadata as security-sensitive configuration.

Before using it to admit candidate processing, validate where applicable:

- publisher authority;
- service/registry identity;
- freshness;
- supported protocol version;
- required profiles;
- supported critical-context semantics; and
- conflicts with other capability documents.

Endpoint movement must not rewrite semantic authority identity. Capability advertisement must not be promoted into authorization.

## 12. Recognition

Implement direct recognition first. Do not traverse a graph and manufacture recognition.

If A recognizes B and B recognizes C, candidate v3 does not infer that A recognizes C. A future propagation mechanism would need explicit authority, path constraints, scope, lifecycle, and interoperability rules.

## 13. Agentic use

Treat the following as potentially distinct values:

- runtime agent identity;
- represented principal/controller;
- authority/registry;
- verification material;
- external delegation evidence;
- requested action;
- requested resource; and
- evaluation time.

TRQP may evaluate a proposition that depends on delegation evidence, but it does not issue or define that delegation instrument.

### 13.1 False-composition trap

The following facts may all be individually true:

- agent identity is valid;
- agent key is valid;
- agent advertises a capability;
- principal is recognized;
- delegation evidence is authentic.

Those facts still do not establish transaction authority unless the exact action/resource/scope/time proposition is supported by authoritative evidence. Build this as a negative test.

### 13.2 Agent replacement

When agent A1 is replaced by A2, new evaluations may use A2, but historical audit evidence for actions performed by A1 remains bound to A1 and the represented principal/delegation evidence applicable at the historical evaluation time.

## 14. Caching

Caches are allowed only if they preserve the decision boundary.

Cache keys should include every dimension that can change the answer, potentially including:

- principal;
- authority;
- action;
- resource;
- verification material;
- evaluation time or time bucket where governance permits;
- required profiles; and
- decision-critical context.

Cache entries should retain enough authority, completeness, freshness, effective-time, and invalidation metadata to prove continued applicability.

A cache hit that drops one of those dimensions is a semantic defect, not a performance optimization.

## 15. Audit and redress

For a decision that may be relied on, retain enough evidence to reconstruct:

- exact proposition;
- processing contract and profiles;
- evaluation time;
- evidence source authority and sufficiency classification;
- relevant lifecycle state;
- decision and reason; and
- supersession/revocation information relevant to later review.

Do not retain unrelated registry data merely because it was available during evaluation. Auditability and privacy minimization must coexist.

## 16. Privacy implementation

Minimize both request context and returned evidence. Consider opaque references or bounded provenance when raw evidence would expose sensitive relationships or stable correlators.

Review specifically for:

- stable identifiers reused across contexts;
- disclosure of protected relationships;
- registry topology leakage through errors;
- excessive historical event disclosure; and
- over-retention in audit logs.

Never achieve minimization by deleting a decision-critical field before evaluation.

## 17. Worked implementation flows

Use [`../examples/README.md`](../examples/README.md) as the human-readable corpus. At minimum, walk through these cases before calling an implementation candidate-v3 compatible:

1. ordinary positive authorization;
2. exact material mismatch while the principal remains valid;
3. unavailable evidence → `indeterminate`;
4. historical evaluation before and after later revocation;
5. agent acting for a principal with external delegation evidence;
6. failed candidate negotiation with no v2 fallback; and
7. recognition chain where transitivity is rejected.

## 18. Conformance and test strategy

Run the complete repository suite:

```bash
npm test
node scripts/validate-v3-readiness.mjs
```

Then inspect:

- [`../conformance/REQUIREMENTS.md`](../conformance/REQUIREMENTS.md) — stable requirement IDs;
- [`../conformance/TRACEABILITY.md`](../conformance/TRACEABILITY.md) — requirement → executable evidence;
- [`../conformance/COVERAGE.md`](../conformance/COVERAGE.md) — coverage accounting; and
- [`../conformance/INTEROPERABILITY.md`](../conformance/INTEROPERABILITY.md) — interoperability claim boundaries.

A green parser is not a conformance claim. Mandatory semantic failure behavior must be demonstrated.

## 19. Recommended code architecture

One practical decomposition is:

```text
transport adapter
      ↓
request validator
      ↓
processing-contract negotiator
      ↓
proposition normalizer/freezer
      ↓
evidence resolver + lifecycle resolver
      ↓
evidence sufficiency classifier
      ↓
semantic evaluator
      ↓
decision/reason builder
      ↓
audit/provenance recorder
      ↓
transport response adapter
```

This is not a required software architecture. It is a useful separation of concerns because it prevents transport, discovery, or parsing success from leaking into semantic decision logic.

## 20. Adoption checklist

Before publishing a candidate-v3 implementation claim, verify that:

- [ ] all decision-critical request dimensions survive end to end;
- [ ] version/profile/critical-context negotiation fails closed;
- [ ] v2 fallback cannot silently process candidate-critical requests;
- [ ] evidence sufficiency is modeled explicitly;
- [ ] authoritative absence is distinguishable from missing evidence;
- [ ] material lifecycle is independent from principal lifecycle;
- [ ] historical evaluation uses effective-dated evidence;
- [ ] semantic decisions are not inferred from HTTP status;
- [ ] recognition is direct-only unless an explicit future propagation rule is implemented;
- [ ] agent capability/identity/delegation components cannot falsely compose into authority;
- [ ] cache keys preserve every decision-critical dimension;
- [ ] audit evidence can reconstruct the exact proposition and evaluation basis;
- [ ] privacy review covers correlation, relationship disclosure, and over-retention;
- [ ] complete tests and RC-readiness validation are green; and
- [ ] the implementation claim names the exact candidate version/profile demonstrated.

## 21. Where to look next

- Normative semantics: [`../TRQP-V3.md`](../TRQP-V3.md)
- HTTP API: [`../API.md`](../API.md)
- OpenAPI: [`../openapi.yaml`](../openapi.yaml)
- Worked flows: [`../examples/`](../examples/)
- Migration: [`MIGRATION-FROM-V2.md`](MIGRATION-FROM-V2.md)
- Agentic guidance: [`AGENTIC-USAGE.md`](AGENTIC-USAGE.md)
- Operations: [`OPERATIONAL-GUIDANCE.md`](OPERATIONAL-GUIDANCE.md)
- Conformance: [`../conformance/`](../conformance/)

If any development-evidence artifact appears to define behavior that is absent from the normative specification, treat that as a specification defect and reconcile it rather than implementing hidden semantics.