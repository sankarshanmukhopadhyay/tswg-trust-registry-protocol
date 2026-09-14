# TRQP v3 Candidate Example Corpus

These examples are informative wire-shaped fixtures for implementation and schema reconciliation. They do not create upstream normative syntax.

## Valid positive authorization

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
    "delegation_evidence": "urn:evidence:delegation:1",
    "time": "2026-09-14T00:00:00Z"
  }
}
```

A conforming evaluation must not infer authorization merely because the agent is identifiable or capable; the exact proposition and evidence must support the result.

## Historical material-qualified request

```json
{
  "trqp_version": "3.0-candidate",
  "entity_id": "did:example:provider",
  "authority_id": "did:example:authority",
  "action": "provide-service",
  "resource": "urn:service:regulated",
  "critical_context": ["verification_material"],
  "context": {
    "time": "2026-06-01T12:00:00Z",
    "verification_material": "urn:key:provider:2026-01"
  }
}
```

Current revocation must not be projected backwards. If historical evidence is insufficient, the result is indeterminate rather than an invented historical positive/negative.

## Semantic response shape

```json
{
  "decision": "positive",
  "reason": "evidence-supports-proposition",
  "authorized": true,
  "recognized": false,
  "time_evaluated": "2026-09-14T00:00:00Z",
  "evidence_state": "sufficient",
  "evidence": [
    {
      "source_id": "urn:registry:evidence:42",
      "authoritative": true,
      "complete_for_scope": true
    }
  ]
}
```

## Adversarial downgrade example

A candidate request that requires `candidate-material-binding` MUST NOT be silently retried as generic v2 or a weaker profile when discovery/negotiation cannot satisfy the required profile. The correct outcome is admission/processing failure or indeterminate/non-positive semantics according to the candidate contract, not a broadened query.

## Agent replacement example

If runtime agent `did:example:agent-a1` is replaced by `did:example:agent-a2`, historical audit evidence for actions by A1 remains bound to A1, its principal, exact delegation evidence, action/resource and evaluation time. Endpoint or runtime replacement does not rewrite historical semantic identity.

## Validation contract

RC validation should parse all JSON blocks/fixtures, validate request/response examples against candidate schemas where schemas cover the candidate fields, and fail when prose/schema drift makes an example invalid. Where candidate semantics intentionally exceed the current upstream v2 schema vocabulary, that gap must be recorded rather than silently deleting candidate fields.