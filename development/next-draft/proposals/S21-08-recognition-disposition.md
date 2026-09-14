# S21-08 — Recognition propagation/transitivity RC disposition

Status: downstream RC disposition; upstream adoption remains external.

## Decision

Core TRQP v3 candidate SHALL define **direct recognition only**. Recognition propagation/transitivity is explicitly deferred research and is not required for RC semantic completeness.

The downstream evidence establishes a safe deterministic rule:

> In the absence of an explicit propagation rule issued under sufficient authority and carrying scope, lifecycle and path constraints, `A recognizes B` and `B recognizes C` MUST NOT imply `A recognizes C`.

This is not merely an implementation preference. Permitting graph reachability to manufacture recognition would create incompatible and unsafe relying-party behaviour.

## Direct-recognition proposition

A direct recognition proposition is bounded as:

```text
R(recognizer, recognized-subject, authority, scope, evaluation-time, evidence)
```

A positive result requires authoritative evidence for that exact relationship and scope at the requested evaluation time. Principal identity, endpoint co-location, shared profile membership, key validity, capability advertisement, or another recognition edge is insufficient by itself.

## Propagation disposition

The candidate does **not** define a positive propagated-recognition algorithm. Any future propagation proposal must independently specify and falsify at least:

- propagation authority;
- maximum/path constraints;
- scope preservation or narrowing;
- edge lifecycle/freshness;
- cycle handling;
- authority mismatch;
- distinguishability of direct vs propagated recognition;
- revocation/invalidation behaviour;
- interoperability evidence.

Until such a rule exists, cycle, path-length, stale-edge, scope-mismatch and authority-mismatch cases all fail to produce propagated recognition by construction.

## Release judgment

This resolves the release-blocking ambiguity without pretending to resolve the research question. Two independent RC implementers receive deterministic behaviour: evaluate direct recognition; do not infer transitivity.

```yaml
section21: S21-08
class: research/evidence
rc_disposition: deferred
core_behavior: direct-recognition-only
propagation_default: prohibited-without-explicit-rule
release_blocking: false
research_track: NTRQP-009
upstream_authority: pending
```
