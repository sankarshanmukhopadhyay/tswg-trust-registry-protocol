# Development and assurance evidence

This directory is **not part of the normative TRQP v3 specification surface**.

For the proposed downstream v3, start at [`../specification/v3/`](../specification/v3/). That directory owns the public specification, API, guides, conformance controls and examples.

`development/` retains durable engineering provenance and assurance evidence: upstream reconciliation and dispositions, experimental verification material, interoperability evidence, and research/stress analysis. These artifacts explain **why candidate claims are supportable and how they are tested**; they do not independently define TRQP v3 semantics.

## Authority rule

If a file under `development/` appears to introduce a normative requirement that is absent from `specification/v3/TRQP-V3.md`, treat that as a defect and reconcile the normative specification. Development evidence is not a hidden extension.

## Current areas

- `evidence/v3/` — reconciliation, semantic dispositions, stress analysis and traceability provenance retained for audit.
- `verification-material/` — executable models, schemas and interoperability evidence used by downstream tests.

Evidence artifacts are named for the proposition or protocol behavior they establish. Temporary planning, sequencing, checkpoint, promotion and release-preparation material belongs in Issues/PRs rather than in the candidate branch.
