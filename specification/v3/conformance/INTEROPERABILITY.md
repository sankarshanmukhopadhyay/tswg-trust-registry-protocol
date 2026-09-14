# Candidate TRQP v3 Conformance and Interoperability Guide

Status: downstream assurance guidance.

## Claim levels

Use bounded claims:

- **candidate parser** — accepts candidate-shaped messages;
- **candidate processor** — implements candidate semantic processing obligations;
- **locally conformant** — passes the applicable repository conformance corpus;
- **differentially interoperable (local)** — independent local evaluators converge on shared vectors;
- **externally interoperable** — independently developed external implementation(s) reproduce the required outcomes.

Never represent local differential evidence as external interoperability.

## Minimum evidence

A conformance report should identify implementation/version, requirement IDs exercised, vector IDs/tests, result, environment, processing profiles, and evidence timestamp. Failures should be reproducible.

## Critical interoperability behaviours

Independent implementations should converge on: exact proposition binding; material mismatch/revocation; critical-context failure; evidence insufficiency; historical evaluation; decision classes; no legacy downgrade; discovery-not-authority; recognition non-transitivity; profile conflict; processing-error separation; and delegated-authority/false-composition stress cases where agentic use is claimed.

## External S21-05 packet

An external participant can implement the wire-shaped `trqp-capability-v1` semantic contract without importing repository code, then run the shared fresh/stale/unauthorized/version/profile/endpoint-movement/conflict/replay vectors. Record observable outcome only; implementation internals need not match.

## Promotion evidence

A normative promotion claim should link requirement → prose → schema (if applicable) → positive/negative vector → implementation result → independent interop evidence where required. Green CI is necessary repository evidence but is not itself normative consensus.