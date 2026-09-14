# Trust Registry Query Protocol — Candidate v3

> **Normative downstream candidate.** This is the canonical public specification entry point for the complete proposed TRQP v3 carried on `draft/next-trqp`. It is not an adopted Trust Over IP specification.

The complete normative specification text is maintained in [`../../development/next-draft/CANDIDATE-TRQP-V3.md`](../../development/next-draft/CANDIDATE-TRQP-V3.md) and is incorporated here by reference for this candidate branch.

## Start here

- **Protocol specification:** [`CANDIDATE-TRQP-V3.md`](../../development/next-draft/CANDIDATE-TRQP-V3.md)
- **Developer API & parameter reference:** [`API.md`](API.md)
- **Machine-readable candidate HTTP contract:** [`openapi.yaml`](openapi.yaml)
- **Schema discovery surface:** [`schemas/`](schemas/)

If you are implementing the candidate HTTP-facing API, begin with `API.md` and `openapi.yaml`; use the normative specification to resolve semantic requirements and the conformance material to verify behavior.

## Status and authority

`main` remains the stable downstream TRQP v2 line. `draft/next-trqp` is intentionally a separate, self-contained proposed-v3 branch that can be reviewed, implemented and tested without changing `main`.

The v3 designation, final upstream schema identifiers/member spelling, production binding selection, and upstream adoption remain external authority decisions. The `/trqp/v3/query` path documented by the candidate OpenAPI contract is a downstream HTTP-binding convention, not an adopted upstream endpoint identifier. Those boundaries do not weaken the candidate semantics.

## What the normative specification defines

- bounded proposition and decision-critical context model;
- principal and verification-material separation;
- lifecycle, invalidation and historical evaluation semantics;
- evidence sufficiency and authoritative-absence rules;
- positive, negative, indeterminate and not-applicable decision model;
- request, response and evaluation contracts;
- version/profile negotiation and fail-closed migration from v2;
- transport/binding and discovery authority boundaries;
- governance/security profile composition;
- direct-recognition-only semantics;
- processing/error, security and privacy requirements;
- auditability, redress and agent-replacement requirements;
- agentic-system and delegation/composition boundaries;
- conformance requirements and operational obligations.

## Complete implementation package

| Need | Artifact |
|---|---|
| API operations and parameter semantics | [`API.md`](API.md) |
| OpenAPI 3.1 contract | [`openapi.yaml`](openapi.yaml) |
| Candidate schema discovery | [`schemas/`](schemas/) |
| Stable normative requirement IDs | [`NORMATIVE-REQUIREMENTS.md`](../../development/next-draft/NORMATIVE-REQUIREMENTS.md) |
| Executable request/response schemas | [`development/verification-material/schemas/`](../../development/verification-material/schemas/) |
| Candidate examples | [`examples/`](../../development/next-draft/examples/) |
| Implementer's Guide | [`IMPLEMENTERS-GUIDE.md`](../../development/next-draft/IMPLEMENTERS-GUIDE.md) |
| v2 → v3 Migration Guide | [`V2-TO-V3-MIGRATION-GUIDE.md`](../../development/next-draft/V2-TO-V3-MIGRATION-GUIDE.md) |
| Conformance & Interoperability Guide | [`CONFORMANCE-AND-INTEROP-GUIDE.md`](../../development/next-draft/CONFORMANCE-AND-INTEROP-GUIDE.md) |
| Using TRQP in Agentic Systems | [`AGENTIC-USAGE-GUIDE.md`](../../development/next-draft/AGENTIC-USAGE-GUIDE.md) |
| Operational Guidance | [`OPERATIONAL-GUIDANCE.md`](../../development/next-draft/OPERATIONAL-GUIDANCE.md) |
| Requirement → executable-evidence traceability | [`REQUIREMENT-TEST-TRACEABILITY.md`](../../development/next-draft/REQUIREMENT-TEST-TRACEABILITY.md) |

## API semantics in one paragraph

A candidate client evaluates an exact bounded proposition, not a generic identity lookup. `entity_id`, `authority_id`, `action`, `resource`, material qualification, evaluation time and declared decision-critical context form the decision boundary as applicable. Semantic `positive`, `negative`, `indeterminate` and `not-applicable` results are distinct from HTTP/processing status. Required profiles and critical semantics must be negotiated before evaluation; they cannot be silently removed or downgraded to generic v2 processing.

For agentic use, runtime agent identity, represented principal/controller, authority, verification material, delegation evidence, action and resource must remain distinguishable. See [`API.md`](API.md#8-agentic-parameter-interpretation) for the developer-facing mapping.

## v2 baseline

The approved v2 material remains available under [`../v2-approved/`](../v2-approved/) as the stable baseline, migration reference and provenance record. Its presence on this branch does not make it the implementation target for the v3 candidate.

## Branch invariant

This branch is designed to answer a simple review question: **what would a fully fledged TRQP v3 look, read and behave like?**

A reviewer should not need issue history or work-packet discussions to determine normative behavior. `development/` retains engineering evidence and provenance, but normative behavior is governed by the candidate specification linked above. Any supporting artifact that appears to introduce protocol behavior absent from the normative specification is a defect to be reconciled, not an additional hidden specification surface.