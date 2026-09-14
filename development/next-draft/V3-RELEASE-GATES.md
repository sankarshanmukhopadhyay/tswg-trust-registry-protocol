# TRQP v3 downstream release gates

Status: release-control policy for the downstream candidate.

## G1 — Baseline completeness

Exit only when approved v2 surfaces and relevant upstream backlog have explicit v3 dispositions in `V3-REQUIREMENTS-LEDGER.md`.

## G2 — Semantic completeness

Exit only when no unresolved question permits two competent implementers to produce materially incompatible core behaviour. Section 21 items may remain authority-pending, but not behaviourally undefined. Positive recognition propagation and additional transports may be deferred if the safe core boundary is deterministic.

## G3 — Specification completeness

Exit only when one end-to-end candidate document contains the complete proposed core semantics; normative requirements have stable IDs; schemas/examples align; and OPEN markers denote authority/deferred research rather than missing behaviour.

## G4 — Conformance and interoperability

Exit only when every MUST has machine-verifiable coverage where testable, every SHOULD has coverage or rationale, negative vectors cover fail-closed boundaries, local differential evidence is green, and any external-interoperability claims are backed by genuinely independent evidence.

## G5 — Agentic stress assurance

Exit only when B2C/C2B/C2C stress vectors demonstrate that agent identity, principal identity, capability, delegation evidence, authorization, recognition, discovery and composition remain distinct. Core ambiguities discovered here return to G2.

## G6 — Documentation and release candidate

Exit only when implementer, migration, conformance/interoperability, agentic-use and operational guidance are complete and validated. `v3.0.0-rc.1` is a normative-feature freeze: subsequent changes should be defect/editorial/interoperability corrections unless the RC exposes a release-blocking semantic defect.

## Authority rule

Passing downstream gates does not create upstream adoption. Release metadata MUST distinguish:

```yaml
engineering_state: rc-ready | not-rc-ready
downstream_evidence: complete | partial
external_interop: complete | partial | pending
upstream_authority: accepted | pending | rejected | not-submitted
```

## No-greenwashing rule

Green CI means only that the tests that exist passed. RC readiness additionally requires evidence that the required tests exist, are traceable to normative requirements, and cover release-critical negative behaviour.
