# TRQP v3 candidate example corpus

**Status:** informative fixtures for the downstream candidate. These examples do not create adopted upstream syntax.

## Exact candidate authorization request

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

The processor must evaluate the exact principal/agent/action/resource/context proposition. Agent identity or capability alone cannot produce a positive result.

## Material-qualified historical request

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

Current revocation must not be projected backwards. If authoritative historical evidence for the requested time is insufficient, the result is `indeterminate`.

## Evidence-aware semantic response

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

## Authoritative negative vs indeterminate

An authoritative negative requires authoritative, complete and temporally sufficient evidence for the exact proposition. A timeout, unavailable registry, stale cache, unsupported critical context or incomplete source list must not be serialized as authoritative negative merely because no positive record was obtained.

## Downgrade-resistant processing

A request requiring `candidate-material-binding` or another decision-critical profile must not be retried as generic v2 after discovery or negotiation failure. The outcome is an explicit processing/negotiation failure or non-positive semantic state under the candidate contract, never a broadened legacy query.

## Recognition non-transitivity

Evidence that A directly recognizes B and B directly recognizes C does not establish that A recognizes C. The candidate RC defines direct recognition only; positive propagation requires a future explicit authoritative rule.

## Agent replacement

If runtime agent `did:example:agent-a1` is replaced by `did:example:agent-a2`, historical audit evidence for A1 remains bound to A1, the represented principal, exact delegation evidence, action/resource and evaluation time. Runtime replacement does not rewrite historical semantic identity.

## RC validation contract

The release validation pass should parse machine-readable fixtures, validate candidate request/response examples against proposal-grade schemas where applicable, and fail when schema/prose drift would require deletion or reinterpretation of decision-critical fields. Any remaining upstream naming difference must be recorded as an authority boundary rather than hidden by modifying the semantic example.