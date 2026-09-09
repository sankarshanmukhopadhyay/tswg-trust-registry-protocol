# WP7 — Candidate wire semantics and TRQP v2 compatibility boundary

Status: **baseline established; wire experiments next**

Tracker:
https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/issues/4

External motivating reference:
https://github.com/ayraforum/ayra-trust-registry-resources/issues/43

Upstream approved TRQP v2 API:
https://github.com/trustoverip/tswg-trust-registry-protocol/blob/main/specification/v2-approved/core/api.md

Upstream approved TRQP v2 versioning/extensibility rules:
https://github.com/trustoverip/tswg-trust-registry-protocol/blob/main/specification/v2-approved/versioning.md

Relevant upstream TRQP issues will be added using full URLs when available and reconciled before downstream candidate text is treated as stable.

## Finding 1 — TRQP v2 already carries a temporal query condition

The approved v2 authorization and recognition examples place `time` inside `context`, and responses carry `time_requested` and `time_evaluated`.

This means WP6 historical evaluation does **not necessarily require a new request field**. The protocol already has a syntactic location for requested evaluation time.

However, WP6 demonstrates that historical correctness depends on the evidence model behind that field. A server cannot satisfy a historical query merely by accepting `context.time`; it must possess authoritative evidence applicable to that time or return an indeterminate outcome.

## Finding 2 — the current extensibility rule is unsafe for decision-critical qualifiers

Approved TRQP v2 says that:

1. `context` is the primary extensibility mechanism;
2. profiles/bindings may define additional context members;
3. an endpoint receiving an unrecognized context member **MUST ignore it and process the query using supported members**;
4. implementations within a major version must accept minor-version queries while ignoring unrecognized optional fields.

That processing rule is safe only for conditions whose omission cannot change the proposition being evaluated.

WP2/WP3 show that `verification_material` is not such a condition. If a consumer asks:

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

and a v2 endpoint ignores `verification_material`, it may answer whether the principal is authorized generally rather than whether **that principal using C2** is authorized. A positive response is therefore a false positive for the proposition actually asked.

## Compatibility classification

| Candidate semantic | Initial classification | Rationale |
| --- | --- | --- |
| `context.time` syntax | v2-compatible | Already represented by approved v2. |
| Historical evidence sufficiency | breaking-processing-semantics unless negotiated | Existing syntax does not guarantee historical evidence capability. |
| Verification-material qualifier | breaking-processing-semantics | v2 requires unknown context members to be ignored. |
| Evidence/provenance response metadata | potentially v2-compatible-informative | Optional response metadata can be additive if it does not redefine `authorized`/`recognized`. |
| Positive / authoritative-negative / indeterminate distinction | likely new-version/profile processing contract | Existing booleans cannot safely encode indeterminate without an explicit contract. |
| Unsupported-critical-condition outcome | new processing requirement | v2 currently mandates ignore-and-process. |
| Source authority/completeness/freshness diagnostics | potentially v2-compatible-informative | Can be additive, but relying-party semantics may make them decision-critical. |

## Emerging versioning conclusion

The central compatibility problem is not JSON shape. It is **processing semantics**.

Adding `verification_material` as an optional `context` member is syntactically permitted by v2 but semantically unsafe because conforming v2 endpoints are required to ignore an unknown member. Therefore a minor-version addition cannot safely make that member decision-critical under the existing rules.

At least one of the following is required:

1. a new major version that changes unknown-critical-condition processing;
2. an explicitly negotiated profile/capability whose successful negotiation changes the processing contract and forbids silent fallback;
3. a generic critical-members mechanism understood by both peers, where unsupported critical members cause a non-success/indeterminate outcome rather than being ignored.

WP7 will implement and falsify options 2 and 3 before recommending whether a major version is unavoidable.

## Candidate safety invariant

> An implementation MUST NOT return a definitive success for a proposition after silently dropping a query condition that the requester declared decision-critical.

## Next experiments

- model a candidate `critical` declaration for context members;
- model capability/profile negotiation;
- simulate a conforming v2 endpoint that ignores unknown context;
- prove downgrade/fallback false positives;
- determine whether a negotiated v2 profile can fail closed without contradicting v2 conformance;
- design response evidence that preserves existing booleans only where the decision is definitive.
