# WP7 — Candidate wire semantics and TRQP v2 compatibility boundary

Status: **repository-local falsification complete; candidate semantics remain experimental**

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

Approved TRQP v2 requires an endpoint receiving an unrecognized context member to ignore it and process the query using supported members. That is safe only when omission cannot change the proposition being evaluated.

WP2/WP3 show that `verification_material` is decision-critical. If a v2 endpoint ignores it, the endpoint can answer whether the principal is authorized generally rather than whether the principal using the specified material is authorized. The positive response is then a false positive for the proposition actually asked.

## Finding 3 — a profile identifier is not a processing contract

WP7 now falsifies a profile-name-only approach. Advertising `verification-material-v1` is insufficient unless the endpoint also binds that profile to mandatory context processing. The reference experiment therefore treats a required profile without an explicit processing contract as `indeterminate` with reason `profile-contract-unsatisfied`.

A pre-negotiated profile is viable only when all of the following are established before authoritative query processing:

1. the endpoint supports the named profile;
2. the profile contract identifies its mandatory context members;
3. the endpoint supports every mandatory context member supplied by the request;
4. generic legacy peers are excluded from the qualified exchange;
5. failure of any capability condition returns indeterminate rather than silently broadening the proposition.

This can be useful as a transitional deployment profile, but it is not transparent compatibility with generic TRQP v2.

## Finding 4 — response reasons are decision-class constrained

The candidate response vocabulary distinguishes three decision classes and prevents reasons from drifting between them.

- `positive`: `evidence-supports-proposition`.
- `authoritative-negative`: `not-listed`, `not-applicable`, `revoked`, `expired`, `superseded`, `wrong-purpose`, `wrong-resource`, `material-mismatch`.
- `indeterminate`: `evidence-incomplete`, `evidence-stale`, `evidence-unavailable`, `historical-evidence-incomplete`, `unsupported-critical-context`, `required-profile-unsupported`, `profile-contract-unsatisfied`, `conflicting-evidence`.

The distinction is intentional: `not-applicable` is not `not-listed`; stale or incomplete evidence is not an authoritative denial; unsupported critical semantics cannot be converted into a broader successful evaluation.

## Compatibility classification

| Candidate semantic | Final WP7 classification | Rationale |
| --- | --- | --- |
| `context.time` syntax | `v2-compatible-informative` | Already represented by approved v2. |
| Historical evidence sufficiency | `breaking-processing-semantics` | Existing syntax does not guarantee authoritative historical evidence. |
| Verification-material qualifier | `breaking-processing-semantics` | v2 requires unknown context members to be ignored. |
| Evidence/provenance response metadata | `v2-compatible-informative` only when non-decisional | Additive metadata is safe only if clients do not rely on it to reinterpret a v2 boolean. |
| Three-state evidence decision | `new-version-required` for generic interoperability | Existing booleans cannot safely encode indeterminate without a new processing contract. |
| Unsupported-critical-condition outcome | `new-version-required` for generic interoperability | v2 currently mandates ignore-and-process. |
| Pre-negotiated profile with mandatory context contract | `v2-compatible-profile` only as a bounded transition | Safe only after capability establishment excludes generic legacy peers. |
| Source authority/completeness/freshness diagnostics | `v2-compatible-informative` as diagnostics; breaking if decisional | Relying-party semantics determine whether they alter the proposition. |

## Candidate safety invariant

> An implementation MUST NOT return a definitive success for a proposition after silently dropping a query condition that the requester declared decision-critical.

## Versioning recommendation

WP7's repository-local evidence supports **TRQP 3.0 candidate processing semantics**, not TRQP 2.1, for the decision-critical model developed in WP1–WP7.

The reason is not payload aesthetics. It is a direct processing conflict: approved v2 requires unknown optional context to be ignored, while the candidate assurance model requires unsupported decision-critical context to fail closed as indeterminate. A legacy endpoint can therefore produce a materially broader positive result from the same qualified request.

A tightly controlled v2 profile remains useful for transitional interoperability experiments, but only when capability/profile establishment occurs before the query and the profile mechanically binds mandatory qualifier processing. Such a profile MUST NOT be represented as transparent compatibility with generic v2 endpoints.

## Evidence and remaining authority boundary

Repository-local implementation and tests now cover:

- legacy-v2 qualifier-drop false-positive risk;
- unsupported critical-context failure;
- missing and unsupported profile failure;
- profile-contract binding to mandatory context;
- explicit candidate-version validation;
- three-state decision constraints;
- decision-specific reason vocabulary, including `not-applicable` vs `not-listed`, stale/incomplete evidence, and wrong-purpose/resource/material cases.

This closes the WP7 repository-local question. It does **not** make the candidate normative or stable. WP8 independent Interop Lab/TSPP evidence and later upstream reconciliation remain separate gates before any promotion judgment.
