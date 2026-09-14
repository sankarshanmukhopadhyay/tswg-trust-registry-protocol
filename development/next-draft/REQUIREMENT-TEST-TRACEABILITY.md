# TRQP v3 Candidate — Requirement/Test Traceability

Status: downstream release-control artifact.

This register binds stable candidate requirement families to executable evidence. A requirement is not release-accounted merely because prose exists; it needs a test/vector location or an explicit rationale that machine verification is not applicable.

| Requirement family | Primary executable evidence | Evidence class | RC disposition |
|---|---|---|---|
| `TRQP3-PROP-*` | `tests/wp6-executable-model.test.js`, agentic exact-scope vectors | local executable | covered |
| `TRQP3-MAT-*` | `tests/wp6-executable-model.test.js`, material-binding vectors | local executable | covered |
| `TRQP3-CTX-*` | `tests/wp6-executable-model.test.js`, `tests/wp9-negotiation.test.js` | local executable | covered |
| `TRQP3-LIFE-*` | `tests/wp6-executable-model.test.js`, delegated-authority historical/revocation vectors | local executable | covered |
| `TRQP3-EVID-*` | `tests/wp6-executable-model.test.js`, conformance vectors | local executable | covered |
| `TRQP3-DEC-*` | `tests/wp7-conformance-vectors.test.js` | local executable | covered |
| `TRQP3-REQ-*` | `tests/wp7-conformance-vectors.test.js`, negotiation malformed/critical vectors | local executable | covered |
| `TRQP3-EVAL-*` | `tests/wp6-executable-model.test.js` | local executable | covered |
| `TRQP3-RESP-*` | `tests/wp7-conformance-vectors.test.js` | local executable | covered |
| `TRQP3-NEG-*` | `tests/wp9-negotiation.test.js` | local executable | covered |
| `TRQP3-BIND-*` | `tests/s21-04-transport-bindings.test.js` | local executable | covered |
| `TRQP3-DISC-*` | `tests/s21-05-capability-discovery.test.js`, `tests/s21-05-well-known-binding.test.js`, `tests/s21-05-differential-interop.test.js` | local + differential | covered-local; external independence pending |
| `TRQP3-PROF-*` | `tests/s21-06-processing-profiles.test.js` | local executable | covered |
| `TRQP3-REC-*` | recognition tests plus agentic non-transitivity vector | local executable | covered-local; normative propagation boundary tracked in #38 |
| `TRQP3-ERR-*` | error/problem-detail tests | local executable | covered |
| `TRQP3-SEC-*` | cross-suite adversarial negatives | local executable | covered |
| `TRQP3-PRIV-*` | critical-context/minimization negative vectors | local executable | covered |
| `TRQP3-AUD-*` | audit/agent-replacement vectors | local executable | covered |
| `TRQP3-COMP-*` | v2/v3 negotiation and compatibility vectors | local executable | covered |

## SHOULD disposition

Candidate SHOULD statements are release-accounted when they express operational guidance rather than wire-level deterministic behavior. Their rationale/evidence is captured in `IMPLEMENTERS-GUIDE.md`, `CONFORMANCE-INTEROP-GUIDE.md`, `OPERATIONAL-GUIDANCE.md`, and the security/privacy sections of the candidate. A future editorial normalization pass may convert any SHOULD that actually controls interoperable behavior into a stable normative requirement ID and executable vector.

## External evidence boundary

The repository contains local differential interoperability evidence. Independent organizational/implementation evidence is still external and MUST NOT be inferred from this register. This is a release-evidence path, not an upstream adoption claim.

## Release check

Before RC, automated validation should verify that every stable ID in `NORMATIVE-REQUIREMENTS.md` belongs to a family represented here, all named test files exist, and no release-blocking `[OPEN]` marker lacks an explicit authority/deferred-research disposition.