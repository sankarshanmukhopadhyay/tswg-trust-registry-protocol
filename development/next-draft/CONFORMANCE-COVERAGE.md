# TRQP v3 conformance coverage

Status: downstream release-control evidence.

This matrix links stable candidate requirement families to executable evidence. `covered` means repository-local machine-verifiable evidence exists; it does not imply upstream adoption or independent external interoperability.

| Requirement family | Primary evidence | Agentic stress | State |
|---|---|---|---|
| TRQP3-PROP-* | WP reference tests; material-bound evaluator | wrong principal/action/resource; false composition | covered |
| TRQP3-MAT-* | `evaluator.js` tests | identity/authority separation | covered |
| TRQP3-CTX-* | critical-context/conformance tests | unsupported delegation context | covered |
| TRQP3-LIFE-* | lifecycle/historical tests | expiry, revocation, historical-before-revocation | covered |
| TRQP3-EVID-* | evidence/conformance tests | capability-only, stale/revoked evidence boundaries | covered |
| TRQP3-DEC-* | WP7 conformance vectors | non-positive delegated outcomes | covered |
| TRQP3-REQ-* | request/conformance vectors | malformed/critical conditions | covered |
| TRQP3-EVAL-* | reference-model suite | exact delegated proposition | covered |
| TRQP3-RESP-* | conformance vectors | audit binding | covered |
| TRQP3-NEG-* | WP9 negotiation/migration tests | no authority by weaker semantics | covered |
| TRQP3-BIND-* | binding/transport tests | endpoint identity separation | covered-local |
| TRQP3-DISC-* | S21-05 discovery + differential tests | capability != authorization | covered-local; external interop pending |
| TRQP3-PROF-* | profile/negotiation tests | component/profile composition | covered-local |
| TRQP3-REC-* | recognition tests | recognized delegator != delegate; non-transitivity | covered-local |
| TRQP3-ERR-* | conformance/error tests | processing failure != semantic negative | covered |
| TRQP3-SEC-* | negative corpus | delegation chain, downgrade, false composition | covered |
| TRQP3-PRIV-* | critical-context invariants | minimization cannot drop authority context | semantic coverage; dedicated privacy vector desirable |
| TRQP3-AUD-* | audit/provenance tests | runtime replacement preserves prior binding | covered-local |
| TRQP3-COMP-* | migration/differential tests | no implicit legacy semantics | covered |

## Release interpretation

The current suite is sufficient to establish broad downstream behavioural coverage, but RC promotion still requires automated assertion that every registered MUST is mapped, schema/example validation, documentation completion, and bounded external-interoperability disposition for critical discovery/recognition/binding behaviour.

## Agentic gate

`tests/v3-agentic-stress.test.js` exercises the mandatory stress conditions without adding agent messaging or delegation-credential semantics to TRQP. The evaluator consumes external delegation evidence as decision-critical context and tests the registry proposition boundary.