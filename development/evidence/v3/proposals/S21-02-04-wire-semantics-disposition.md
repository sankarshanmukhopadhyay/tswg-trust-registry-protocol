# S21-02 / S21-03 / S21-04 / S21-07 — Wire semantic RC disposition

Status: downstream normative proposal; final upstream spelling/adoption remains external.

## Verification-material qualification

A request that qualifies a principal by verification material binds evaluation to the exact material identifier supplied. Material identity/lifecycle is independent of principal state. Material mismatch, revocation, expiry or insufficient material evidence cannot fall back to principal-only positive.

Candidate concept: `verification_material` as decision-critical context. Final normative member spelling and schema identifier are upstream decisions.

## Decision-critical context

Candidate requests carry a declaration of critical semantic members. A processor must either support and bind itself to those semantics or fail closed/non-positive before evaluation. Unsupported declarations cannot be ignored; malformed/contradictory declarations cannot be repaired by dropping conditions.

Candidate concepts: `critical_context` + corresponding `context` values. Final serialization spelling remains upstream-controlled.

## Decision and reason vocabulary

Minimum semantic decision classes:

- `positive` — sufficient authoritative evidence supports the exact proposition;
- `negative` — sufficient authoritative evidence establishes the exact proposition does not hold;
- `indeterminate` — evidence/processing semantics are insufficient to decide;
- `not-applicable` — the proposition is outside the applicable semantic domain.

Transport status and processing errors are separate. Reasons are machine-actionable categories and must not require prose parsing for semantic classification.

## Evidence-state vocabulary

Evidence state is orthogonal to decision state. Candidate states are:

`sufficient`, `incomplete`, `stale`, `unavailable`, `non-authoritative`, `conflicting`, `unknown`.

Material incomplete/stale/unavailable/non-authoritative/conflicting/unknown evidence maps to `indeterminate` unless another authoritative evidence set independently resolves the exact proposition under a defined precedence rule. `sufficient` evidence does not imply `positive`.

## Release judgment

The concepts, processing behavior and negative invariants are sufficiently deterministic for RC. Final JSON member names/schema URIs are adoption/naming questions, not semantic OPENs.

```yaml
section21: [S21-02, S21-03, S21-04, S21-07]
state: downstream-proposal-ready
exact_material_binding: required
critical_context_fail_closed: required
decisions: [positive, negative, indeterminate, not-applicable]
evidence_states: [sufficient, incomplete, stale, unavailable, non-authoritative, conflicting, unknown]
final_wire_spelling: upstream-pending
release_blocking: false
```