# Candidate TRQP v3 Implementer's Guide

Status: informative downstream implementation guidance.

## Processing pipeline

A candidate implementation should make the following boundaries explicit in code:

1. parse and validate the request;
2. resolve the exact proposition and critical dimensions;
3. establish version/profile/critical-context processing support;
4. resolve principal, relationship and verification-material lifecycle independently;
5. assess evidence authority, completeness, freshness, temporal coverage and conflict;
6. evaluate without broadening/fallback;
7. emit semantic decision + reason + evaluation time + bounded provenance;
8. retain sufficient audit evidence for challenge/re-evaluation.

## Decision handling

Do not use a boolean as the sole externally meaningful result. Consumers need at least positive, authoritative-negative, indeterminate and not-applicable classes. Transport errors and processing failures are outside this semantic decision axis.

## Fail-closed boundaries

Fail non-positively when required candidate semantics cannot be established: unsupported critical context, profile conflict, legacy-only peer, stale/unauthorized discovery metadata, incomplete historical evidence or evidence conflict. Do not convert uncertainty into absence.

## Binding

Core processing is transport-neutral. An HTTP binding maps semantic messages and processing failures but cannot change proposition scope, evaluation time, critical context or semantic identity. Endpoint URI is routing information, not registry authority identity.

## Recognition

Implement direct recognition first. Do not traverse a graph and manufacture recognition. A future propagation profile requires separate authority, path, scope, lifecycle and interoperability rules.

## Agentic use

Treat agent identity, principal/delegator, capability, delegation evidence, authorization and recognition as distinct inputs/propositions. TRQP may evaluate a proposition that depends on external delegation evidence; it does not issue or define the delegation instrument.

## Testing

Run the complete repository suite:

```bash
npm test
```

For candidate conformance work also inspect `development/next-draft/NORMATIVE-REQUIREMENTS.md`, `CONFORMANCE-COVERAGE.md`, and the negative vectors. A green parser is not a conformance claim; mandatory semantic failure behaviour must be demonstrated.