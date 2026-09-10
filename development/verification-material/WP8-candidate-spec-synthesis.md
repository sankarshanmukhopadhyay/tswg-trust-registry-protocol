# WP8 — evidence-backed candidate-next-TRQP synthesis

Status: **downstream experimental candidate; not normative TRQP**

This synthesis is derived from the repository-local WP1–WP7 implementation/conformance work plus independently implemented Interop Lab and TSPP evidence. It deliberately does not modify `specification/v2-approved/` and does not claim upstream authority.

## Authority and provenance

Stable downstream base: `main` at `6863733878f3657e05f70764bb474a9fb918de9a`.

Candidate lineage: `feat/wp7-wire-compatibility` at `c5054cea09298b8807af9fde84d15086bb5c3ccd`, which is 41 commits ahead of and 0 commits behind that stable base at F4 entry.

Independent evidence:

- Interop Lab PR #207, merged as `30ab9d0ab8e3c2cc053d3f40cfd50809c965715d`: https://github.com/sankarshanmukhopadhyay/trust-protocol-interop-lab/pull/207
- Interop Lab trackers #205/#206: https://github.com/sankarshanmukhopadhyay/trust-protocol-interop-lab/issues/205 and https://github.com/sankarshanmukhopadhyay/trust-protocol-interop-lab/issues/206
- TSPP PR #81, merged as `6f1772b`: https://github.com/sankarshanmukhopadhyay/TRQP-TSPP/pull/81
- TSPP trackers #79/#80: https://github.com/sankarshanmukhopadhyay/TRQP-TSPP/issues/79 and https://github.com/sankarshanmukhopadhyay/TRQP-TSPP/issues/80
- External motivating input, not normative ownership: https://github.com/ayraforum/ayra-trust-registry-resources/issues/43
- Approved upstream TRQP v2 API: https://github.com/trustoverip/tswg-trust-registry-protocol/blob/main/specification/v2-approved/core/api.md
- Approved upstream v2 versioning/extensibility: https://github.com/trustoverip/tswg-trust-registry-protocol/blob/main/specification/v2-approved/versioning.md

Relevant upstream TRQP issues must be added and reconciled when available. Until then, all requirements below remain downstream candidate propositions.

## Classification vocabulary

Each proposition is classified as:

- **ESC — evidence-supported candidate:** behaviour independently supported by repository-local implementation plus cross-repository evidence;
- **CR — compatibility requirement:** behaviour required to prevent unsafe interpretation across protocol generations/profiles;
- **EP — experimental proposition:** concrete candidate mechanism whose semantics are useful but whose exact wire form remains experimental;
- **UA — unresolved authority question:** matter requiring upstream normative disposition before stable adoption.

## Candidate propositions

| ID | Classification | Candidate requirement | Evidence / falsification basis |
|---|---|---|---|
| NTRQP-01 | ESC | A semantic principal and its verification material MUST be independently representable and independently governable. Recognition of the principal MUST NOT imply that every associated verification material is current, valid or applicable. | WP1; WP4; Interop `IC-TRQP-PKI-001`; TSPP WP8 lifecycle evidence. |
| NTRQP-02 | ESC | When a query is qualified by verification material, evaluation MUST bind the decision to the exact principal/material/authority/action/resource proposition. Material mismatch MUST NOT fall back to a principal-only positive result. | WP2; Interop material-match/mismatch and wrong-purpose/resource cases. |
| NTRQP-03 | ESC | A decision-critical query condition that is unsupported or not evaluated MUST NOT be silently ignored when ignoring it could broaden the proposition. The result MUST fail closed into a non-positive outcome. | WP3; Interop unsupported-critical-qualifier and legacy qualifier-drop falsification; TSPP critical-condition evidence. |
| NTRQP-04 | ESC | Verification material lifecycle state MUST be evaluable independently from principal recognition. Revoked, expired or superseded material MUST invalidate material-dependent positive decisions without automatically revoking the principal. | WP4; Interop rotation/revocation cases; TSPP lifecycle/invalidation evidence. |
| NTRQP-05 | ESC | Absence MAY support a definitive negative only when the evidence source is authoritative and complete for the evaluated scope and temporally sufficient for the requested evaluation. | WP5; Interop authoritative-complete absence; TSPP complete-absence evidence. |
| NTRQP-06 | ESC | Incomplete, non-authoritative, stale, unavailable or otherwise insufficient evidence MUST NOT be collapsed into either a positive result or an authoritative negative. The protocol processing model MUST preserve an indeterminate/unknown class. | WP5; Interop incomplete/non-authoritative/stale cases; TSPP unknown/stale evidence classes. |
| NTRQP-07 | ESC | Historical evaluation MUST use authoritative effective-dated evidence applicable to requested time T. Current state MUST NOT be projected backwards. Missing, conflicting or historically incomplete evidence MUST yield a non-positive indeterminate/unknown result rather than invented history. | WP6; Interop historical-validity/no-history cases; TSPP historical evidence tests. |
| NTRQP-08 | ESC | `not-applicable` MUST remain semantically distinct from authoritative `not-listed`/negative and from indeterminate/unknown evidence. | WP5/WP7 reason semantics; Interop not-applicable case; TSPP purpose/resource reasons. |
| NTRQP-09 | CR | A legacy peer that is permitted to ignore an unknown optional query context MUST NOT be assumed capable of safely processing a decision-critical qualifier. | WP7 v2 compatibility analysis and downgrade vector; Interop legacy-v2 qualifier-drop false-positive. |
| NTRQP-10 | CR | Negotiated compatibility MUST bind processing obligations, not merely identify a profile. A profile identifier without a mandatory qualifier-processing contract is insufficient to prevent semantic downgrade. | WP7 profile/critical-context experiments. |
| NTRQP-11 | EP | A next-generation request should carry explicit verification-material qualification and an explicit mechanism declaring which context members are decision-critical. | WP7 candidate request schema and conformance vectors. Exact member names/wire shape remain experimental. |
| NTRQP-12 | EP | A next-generation response should expose a decision class and reason/evidence information sufficient to distinguish positive, authoritative negative, indeterminate/unknown, stale/insufficient evidence and not-applicable outcomes without forcing consumers to infer them from HTTP success or record absence. | WP5/WP7 candidate response work; independent Lab/TSPP reason-state evidence. Exact normative vocabulary remains experimental. |
| NTRQP-13 | UA | Whether these processing changes are standardized as TRQP 3.0, another major version, or an upstream-defined profile/version mechanism is an upstream authority decision. Downstream evidence supports treating the processing change as breaking relative to generic v2 unknown-context semantics. | WP7 compatibility analysis; approved v2 extensibility behaviour. |
| NTRQP-14 | UA | Exact normative wire names, enumerated reason vocabulary, capability discovery/negotiation mechanism and migration rules require upstream reconciliation. | WP7 candidate schemas are implementation probes, not upstream text. |

## Candidate processing requirements

The evidence supports the following coherent processing model, independent of final wire spelling:

1. **Resolve the proposition before deciding.** Determine principal, requested authority/action/resource, requested evaluation time, verification-material qualifier and any other declared decision-critical conditions.
2. **Reject unsafe semantic narrowing/broadening.** If a decision-critical condition cannot be processed, do not remove it and evaluate a broader proposition.
3. **Evaluate material lifecycle independently.** Material validity, revocation, expiry, supersession and purpose/resource applicability are separate from principal recognition.
4. **Evaluate evidence quality before interpreting absence.** Authority, scope completeness, freshness and temporal coverage are inputs to the decision, not metadata that may be discarded.
5. **Preserve uncertainty.** Insufficient evidence remains indeterminate/unknown. It is neither proof of authorization nor proof of authoritative absence.
6. **Evaluate historical queries at T.** Use evidence whose effective interval covers T; do not substitute current state.
7. **Return machine-actionable outcome semantics.** Consumers must be able to distinguish the reason a positive decision was withheld.
8. **Prevent legacy downgrade.** A request requiring decision-critical semantics must not be routed through generic v2 behaviour unless a negotiated contract guarantees those semantics.

## Compatibility judgment

The candidate does **not** justify a transparent TRQP 2.1 extension.

The blocking issue is not merely the addition of JSON members. Approved v2 processing permits/mandates ignoring unknown optional context, while the evidence-supported candidate requires unsupported decision-critical conditions to remain decision-relevant and prevent a false positive. A generic v2 peer can therefore accept a syntactically valid request while evaluating a materially broader proposition.

A pre-negotiated profile may be useful as a controlled transition mechanism only where both peers already bind themselves to mandatory processing obligations and generic legacy peers are excluded. That does not make the semantics transparently v2-compatible.

**Downstream working recommendation:** treat the evidence-supported processing model as a candidate major-version semantic change, provisionally referred to as candidate TRQP 3.0, pending upstream authority.

## Traceability and promotion rule

No proposition in this file becomes stable merely because its tests pass. Promotion requires:

- repository-local regression/conformance evidence;
- independent interoperability/falsification evidence;
- explicit residual-risk inventory;
- upstream reconciliation for normative ownership;
- artifact-level promotion judgment rather than wholesale merge of this experimental branch.

`specification/v2-approved/` remains untouched by this work.

## F4 disposition

F4 is satisfied when the candidate proposition set above is checked against issue #3 acceptance criteria and the full F5 assurance/regression sweep confirms there are no unexplained evidence gaps.

Trackers:

- https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/issues/1
- https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/issues/3
- https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/issues/4

```yaml
change:
  type: docs
  scope: candidate-next-trqp
  breaking: false
  authority_impact: none
  assurance_impact: high
  normative_status: downstream-experimental
```
