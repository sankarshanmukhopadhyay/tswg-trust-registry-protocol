# Trust Registry Query Protocol — downstream v3 candidate branch

> **Status:** This branch is the complete downstream TRQP v3 release-candidate proposal. It is not an adopted Trust Over IP specification. The repository `main` branch remains the stable approved-v2 line until an explicit promotion decision is made.

This branch is intentionally organized so it can be reviewed as a product rather than reconstructed from development history. A reviewer or implementer should be able to understand the proposed protocol, implement it, run its conformance evidence, assess migration from v2, and inspect the remaining upstream authority boundaries from this branch alone.

## Start here

1. **Normative candidate specification:** [`development/next-draft/CANDIDATE-TRQP-V3.md`](development/next-draft/CANDIDATE-TRQP-V3.md)
2. **Stable normative requirement IDs:** [`development/next-draft/NORMATIVE-REQUIREMENTS.md`](development/next-draft/NORMATIVE-REQUIREMENTS.md)
3. **Candidate request/response schemas:** [`development/verification-material/schemas/`](development/verification-material/schemas/)
4. **Candidate examples:** [`development/next-draft/examples/`](development/next-draft/examples/)
5. **Implementer's Guide:** [`development/next-draft/IMPLEMENTERS-GUIDE.md`](development/next-draft/IMPLEMENTERS-GUIDE.md)
6. **v2 → v3 Migration Guide:** [`development/next-draft/V2-TO-V3-MIGRATION-GUIDE.md`](development/next-draft/V2-TO-V3-MIGRATION-GUIDE.md)
7. **Conformance & Interoperability Guide:** [`development/next-draft/CONFORMANCE-AND-INTEROP-GUIDE.md`](development/next-draft/CONFORMANCE-AND-INTEROP-GUIDE.md)
8. **Using TRQP in Agentic Systems:** [`development/next-draft/AGENTIC-USAGE-GUIDE.md`](development/next-draft/AGENTIC-USAGE-GUIDE.md)
9. **Operational Guidance:** [`development/next-draft/OPERATIONAL-GUIDANCE.md`](development/next-draft/OPERATIONAL-GUIDANCE.md)
10. **Requirement → executable-evidence traceability:** [`development/next-draft/REQUIREMENT-TEST-TRACEABILITY.md`](development/next-draft/REQUIREMENT-TEST-TRACEABILITY.md)

## What v3 changes

The candidate keeps TRQP a read-only trust-registry query/evaluation protocol while making its decision boundary explicit. Evaluation is bounded by the exact proposition, which may include principal, authority, action, resource, verification material, evaluation time and declared decision-critical context. The candidate separates semantic decision state from transport state; preserves uncertainty when evidence is insufficient; treats principal, relationship and verification-material lifecycle independently unless governance explicitly couples them; prohibits silent downgrade to generic v2; and defines direct recognition without inferred transitivity.

Agentic use is a mandatory stress lens, not an expansion of TRQP into an agent protocol. Agent identity, capability, delegation evidence and transaction authority remain distinct. Delegation instruments, workflow authorization, payments, messaging and agent lifecycle remain outside TRQP's protocol scope.

## Conformance and validation

The branch carries executable downstream evidence under `tests/` and `development/verification-material/`. GitHub Actions runs the complete downstream reference-model suite and the RC-readiness validator. The readiness controls account for stable requirement families, candidate schema surfaces, SHOULD disposition, unresolved editorial markers and semantic-field-loss protections.

Local differential tests demonstrate repository-local consistency. They **do not** constitute independent organizational interoperability, and this branch does not claim otherwise.

## Authority boundary

The candidate is publication-grade as a downstream proposal, but final upstream adoption, final major-version/profile naming, final schema identifiers/member spelling, and independent external interoperability remain outside downstream authority. Those boundaries are explicit so that absence of upstream adoption cannot be mistaken for an unresolved local semantic rule.

Approved v2 material is retained under [`specification/v2-approved/`](specification/v2-approved/) as the migration and provenance baseline. It is not the normative implementation target for this branch's v3 candidate.

## Branch-as-product promotion invariant

The intended promotion model is:

```text
main (stable v2)
       +
merge draft/next-trqp after all RC gates are green
       ↓
main becomes a coherent TRQP v3 repository
```

Before promotion, the candidate branch must satisfy all of the following:

- the end-to-end candidate specification contains the normative protocol behaviour;
- schemas/examples and normative prose are reconciled;
- requirement IDs are traceable to executable evidence;
- migration, implementation, conformance, agentic and operational guidance are present;
- repository/document references are valid for the candidate product surface;
- complete tests and RC-readiness validation are green;
- no development-history issue or PR is required to understand normative behaviour;
- v2 remains clearly identified as the retained approved baseline rather than the candidate implementation target.

A clean merge into `main` must not require a second semantic-integration exercise. Promotion may still require release metadata/tagging and an upstream authority decision, but it must not require reconstructing what v3 means.

## Development evidence

`development/` contains both the canonical candidate product artifacts above and supporting evidence/provenance used to derive them. Work-packet notes and disposition registers are evidence, not substitute normative specifications. If a supporting artifact appears to introduce protocol behaviour not present in `CANDIDATE-TRQP-V3.md`, that is a release defect and must be reconciled before RC promotion.

## Editing and contribution

Changes to the v3 candidate should be made on short-lived branches targeting `draft/next-trqp`, with modular commits and executable tests wherever behavior can be tested. `main` should remain stable until the candidate passes the promotion invariant.
