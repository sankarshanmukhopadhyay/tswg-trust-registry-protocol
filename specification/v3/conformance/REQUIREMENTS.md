# TRQP v3 normative requirement register

Status: downstream candidate release-control artifact; not an adopted Trust Over IP specification.

This register assigns stable downstream identifiers to the candidate's release-significant normative obligations. IDs are intended for prose-to-test traceability and MUST NOT be interpreted as upstream identifiers.

| ID | Candidate section | Normative obligation | Conformance evidence |
|---|---:|---|---|
| TRQP3-PROP-001 | 3.1 | Resolve the exact proposition before authoritative decision. | exact-proposition positive/negative vectors |
| TRQP3-PROP-002 | 3.1 | Do not silently remove a decision-critical dimension where meaning broadens/changes. | critical-context downgrade negative vector |
| TRQP3-MAT-001 | 3.2 | Principal and verification material are independently representable/governable. | principal/material independence vectors |
| TRQP3-MAT-002 | 3.2 | Principal positive state does not imply material validity/applicability. | revoked/mismatched material vectors |
| TRQP3-MAT-003 | 3.2 | Material-qualified evaluation binds exact principal/material/authority/action/resource and does not fall back. | mismatch negative vector |
| TRQP3-CTX-001 | 3.3 | Supported critical members are evaluated under the processing contract; unsupported critical semantics resolve indeterminate/non-positive. | unsupported-critical-context vector |
| TRQP3-LIFE-001 | 4 | Material lifecycle is evaluated independently from principal lifecycle. | revocation/expiry/supersession vectors |
| TRQP3-LIFE-002 | 4 | Current state is not projected backwards for historical evaluation. | historical-before-revocation vector |
| TRQP3-LIFE-003 | 4 | Insufficient historical evidence resolves indeterminate. | historical evidence-gap vector |
| TRQP3-EVID-001 | 5.1 | Evidence sufficiency considers authority, scope, completeness, freshness, temporal coverage, provenance and conflict as relevant. | evidence sufficiency matrix |
| TRQP3-EVID-002 | 5.1 | Insufficient evidence is neither positive nor authoritative negative. | incomplete/stale/unavailable/conflicting vectors |
| TRQP3-EVID-003 | 5.2 | Absence is authoritative negative only with authoritative, complete and temporally sufficient evidence. | complete-absence vs insufficient-absence vectors |
| TRQP3-DEC-001 | 6 | Results distinguish positive, negative, indeterminate and not-applicable. | decision-class vectors |
| TRQP3-DEC-002 | 6 | Consumers do not infer semantic decision solely from transport status/success/absence. | transport/semantic differential vectors |
| TRQP3-REQ-001 | 7 | Invalid or contradictory critical declarations are not repaired by dropping conditions. | malformed-critical-context vector |
| TRQP3-EVAL-001 | 8 | Evaluation preserves exact scope and uncertainty and emits auditable semantic result. | reference-model evaluation suite |
| TRQP3-RESP-001 | 9 | Relying party evaluates semantic decision class and does not equate transport success with positive. | transport-success/non-positive vector |
| TRQP3-NEG-001 | 10 | Candidate processing contract establishes supported semantics/profiles/critical context before evaluation. | negotiation vectors |
| TRQP3-NEG-002 | 10 | Candidate request never silently falls back to generic v2. | v2 downgrade negative vector |
| TRQP3-BIND-001 | 11 | Binding does not create semantic meaning, drop critical context, rewrite time/scope, or confuse endpoint identity with semantic identity. | binding-invariant vectors |
| TRQP3-DISC-001 | 12 | Discovery is distinct from authorization, recognition and registry membership. | discovery-not-authority vector |
| TRQP3-DISC-002 | 12 | Invalid/stale/unavailable capability metadata does not trigger legacy downgrade. | discovery downgrade vector |
| TRQP3-PROF-001 | 13 | Profiles may strengthen but do not weaken/redefine mandatory core semantics or proposition identity. | profile weakening negative vectors |
| TRQP3-PROF-002 | 13 | Conflicting mandatory profile obligations fail closed before evaluation. | profile-conflict vector |
| TRQP3-REC-001 | 14 | Recognition is distinct from authorization, material validity and discovery. | recognition separation vectors |
| TRQP3-REC-002 | 14 | A→B and B→C do not imply A→C absent explicit authoritative propagation semantics. | non-transitivity vector |
| TRQP3-ERR-001 | 15 | Processing/transport failures remain distinguishable from semantic negative. | RFC9457/error mapping vectors |
| TRQP3-SEC-001 | 16 | Implementations protect against downgrade, stale replay, evidence injection, material substitution and scope broadening. | adversarial negative suite |
| TRQP3-SEC-002 | 16 | Unknown/unsupported critical semantics fail closed. | unknown-critical vector |
| TRQP3-PRIV-001 | 17 | Privacy minimization never drops a critical condition to broaden evaluation. | minimization/downgrade vector |
| TRQP3-AUD-001 | 18 | Audit evidence supports proposition/time/contract/evidence/result reconstruction and redress. | audit-survival/agent-replacement vector |
| TRQP3-COMP-001 | 20 | Migration is explicit negotiation; syntactic legacy acceptance is not semantic compatibility. | v2/v3 differential corpus |

## Release rule

A normative candidate obligation is release-accounted only when it has: (1) a stable ID, (2) a normative prose location, (3) schema impact disposition where applicable, and (4) positive/negative machine-verifiable evidence or an explicit rationale where machine verification is not applicable.

## Agentic stress mapping

The agentic stress model does not add an agent protocol. It exercises the IDs above, particularly `PROP`, `CTX`, `LIFE`, `EVID`, `NEG`, `DISC`, `REC`, `SEC`, and `AUD`, against delegated-authority and machine-speed failure conditions. Component validity MUST NOT be treated as composition validity by implication.