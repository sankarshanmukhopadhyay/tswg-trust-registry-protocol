# WP7 candidate wire contract

Status: experimental downstream evidence; not proposed upstream text.

Tracker: https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/issues/4

Motivating Ayra reference: https://github.com/ayraforum/ayra-trust-registry-resources/issues/43

Approved v2 versioning rule: https://github.com/trustoverip/tswg-trust-registry-protocol/blob/main/specification/v2-approved/versioning.md

Relevant upstream TRQP issues will be added using full URLs when available.

## Experiment A — optional verification material under v2

Candidate request:

```json
{
  "entity_id": "did:example:issuer-a",
  "authority_id": "did:example:authority",
  "action": "issue",
  "resource": "credential-type-x",
  "context": {
    "verification_material": "urn:sha256:c2"
  }
}
```

Result: **unsafe**. An approved-v2 endpoint that does not understand `verification_material` is required to ignore it and may return a positive principal-level authorization. This answers a broader proposition than the requester supplied.

## Experiment B — required profile only

Candidate addition:

```json
{
  "required_profiles": ["verification-material-v1"]
}
```

Result: **insufficient by itself**. Capability naming is useful for discovery/negotiation, but unless the profile contract mechanically binds the decision-critical members that must be processed, an implementation can claim profile support while still dropping a qualifier.

A profile therefore needs an explicit processing contract, not merely an identifier.

## Experiment C — critical context members

Candidate request:

```json
{
  "entity_id": "did:example:issuer-a",
  "authority_id": "did:example:authority",
  "action": "issue",
  "resource": "credential-type-x",
  "context": {
    "verification_material": "urn:sha256:c2",
    "time": "2026-06-01T00:00:00Z"
  },
  "critical_context": ["verification_material"]
}
```

Candidate processing rule:

> If a request declares a context member critical, an endpoint MUST process that member according to its defined semantics or return an indeterminate/unsupported-critical-condition result. It MUST NOT evaluate the query after silently removing the member.

Result: **safe against the tested downgrade**, provided both peers understand the critical-members mechanism itself.

## The bootstrap problem

The critical-members mechanism cannot safely be introduced as an ordinary optional v2 field. A legacy v2 implementation is entitled to ignore an unknown optional field. It can therefore ignore both `critical_context` and `verification_material`, recreating the false positive.

This creates a protocol bootstrap requirement: support for critical semantics must itself be established before a qualified request is sent or accepted as authoritative.

## Candidate processing model

A future TRQP processing contract should separate:

1. **protocol capability** — does the endpoint understand critical semantics/profile negotiation?
2. **query semantics** — which conditions form the proposition?
3. **evidence capability** — can the endpoint establish those conditions from authoritative, sufficiently complete and temporally applicable evidence?
4. **decision state** — positive, authoritative-negative, or indeterminate.

Suggested conceptual request:

```json
{
  "trqp_version": "3.0",
  "entity_id": "did:example:issuer-a",
  "authority_id": "did:example:authority",
  "action": "issue",
  "resource": "credential-type-x",
  "context": {
    "verification_material": "urn:sha256:c2",
    "time": "2026-06-01T00:00:00Z"
  },
  "critical_context": ["verification_material", "time"]
}
```

This is illustrative, not yet a schema commitment.

## Candidate response direction

Do not overload `authorized: false` to mean every non-positive condition. A future response needs to preserve at least:

```json
{
  "authorized": false,
  "decision": "indeterminate",
  "reason": "historical-evidence-incomplete",
  "time_evaluated": "2026-06-01T00:00:00Z",
  "evidence": []
}
```

The existing boolean can remain for compatibility/readability only when its interpretation is constrained by the decision class. An indeterminate response is not an authoritative denial.

## Compatibility matrix

| Mechanism | Legacy v2 behavior | Safe? | Version implication |
| --- | --- | --- | --- |
| Optional `context.verification_material` | silently ignored | No | cannot be decision-critical in a v2 minor version |
| Optional `critical_context` | itself silently ignored | No | cannot bootstrap safety in a v2 minor version |
| Profile identifier only | may not bind actual processing | No | insufficient |
| Pre-negotiated profile with mandatory qualifier processing | legacy peer must be excluded before query | Conditionally | possible deployment profile, but not transparent v2 compatibility |
| Protocol-level critical semantics | unsupported critical member fails closed | Yes | changes v2 processing semantics |
| Three-state evidence decision | prevents false equivalence of negative and unknown | Yes | likely new processing contract |

## Recommendation after first falsification tranche

The working recommendation is now **TRQP 3.0 candidate semantics**, not TRQP 2.1, for the decision-critical changes developed in WP1–WP7.

A tightly controlled v2 profile may still be useful as a transition/interoperability experiment, but it must require out-of-band or pre-query capability establishment and MUST NOT claim transparent compatibility with generic v2 endpoints.

The reason for the major-version recommendation is precise: approved v2 requires unknown optional context to be ignored, while the new assurance model requires unsupported decision-critical context to fail closed. Those processing rules are contradictory for the same request.

This recommendation remains downstream and provisional until the remaining response/evidence schema tests, conformance cases, and upstream issue reconciliation are complete.
