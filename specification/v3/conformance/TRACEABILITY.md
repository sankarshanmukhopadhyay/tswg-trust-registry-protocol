# TRQP v3 candidate requirement-to-test traceability

**Status:** downstream conformance-control artifact. This register does not claim upstream adoption or independent interoperability.

The stable candidate requirement IDs are defined in [`REQUIREMENTS.md`](REQUIREMENTS.md). This register binds each requirement family to repository-local executable evidence and identifies external evidence boundaries.

| Requirement family | Candidate concern | Primary executable evidence | Status |
|---|---|---|---|
| `TRQP3-PROP-*` | exact bounded proposition | baseline, principal/material and exact-scope tests; agentic exact-scope vectors | covered-local |
| `TRQP3-MAT-*` | principal/material separation and exact material binding | material-bound evaluation and lifecycle tests | covered-local |
| `TRQP3-CTX-*` | decision-critical context | wire/schema compatibility and negotiation negative tests | covered-local |
| `TRQP3-LIFE-*` | revocation, expiry, supersession, historical evaluation | lifecycle and historical-evaluation tests; agentic historical vectors | covered-local |
| `TRQP3-EVID-*` | evidence authority/completeness/freshness/conflict | evidence-indeterminacy and conformance tests | covered-local |
| `TRQP3-DEC-*` | positive/negative/indeterminate/not-applicable | conformance vectors and evidence tests | covered-local |
| `TRQP3-REQ-*` | malformed/contradictory critical declarations | wire/schema and negotiation negative tests | covered-local |
| `TRQP3-EVAL-*` | exact evaluation and uncertainty preservation | executable reference-model tests | covered-local |
| `TRQP3-RESP-*` | semantic response interpretation | conformance and wire-compatibility tests | covered-local |
| `TRQP3-NEG-*` | candidate negotiation and no silent v2 fallback | negotiation/migration tests | covered-local |
| `TRQP3-BIND-*` | transport binding invariants | S21-09 transport/profile boundary tests | covered-local |
| `TRQP3-TSP-*` | optional TSP binding: VID/semantic separation, correlation, fail-closed context, transport-failure separation | `tests/tsp-binding.test.js`; `development/verification-material/tsp-binding.js`; binding schema/examples | covered-local; independent TSP/TRQP interop external |
| `TRQP3-DISC-*` | discovery distinct from authority; downgrade resistance | S21-05 capability, well-known and differential tests | covered-local; independent interop external |
| `TRQP3-PROF-*` | profiles strengthen core; conflicts fail closed | S21-09 profile composition and negotiation tests | covered-local |
| `TRQP3-REC-*` | recognition separation and non-transitivity | recognition/conformance tests; agentic non-transitivity vector | covered-local; positive propagation intentionally absent |
| `TRQP3-ERR-*` | processing/transport errors distinct from semantic negative | S21-09 transport tests; RFC 9457 boundary | covered-local |
| `TRQP3-SEC-*` | downgrade/replay/injection/substitution/scope broadening | adversarial negatives across conformance, S21 and agentic suites | covered-local |
| `TRQP3-PRIV-*` | minimization cannot broaden proposition | critical-context/minimization negatives | covered-local |
| `TRQP3-AUD-*` | reconstructable decision and agent replacement | agentic audit/replacement vectors; operational guidance | covered-local |
| `TRQP3-COMP-*` | explicit migration, no inferred compatibility | v2/candidate negotiation and migration tests | covered-local |

## Binding-scoped traceability rule

A binding-specific requirement family is additional to core TRQP conformance and MUST remain traceable to a binding specification, executable evidence, and an explicit external-interoperability boundary. Binding-local success MUST NOT be reported as independent interoperability with the external transport protocol.

## MUST accounting rule

A candidate MUST is accounted for only when it is represented by a stable requirement ID, has a normative prose location, has schema/wire disposition where applicable, and has positive/negative executable evidence or an explicit non-machine-testable rationale.

No requirement family above may remain `unmapped` in a publication-ready candidate. Independent external interoperability is not substituted with repository-local evidence and remains explicitly bounded.

## SHOULD accounting rule

Candidate SHOULD statements fall into two classes:

1. **Interoperability-affecting SHOULD** — must receive a stable requirement ID and executable evidence before publication readiness.
2. **Operational/governance SHOULD** — may be accounted for by an explicit rationale and guidance location when a deterministic protocol test would be artificial or misleading.

Automated validation MUST fail if an interoperability-affecting SHOULD is present only as prose without a traceable disposition.

## External evidence boundary

Repository-local differential tests demonstrate internal consistency between independently structured local paths; they are not independent organizational interoperability. The latter remains an explicit external evidence path and MUST NOT be represented as green merely because local CI succeeds.
