# Development and assurance evidence

This directory is **not part of the normative TRQP v3 specification surface**.

For the proposed downstream v3, start at [`../specification/v3/`](../specification/v3/). That package owns the public specification, API, guides, conformance controls and examples.

`development/` retains material needed for engineering provenance and assurance, including work-packet evidence, upstream reconciliation/dispositions, experimental verification material and research/stress analysis. These artifacts explain **how the candidate was derived and tested**; they do not independently define what TRQP v3 means.

## Authority rule

If a file under `development/` appears to introduce a normative requirement that is absent from `specification/v3/TRQP-V3.md`, treat that as a defect and reconcile the normative specification. Do not treat development evidence as a hidden extension.

## Current areas

- `evidence/v3/` — completed v3 planning, reconciliation, stress-model and traceability provenance retained for audit.
- `verification-material/` — executable models, schemas, fixtures and work-packet evidence used by downstream tests.
- other development files — roadmap/assurance history predating or supporting the v3 candidate.

Work-packet labels such as WP0–WP7 are engineering provenance only. Public implementers should not need to understand them to implement the candidate.