# Trust Registry Query Protocol — Candidate v3

> **Normative downstream candidate.** This directory is the canonical public product surface for the complete proposed TRQP v3 carried on `draft/next-trqp`. It is not an adopted Trust Over IP specification.

## Start here

- **Normative protocol specification:** [`TRQP-V3.md`](TRQP-V3.md)
- **Developer API & parameter reference:** [`API.md`](API.md)
- **Machine-readable candidate HTTP contract:** [`openapi.yaml`](openapi.yaml)
- **Experimental transport bindings:** [`bindings/`](bindings/)
- **Implementation and migration guides:** [`guides/`](guides/)
- **Conformance requirements and evidence map:** [`conformance/`](conformance/)
- **Examples:** [`examples/`](examples/)
- **Schema discovery:** [`schemas/`](schemas/)

Everything required to understand or begin implementing the proposed v3 is reachable from this directory. A reader should not need development history, issue history, pull requests, or internal planning artifacts to determine protocol behavior.

## Authority map

| Surface | Purpose | Authority |
|---|---|---|
| [`TRQP-V3.md`](TRQP-V3.md) | Protocol semantics | **Normative downstream candidate** |
| [`API.md`](API.md), [`openapi.yaml`](openapi.yaml), [`schemas/`](schemas/) | Candidate HTTP/wire realization | Normative only where explicitly bound to `TRQP-V3.md`; downstream binding conventions remain non-adopted |
| [`bindings/`](bindings/) | Optional transport bindings that preserve TRQP semantics | Binding-scoped downstream experiments; not core TRQP semantics and not upstream-adopted |
| [`conformance/`](conformance/) | Stable requirement IDs, coverage and interoperability expectations | Derived conformance controls |
| [`guides/`](guides/) | Implementation, migration, agentic and operational explanation | Informative |
| [`examples/`](examples/) | Worked usage | Informative/test-supporting |
| [`../../tests/`](../../tests/) and `../../development/verification-material/` | Executable verification | Assurance evidence |
| [`../../development/evidence/v3/`](../../development/evidence/v3/) | Reconciliation, semantic dispositions and provenance | **Not specification** |

If a development/evidence artifact appears to introduce normative protocol behavior absent from `TRQP-V3.md`, that is a specification defect to reconcile; it is not a hidden extension of v3.

## Status and branch governance

`main` remains the stable downstream TRQP v2 line. `draft/next-trqp` is intentionally a separate, self-contained proposed-v3 branch for review, implementation and interoperability work. Completion of this candidate does **not** imply promotion to `main`.

The v3 designation, final upstream schema identifiers/member spelling, production binding selection and upstream adoption remain external authority decisions. The `/trqp/v3/query` path documented by the candidate OpenAPI contract is a downstream HTTP-binding convention, not an adopted upstream endpoint identifier.

Optional bindings do not change the transport-neutral semantic core. A binding-specific conformance claim is additional to, and scoped separately from, core TRQP v3 conformance.

## Implementation package

| Need | Artifact |
|---|---|
| Read normative v3 semantics | [`TRQP-V3.md`](TRQP-V3.md) |
| API operations and parameters | [`API.md`](API.md) |
| OpenAPI 3.1 contract | [`openapi.yaml`](openapi.yaml) |
| Experimental TSP binding | [`bindings/tsp/`](bindings/tsp/) |
| Candidate schema discovery | [`schemas/`](schemas/) |
| Stable normative requirement IDs | [`conformance/REQUIREMENTS.md`](conformance/REQUIREMENTS.md) |
| Requirement → executable-evidence traceability | [`conformance/TRACEABILITY.md`](conformance/TRACEABILITY.md) |
| Conformance coverage | [`conformance/COVERAGE.md`](conformance/COVERAGE.md) |
| Interoperability guidance | [`conformance/INTEROPERABILITY.md`](conformance/INTEROPERABILITY.md) |
| Implementer's Guide | [`guides/IMPLEMENTERS-GUIDE.md`](guides/IMPLEMENTERS-GUIDE.md) |
| v2 → v3 Migration Guide | [`guides/MIGRATION-FROM-V2.md`](guides/MIGRATION-FROM-V2.md) |
| Agentic-system use | [`guides/AGENTIC-USAGE.md`](guides/AGENTIC-USAGE.md) |
| Operational guidance | [`guides/OPERATIONAL-GUIDANCE.md`](guides/OPERATIONAL-GUIDANCE.md) |
| Candidate examples | [`examples/`](examples/) |
| Executable source schemas | [`../../development/verification-material/schemas/`](../../development/verification-material/schemas/) |

## v2 baseline

Approved v2 material remains under [`../v2-approved/`](../v2-approved/) as the stable baseline, migration reference and provenance record. Its presence on this branch does not make v2 the implementation target for the proposed v3.

## Reader paths

**Review:** `TRQP-V3.md` → `API.md` → `conformance/`.

**Implement:** `API.md` / `openapi.yaml` → `guides/IMPLEMENTERS-GUIDE.md` → `examples/` → tests.

**Implement over TSP:** `TRQP-V3.md` → `bindings/tsp/TRQP-TSP-BINDING.md` → binding schema/examples → `tests/tsp-binding.test.js`.

**Migrate:** `guides/MIGRATION-FROM-V2.md` → conformance controls.

**Agentic use:** `guides/AGENTIC-USAGE.md` → agentic sections of `TRQP-V3.md` → API identity/authority mapping.

**Audit development history:** inspect `development/evidence/v3/`, `development/verification-material/`, linked issues, and pull requests. The candidate specification itself does not depend on reconstruction of internal development sequencing.
