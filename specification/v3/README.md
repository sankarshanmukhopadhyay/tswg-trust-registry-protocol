# Trust Registry Query Protocol — Candidate v3

> **Normative downstream candidate.** This is the canonical public specification entry point for the complete proposed TRQP v3 carried on `draft/next-trqp`. It is not an adopted Trust Over IP specification.

The complete normative specification text is maintained in [`../../development/next-draft/CANDIDATE-TRQP-V3.md`](../../development/next-draft/CANDIDATE-TRQP-V3.md) and is incorporated here by reference for this candidate branch.

## Status and authority

`main` remains the stable downstream TRQP v2 line. `draft/next-trqp` is intentionally a separate, self-contained proposed-v3 branch that can be reviewed, implemented and tested without changing `main`.

The v3 designation, final upstream schema identifiers/member spelling, production binding selection, and upstream adoption remain external authority decisions. Those boundaries do not weaken the candidate semantics.

## Normative specification

**Read the full normative text:** [`CANDIDATE-TRQP-V3.md`](../../development/next-draft/CANDIDATE-TRQP-V3.md)

The specification defines the candidate protocol's:

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

## Implementation package

The candidate is more than specification prose. Use these artifacts together:

- [Stable normative requirement IDs](../../development/next-draft/NORMATIVE-REQUIREMENTS.md)
- [Candidate request/response schemas](../../development/verification-material/schemas/)
- [Candidate examples](../../development/next-draft/examples/)
- [Implementer's Guide](../../development/next-draft/IMPLEMENTERS-GUIDE.md)
- [v2 → v3 Migration Guide](../../development/next-draft/V2-TO-V3-MIGRATION-GUIDE.md)
- [Conformance & Interoperability Guide](../../development/next-draft/CONFORMANCE-AND-INTEROP-GUIDE.md)
- [Using TRQP in Agentic Systems](../../development/next-draft/AGENTIC-USAGE-GUIDE.md)
- [Operational Guidance](../../development/next-draft/OPERATIONAL-GUIDANCE.md)
- [Requirement → executable-evidence traceability](../../development/next-draft/REQUIREMENT-TEST-TRACEABILITY.md)

## v2 baseline

The approved v2 material remains available under [`../v2-approved/`](../v2-approved/) as the stable baseline, migration reference and provenance record. Its presence on this branch does not make it the implementation target for the v3 candidate.

## Branch invariant

This branch is designed to answer a simple review question: **what would a fully fledged TRQP v3 look, read and behave like?**

A reviewer should not need issue history or work-packet discussions to determine normative behavior. `development/` retains engineering evidence and provenance, but normative behavior is governed by the candidate specification linked above. Any supporting artifact that appears to introduce protocol behavior absent from the normative specification is a defect to be reconciled, not an additional hidden specification surface.