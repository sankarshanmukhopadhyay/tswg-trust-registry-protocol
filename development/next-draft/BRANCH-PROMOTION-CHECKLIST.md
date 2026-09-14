# TRQP v3 candidate branch promotion checklist

This is the release-control checklist for treating `draft/next-trqp` as a self-contained v3 product branch and, eventually, promoting it to `main`.

## Product-surface gate

- [ ] Root README identifies the branch as the downstream v3 candidate and routes reviewers to the normative candidate specification.
- [ ] `CANDIDATE-TRQP-V3.md` contains all normative candidate protocol behaviour.
- [ ] Supporting work-packet/disposition documents do not introduce normative behaviour absent from the candidate specification.
- [ ] Approved v2 artifacts are clearly retained as baseline/provenance, not the v3 implementation target.

## Implementation gate

- [ ] Candidate request/response schema semantics match the normative specification.
- [ ] Candidate examples preserve all decision-critical semantics.
- [ ] Implementer's, migration, conformance/interoperability, agentic-usage and operational guides are reachable from the product surface.
- [ ] Stable normative IDs map to executable evidence or explicit rationale.

## Validation gate

- [ ] Complete downstream reference-model suite is green.
- [ ] RC-readiness validator is green.
- [ ] Repository/document references used by the candidate product surface resolve.
- [ ] Controlled candidate artifacts contain no unresolved editorial markers.
- [ ] Independent external interoperability is not falsely claimed from local evidence.

## Merge-coherence gate

A dry comparison of `main...draft/next-trqp` must show that promotion would produce a coherent v3 repository rather than a v2 repository with hidden candidate material.

Before merge to `main`:

- [ ] root/default documentation presents v3 as the current specification;
- [ ] build/publication entry points target the v3 product surface;
- [ ] v2 remains available as retained historical/approved baseline;
- [ ] release/version metadata is updated for RC/promotion;
- [ ] no second semantic-integration exercise is required after merge;
- [ ] upstream authority/adoption status is represented accurately.

## Promotion rule

Do not merge `draft/next-trqp` to `main` and do not cut `v3.0.0-rc.1` until every applicable checkbox above is supported by commit/CI evidence recorded in #42.
