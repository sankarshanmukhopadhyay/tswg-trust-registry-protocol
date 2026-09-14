# TRQP v3 Candidate API Reference

> **Status:** downstream candidate HTTP-binding documentation. Core TRQP v3 semantics are transport-neutral; this document describes the candidate HTTP-facing developer contract without claiming upstream adoption.

## 1. Processing model

A client submits a bounded trust-registry proposition. The server validates the requested candidate processing contract, evaluates the exact proposition against authoritative evidence, and returns either a semantic decision or a processing/transport failure. Transport success is never itself a positive trust decision.

The candidate semantic request is represented below as `POST /trqp/v3/query`. The path is a downstream documentation convention for the candidate HTTP binding, not an adopted upstream endpoint identifier.

## 2. Query operation

### `POST /trqp/v3/query`

Evaluates one exact proposition.

**Content-Type:** `application/json`

### Request parameters

| Parameter | Type | Required | Meaning | Constraints / governance |
|---|---|---:|---|---|
| `trqp_version` | string | yes | Processing contract requested by the client. | Candidate value is `3.0-candidate`. Acceptance does not by itself prove semantic support; negotiation obligations still apply. |
| `entity_id` | string | yes | Semantic principal/entity whose registry proposition is being evaluated. | MUST NOT be inferred to mean endpoint identity, runtime agent identity, controller, or verification material unless the applicable proposition explicitly makes them identical. |
| `authority_id` | string | yes | Authority/registry scope against which the proposition is evaluated. | Routing/discovery metadata MUST NOT substitute for authority identity. |
| `action` | string | yes | Bounded action relevant to the proposition. | Changing action changes the proposition and requires re-evaluation. |
| `resource` | string | yes | Bounded resource/object relevant to the proposition. | Changing resource changes the proposition and requires re-evaluation. |
| `context` | object | conditional | Additional decision-relevant values. | Members declared in `critical_context` become mandatory processing semantics. Unknown non-critical members may be handled by the negotiated profile/binding. |
| `context.time` | RFC 3339 date-time | no | Time supplied as contextual input. | Do not confuse with the candidate evaluation-time contract when an implementation exposes that separately. |
| `context.verification_material` | string | conditional | Exact key/certificate/material qualifier for material-bound evaluation. | Required when `verification_material` is critical. A mismatch MUST NOT fall back to principal-only positive. |
| `critical_context` | array[string] | no | Names of context members whose semantics cannot be ignored. | Unsupported critical semantics fail closed; they MUST NOT be dropped to obtain an answer. |
| `required_profiles` | array[string] | no | Profiles whose mandatory semantics are required for this evaluation. | Profile label alone is insufficient; required semantics must be established before evaluation. |

### Request example

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
  "required_profiles": ["candidate-delegated-authority"]
}
```

The exact agent/principal/delegation/action/resource proposition is evaluated. Agent identity or capability alone cannot manufacture authorization.

## 3. Response contract

A semantic response communicates the outcome of evaluating the proposition. Clients MUST inspect the semantic decision rather than infer it from HTTP success.

### Core response parameters

| Parameter | Type | Meaning | Governance |
|---|---|---|---|
| `decision` | enum | `positive`, `negative`, `indeterminate`, or `not-applicable`. | These values are semantically distinct and MUST NOT be collapsed into a boolean. |
| `reason` | string | Machine-actionable reason for the decision. | Clients SHOULD branch on stable machine-readable reasons, not human text. |
| `authorized` | boolean/null | Authorization result where the evaluated proposition includes authorization. | MUST NOT replace `decision`; absence/false does not by itself explain evidence sufficiency. |
| `recognized` | boolean/null | Direct recognition result where applicable. | Direct only; graph reachability MUST NOT manufacture recognition. |
| `evaluation_time` | date-time | Time at which the proposition was evaluated. | Historical evaluation must use evidence applicable to the requested/evaluated time. |
| `evidence_state` | enum | Sufficiency/quality state of decision evidence. | Candidate vocabulary: `sufficient`, `incomplete`, `stale`, `unavailable`, `non-authoritative`, `conflicting`, `unknown`. |
| `evidence` | array | Bounded evidence/provenance supporting interpretation/audit. | Disclosure SHOULD be minimized; authority, completeness, effective time and provenance must be sufficient for the applicable claim. |

### Positive example

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

## 4. Decision semantics

| Decision | Meaning | Typical condition |
|---|---|---|
| `positive` | Sufficient authoritative evidence supports the exact proposition. | Exact principal/material/scope/time conditions are satisfied. |
| `negative` | Sufficient authoritative evidence establishes that the exact proposition is not satisfied. | Authoritative complete evidence establishes revocation, mismatch or qualifying absence. |
| `indeterminate` | The proposition cannot be authoritatively resolved. | Evidence is incomplete, stale, unavailable, conflicting, non-authoritative, or historical coverage is insufficient. |
| `not-applicable` | The proposition does not apply under the evaluated scope/rule. | Applicable governance explicitly places the request outside the rule's domain. |

## 5. Processing failures and HTTP

A processing failure is not a semantic negative. Where HTTP is used, materially revised errors SHOULD use RFC 9457 Problem Details.

Recommended candidate mapping:

| HTTP | Situation | Semantic interpretation |
|---:|---|---|
| `200` | Semantic evaluation completed. | Inspect `decision`; 200 does not imply positive. |
| `400` | Malformed or contradictory request. | Processing failure; no semantic negative. |
| `406` | Required candidate version/profile/critical semantics cannot be negotiated. | Processing failure; MUST NOT silently retry as generic v2. |
| `409` | Mandatory profile/processing obligations conflict. | Processing failure/fail closed. |
| `422` | Request is syntactically valid but cannot be evaluated under declared critical semantics. | Processing failure or indeterminate according to binding/profile contract; never silently broaden. |
| `503` | Required authoritative evidence/service unavailable. | Transport/processing failure; MUST NOT become authoritative negative. |

Problem Details should expose a stable `type`, `title`, `status`, and bounded machine-readable extensions such as unsupported critical members or profiles. Human-readable `detail` is not a protocol decision field.

## 6. Negotiation

Before candidate evaluation, peers must establish support for:

1. the candidate processing contract/version;
2. every required profile and its mandatory semantics;
3. every decision-critical context member.

A peer that merely parses the JSON is not candidate-capable. If negotiation is absent, stale, ambiguous or fails, the client/server MUST NOT remove qualifiers or retry the request as generic v2.

## 7. Discovery and capabilities

Discovery answers **where and how to contact a capable endpoint**; it does not establish authorization, recognition or registry membership.

A candidate capability document should identify at least:

- service/registry identity;
- endpoint location(s);
- supported protocol versions;
- supported profiles;
- supported decision-critical context;
- mandatory processing semantics sufficient to validate negotiation;
- authority/freshness information for the capability assertion.

The repository includes an experimental `.well-known` discovery binding as executable evidence. Core candidate semantics do not require a single production discovery transport.

## 8. Agentic parameter interpretation

For agentic use, keep these identities separate:

| Concept | API representation | Must not be inferred from |
|---|---|---|
| runtime agent | usually `entity_id` only when the agent itself is the semantic subject | endpoint URI or capability advertisement |
| represented principal | decision-critical `context` member/profile-defined field | runtime agent identity |
| authority/registry | `authority_id` | service endpoint |
| verification material | `context.verification_material` when material-qualified | principal identity |
| delegation evidence | decision-critical `context` member/profile-defined field | capability advertisement |
| action | `action` | delegation existence alone |
| resource | `resource` | action alone |

Changing any decision-critical delegation scope, action, resource, time, material or relationship state changes the proposition and requires re-evaluation.

## 9. Schema and conformance references

The executable candidate schemas currently live under `development/verification-material/schemas/`. Stable public aliases are provided under `specification/v3/schemas/` for developer discovery. Normative semantics remain governed by the candidate specification; schema acceptance must never be used to erase decision-critical semantics.

See also:

- [`README.md`](README.md) — v3 public specification entry point
- [`../../development/next-draft/CANDIDATE-TRQP-V3.md`](../../development/next-draft/CANDIDATE-TRQP-V3.md) — complete normative text
- [`../../development/next-draft/IMPLEMENTERS-GUIDE.md`](../../development/next-draft/IMPLEMENTERS-GUIDE.md) — implementation pipeline
- [`../../development/next-draft/CONFORMANCE-AND-INTEROP-GUIDE.md`](../../development/next-draft/CONFORMANCE-AND-INTEROP-GUIDE.md) — conformance/interoperability
- [`../../development/next-draft/AGENTIC-USAGE-GUIDE.md`](../../development/next-draft/AGENTIC-USAGE-GUIDE.md) — agentic stress model
