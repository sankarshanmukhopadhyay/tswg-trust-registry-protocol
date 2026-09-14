# TRQP v3 Candidate — Section 21 Disposition Register

Status: downstream candidate governance record. This register resolves release ambiguity; it does not claim Trust Over IP adoption.

| ID | Topic | Downstream RC disposition | Evidence state | Authority state | Release blocker? |
|---|---|---|---|---|---|
| S21-01 | Major version vs mandatory profile | Candidate semantics require pre-evaluation binding to all decision-critical obligations and prohibit generic-v2 fallback. Whether upstream names this `3.0` or adopts an equivalently mandatory profile is upstream policy. | evidence complete | awaiting upstream | No |
| S21-02 | Verification-material qualification wire contract | Exact material qualification is required; material mismatch cannot fall back to principal-only positive. Candidate member shape is proposal-grade; final spelling/URI is upstream. | executable proposal | awaiting upstream naming | No |
| S21-03 | Decision-critical context | Requester can declare decision-critical conditions; unsupported/malformed critical semantics fail closed and cannot be silently dropped. | executable proposal | downstream proposal ready | No |
| S21-04 | Decision/result/reason vocabulary | Candidate distinguishes `positive`, `negative`, `indeterminate`, `not-applicable`; transport/processing status is separate; reasons are machine-actionable. | executable proposal | downstream proposal ready | No |
| S21-05 | Capability/profile discovery | Transport-independent capability contract plus experimental `.well-known` binding; local differential evidence complete. | local differential | independent interop pending G4 | No |
| S21-06 | v2→candidate migration | Candidate semantics never silently fall back to generic v2. v2-only, candidate-only and dual-capability cases are governed by explicit negotiation/failure. Final version/profile policy is upstream. | evidence complete | awaiting upstream policy | No |
| S21-07 | Insufficient-evidence vocabulary | Evidence state is distinct from decision state; incomplete/stale/unavailable/non-authoritative/conflicting/unknown preserve indeterminacy where material. | executable proposal | downstream proposal ready | No |
| S21-08 | Recognition propagation | RC core is direct recognition only. No transitivity is inferred without an explicit authoritative propagation rule. Positive propagation remains research. | safe deterministic disposition | research deferred | No |
| S21-09 | Transport/profile boundary | Core semantics are transport-neutral; transport cannot manufacture semantic decisions; compatible profiles strengthen obligations; conflicts fail closed. | executable proposal | production interop pending G4 | No |

## G2 release judgment

No Section 21 question remains an undifferentiated semantic `OPEN`. The downstream candidate either provides deterministic executable semantics or records an explicit upstream/research authority boundary that cannot cause two conforming RC implementations to infer broader behavior.

External independent interoperability remains a G4 assurance gate. Upstream naming/adoption remains an authority gate. Neither is misrepresented as completed downstream.

```yaml
gate: G2
semantic_open_items: 0
section21_items_dispositioned: 9
release_blocking_section21_items: 0
external_interop_gate: G4
upstream_adoption_claimed: false
```