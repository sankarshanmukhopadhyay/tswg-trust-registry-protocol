# S21-01 / S21-06 — Versioning and migration RC disposition

Status: downstream safety contract; final upstream version/profile naming remains external.

## Safety proposition

Candidate decision-critical semantics cannot be processed by a peer that is not bound, before evaluation, to the corresponding processing obligations. A version/profile label is not sufficient evidence by itself.

## Mechanism-neutral rule

A major-version mechanism and a mandatory-profile mechanism are both acceptable **only if** the receiving peer proves support for every required decision-critical semantic before evaluation and generic-v2 fallback is impossible.

Therefore the downstream candidate does not need to choose upstream's naming mechanism to be semantically complete. It requires the following behavior:

1. v2-only peer + candidate-critical request → no candidate evaluation; explicit unsupported/failure outcome.
2. candidate-only peer + v2 request → process only under an explicitly supported compatibility contract; no inferred compatibility.
3. dual-capability peers → negotiate the candidate contract before sending/evaluating decision-critical candidate semantics.
4. failed/ambiguous negotiation → no silent fallback to generic v2.
5. unknown critical context → fail closed/non-positive; never ignore and broaden.

## Downstream recommendation

A distinct major version is the clearest signalling mechanism because the processing semantics are breaking. An equivalently mandatory, non-ignorable profile can satisfy the safety contract only if its support is proven before evaluation and fallback is prohibited. Final choice and naming are upstream authority.

```yaml
section21: [S21-01, S21-06]
evidence_state: complete
downstream_recommendation: major-version-preferred
mandatory_profile: acceptable-only-if-non-ignorable-and-pre-negotiated
silent_v2_fallback: prohibited
upstream_decision: final-version-or-profile-policy
release_blocking: false
```