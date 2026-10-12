# NTRQP-008 — Experimental profile-composition evidence

Status: downstream experimental, repository-local only. Tracking issue: #26.

## Bounded proposition

Governance/security profile declarations may add processing obligations, but cannot weaken candidate core processing requirements or confer authority merely by being declared. The reference model requires an explicit set of trusted profile issuers supplied by the caller, stable profile identifiers and versions, and an evaluation-time validity window. It returns indeterminate rejection rather than silently accepting an unsupported/conflicting profile.

Core protected obligations are `critical-context-fail-closed`, `material-bound-evaluation`, and `decision-reason-classes` (from candidate negotiation). Conflicting requirements/prohibitions fail closed, including any attempt to prohibit a core obligation.

## How to verify

```sh
node --test tests/profile-composition.test.js
npm test
```

## Ownership and limitations

This is a deterministic **research contract**, not a governance profile specification or deployed authorization engine. The caller-provided `trustedAuthorities` is an assumption, **not** independent verification of a signature, delegation, registry participation, or actual profile issuer authority. Version labels are recorded, not resolved against an authoritative profile repository. Effective timestamps are evaluated using JavaScript timestamp parsing; external clock trust is not established. No independent external implementation/interoperability or upstream normative adoption is claimed. No semantic change to approved TRQP v2, stable `main`, or the v3 candidate wire contract is authorized here.

Before any candidate-text promotion: establish authoritative profile-source validation, independently implemented conformance/negative tests, lifecycle and revocation provenance, version compatibility and explicit human promotion judgment. Historical evaluations require historical profile provenance; caller-provided timestamps are not sufficient evidence by themselves.

## Evidence

`development/verification-material/profile-composition.js` and `tests/profile-composition.test.js` test additive composition, immutable core obligations, conflict rejection, untrusted issuers, malformed inputs, duplicates, lifecycle boundaries, revocation/suspension and invalid evaluation times.

No local PASS should be reported as independent assurance.
