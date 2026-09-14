# TRQP v3 candidate example corpus

**Status:** informative worked examples for the downstream candidate. These examples explain the normative behavior in [`../TRQP-V3.md`](../TRQP-V3.md); they do not create adopted upstream syntax.

The examples are deliberately written as **request → evaluation → outcome** flows. The goal is to show an implementer where the decision boundary sits and why apparently similar situations produce different semantic results.

## 1. Ordinary positive authorization

### Request

```json
{
  "trqp_version": "3.0-candidate",
  "entity_id": "did:example:provider",
  "authority_id": "did:example:registry",
  "action": "provide-service",
  "resource": "urn:service:regulated",
  "required_profiles": ["candidate-core"]
}
```

### Evaluation

The processor establishes that the requested candidate contract and profile are supported, resolves the exact principal/authority/action/resource proposition, and obtains authoritative, complete, fresh evidence for the relevant registry scope.

### Response

```json
{
  "decision": "positive",
  "reason": "evidence-supports-proposition",
  "authorized": true,
  "recognized": false,
  "evaluation_time": "2026-09-14T00:00:00Z",
  "evidence_state": "sufficient",
  "evidence": [
    {
      "source_id": "urn:registry:evidence:42",
      "authoritative": true,
      "complete_for_scope": true,
      "effective_from": "2026-09-01T00:00:00Z"
    }
  ]
}
```

The relying party may rely only on the exact proposition evaluated. This result does not imply authorization for another action, resource, authority, or future time.

## 2. Verification-material mismatch without principal revocation

### Request

```json
{
  "trqp_version": "3.0-candidate",
  "entity_id": "did:example:provider",
  "authority_id": "did:example:registry",
  "action": "provide-service",
  "resource": "urn:service:regulated",
  "critical_context": ["verification_material"],
  "context": {
    "verification_material": "urn:key:provider:old"
  },
  "required_profiles": ["candidate-material-binding"]
}
```

### Evaluation

The principal remains recognized and authorized for the service, but the exact key in the proposition has been superseded. The processor must not drop `verification_material` and fall back to the broader principal-only proposition.

### Outcome

```json
{
  "decision": "negative",
  "reason": "verification-material-superseded",
  "authorized": false,
  "evaluation_time": "2026-09-14T00:00:00Z",
  "evidence_state": "sufficient"
}
```

The negative result is material-dependent. It does **not** mean the principal itself is revoked.

## 3. Evidence unavailable: indeterminate, not negative

The relying party asks the same ordinary authorization question as Example 1, but the authoritative registry is unavailable and no fresh authoritative cache exists.

### Evaluation

The processor has insufficient evidence to establish either support or authoritative absence. “No record obtained” is not equivalent to “the proposition is false.”

### Outcome

```json
{
  "decision": "indeterminate",
  "reason": "evidence-unavailable",
  "authorized": null,
  "evaluation_time": "2026-09-14T00:00:00Z",
  "evidence_state": "unavailable"
}
```

A relying workflow may retry, escalate, or fail safely according to its own policy. It must not rewrite this result as an authoritative denial unless another authoritative and complete source establishes the proposition as false.

## 4. Authoritative absence: negative

Suppose the same authority exposes a complete authoritative registry for the evaluated scope and time, and that registry establishes that the principal has no applicable authorization.

The evidence is authoritative, complete, and fresh. Absence therefore has semantic meaning.

```json
{
  "decision": "negative",
  "reason": "authoritative-absence",
  "authorized": false,
  "evaluation_time": "2026-09-14T00:00:00Z",
  "evidence_state": "sufficient"
}
```

Compare this with Example 3: both may involve “no positive record,” but only this case has evidence sufficient for an authoritative negative.

## 5. Material-qualified historical request

### Request

```json
{
  "trqp_version": "3.0-candidate",
  "entity_id": "did:example:provider",
  "authority_id": "did:example:authority",
  "action": "provide-service",
  "resource": "urn:service:regulated",
  "critical_context": ["verification_material"],
  "context": {
    "verification_material": "urn:key:provider:2026-01"
  },
  "evaluation_time": "2026-06-01T12:00:00Z",
  "required_profiles": ["candidate-material-binding"]
}
```

Assume the material was valid on 1 June and revoked on 1 August.

### Evaluation

The processor must evaluate the state applicable on 1 June. Current revocation must not be projected backwards.

### Historical outcome

```json
{
  "decision": "positive",
  "reason": "historical-evidence-supports-proposition",
  "authorized": true,
  "evaluation_time": "2026-06-01T12:00:00Z",
  "evidence_state": "sufficient"
}
```

A current query for the same exact material after 1 August can legitimately return `negative` because the propositions differ by evaluation time.

If authoritative historical evidence for 1 June were unavailable or incomplete, the correct historical result would instead be `indeterminate`.

## 6. Unsupported critical context

### Request

```json
{
  "trqp_version": "3.0-candidate",
  "entity_id": "did:example:provider",
  "authority_id": "did:example:registry",
  "action": "provide-service",
  "resource": "urn:service:regulated",
  "critical_context": ["verification_material", "jurisdiction_constraint"],
  "context": {
    "verification_material": "urn:key:provider:current",
    "jurisdiction_constraint": "IN-WB"
  }
}
```

Assume the endpoint understands material binding but does not implement `jurisdiction_constraint` semantics.

The endpoint must not delete the unsupported member and evaluate a broader proposition. Candidate processing fails closed before an authoritative positive can be produced.

This may be represented as an explicit processing failure, such as an RFC 9457 Problem Details response under the HTTP binding, or as the applicable non-positive state defined by the negotiated profile. It is never a broadened success.

## 7. Failed candidate negotiation: no v2 retry

A client discovers an endpoint that supports v2 only. The client has a request whose `verification_material` is decision-critical.

Unsafe behavior:

```text
candidate request
   ↓ unsupported
remove verification_material
   ↓
retry as v2
   ↓
positive
```

That positive answers a different proposition.

Safe behavior:

```text
candidate request
   ↓ unsupported candidate semantics
explicit processing/negotiation failure
   ↓
no semantic candidate decision
```

If the relying application has an independent policy permitting a separate v2 query, that query is a separate proposition and must not be represented as equivalent to the failed candidate request.

## 8. Recognition is direct, not transitive

Evidence:

```text
A directly recognizes B
B directly recognizes C
```

Candidate v3 does not infer:

```text
A recognizes C
```

Graph reachability is not recognition authority. A future propagation profile would need an explicit rule defining authority, path constraints, scope, lifecycle, and failure semantics.

## 9. Agent acting for a principal

### Request

```json
{
  "trqp_version": "3.0-candidate",
  "entity_id": "did:example:agent-a",
  "authority_id": "did:example:registry",
  "action": "purchase",
  "resource": "urn:merchant:item:123",
  "critical_context": ["principal_id", "delegation_evidence"],
  "context": {
    "principal_id": "did:example:consumer",
    "delegation_evidence": "urn:evidence:delegation:1"
  },
  "evaluation_time": "2026-09-14T00:00:00Z",
  "required_profiles": ["candidate-delegated-authority"]
}
```

### Evaluation

The processor keeps separate:

- runtime agent `did:example:agent-a`;
- represented principal `did:example:consumer`;
- external delegation evidence;
- requested action `purchase`;
- resource `urn:merchant:item:123`;
- authority `did:example:registry`; and
- evaluation time.

A valid agent identity and authentic delegation artifact do not by themselves establish the transaction proposition. The delegation must apply to the exact principal/agent/action/resource/time scope required by the active profile.

### Positive case

If the evidence supports the exact proposition:

```json
{
  "decision": "positive",
  "reason": "delegated-authority-supported",
  "authorized": true,
  "evaluation_time": "2026-09-14T00:00:00Z",
  "evidence_state": "sufficient"
}
```

### Wrong-resource case

If the delegation permits `urn:merchant:item:456` but the request asks for `...:123`, the result must not be positive. Component validity cannot manufacture a broader authority.

## 10. Delegation revoked after an earlier transaction

At T1, agent A acts for principal P under valid delegation D and receives a positive result. At T2, D is revoked.

A current query after T2 should reflect revocation. A historical audit of T1 must still preserve that D was valid at T1 if authoritative effective-dated evidence establishes that fact.

This is the agentic equivalent of verification-material historical evaluation: current revocation does not rewrite historical truth, but stale historical evidence cannot manufacture current authority.

## 11. Agent replacement

Runtime agent `did:example:agent-a1` is replaced by `did:example:agent-a2`.

New evaluations may use A2. Historical audit evidence for actions performed by A1 remains bound to A1, the represented principal, the exact delegation evidence, action/resource, and evaluation time. Runtime replacement does not rewrite historical semantic identity.

## 12. Not applicable

Suppose a registry rule covers licensed health-service providers but the request concerns an unrelated product category. If the applicable governance rule establishes that the proposition is outside its scope, the processor may return:

```json
{
  "decision": "not-applicable",
  "reason": "rule-not-applicable",
  "authorized": null,
  "evaluation_time": "2026-09-14T00:00:00Z",
  "evidence_state": "sufficient"
}
```

This is neither a denial nor evidence insufficiency.

## 13. Processing failure is not semantic negative

Under the candidate HTTP binding, a malformed request may return a `400` Problem Details response; unsupported required semantics may return `406`; required service unavailability may return `503`.

Those HTTP responses communicate processing or transport state. They must not be stored or propagated as if the registry had authoritatively answered `negative`.

## 14. Evidence-aware semantic response

A typical positive response may include bounded provenance:

```json
{
  "decision": "positive",
  "reason": "evidence-supports-proposition",
  "authorized": true,
  "recognized": false,
  "evaluation_time": "2026-09-14T00:00:00Z",
  "evidence_state": "sufficient",
  "evidence": [
    {
      "source_id": "urn:registry:evidence:42",
      "authoritative": true,
      "complete_for_scope": true,
      "effective_from": "2026-09-01T00:00:00Z"
    }
  ]
}
```

`sufficient` evidence does not itself imply `positive`; it means the evidence set is sufficient to resolve the bounded proposition.

## 15. Implementation checklist for examples

For each example above, an implementation should be able to identify:

1. the exact proposition;
2. which members are decision-critical;
3. the negotiated processing contract;
4. the evidence authority/completeness/freshness judgment;
5. relevant lifecycle state;
6. whether evaluation occurred or failed before evaluation;
7. semantic decision and stable reason, if any; and
8. audit evidence sufficient to reconstruct the result.

## 16. RC validation contract

The release validation pass should parse machine-readable fixtures, validate candidate request/response examples against proposal-grade schemas where applicable, and fail when schema/prose drift would require deletion or reinterpretation of decision-critical fields. Any remaining upstream naming difference must be recorded as an authority boundary rather than hidden by modifying the semantic example.

See also:

- [`../TRQP-V3.md`](../TRQP-V3.md) — normative semantics;
- [`../API.md`](../API.md) — parameter-level API reference;
- [`../guides/IMPLEMENTERS-GUIDE.md`](../guides/IMPLEMENTERS-GUIDE.md) — implementation sequence; and
- [`../conformance/`](../conformance/) — stable requirement IDs and executable-evidence mapping.