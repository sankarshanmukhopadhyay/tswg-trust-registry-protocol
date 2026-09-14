# TRQP v3 candidate requirement-to-test traceability

**Status:** downstream release-control artifact. This register does not claim upstream adoption or independent interoperability.

The stable candidate requirement IDs are defined in `NORMATIVE-REQUIREMENTS.md`. This register binds each requirement family to repository-local executable evidence and identifies external evidence boundaries.

| Requirement family | Candidate concern | Primary executable evidence | RC status |
|---|---|---|---|
| `TRQP3-PROP-*` | exact bounded proposition | WP executable-model/conformance tests; agentic exact-scope vectors | covered-local |
| `TRQP3-MAT-*` | principal/material separation and exact material binding | WP2 material-bound evaluation; lifecycle vectors | covered-local |
| `TRQP3-CTX-*` | decision-critical context | WP7 candidate wire/schema tests; WP9 negotiation negatives | covered-local |
| `TRQP3-LIFE-*` | revocation, expiry, supersession, historical evaluation | lifecycle/reference-model tests; agentic historical vectors | covered-local |
| `TRQP3-EVID-*` | evidence authority/completeness/freshness/conflict | WP5 evidence semantics/sufficiency tests | covered-local |
| `TRQP3-DEC-*` | positive/negative/indeterminate/not-applicable | WP7/WP8 conformance evidence | covered-local |
| `TRQP3-REQ-*` | malformed/contradictory critical declarations | WP7 wire/schema; WP9 negotiation negatives | covered-local |
| `TRQP3-EVAL-*` | exact evaluation and uncertainty preservation | executable reference model | covered-local |
| `TRQP3-RESP-*` | semantic response interpretation | WP7 response/wire; WP8 conformance | covered-local |
| `TRQP3-NEG-*` | candidate negotiation and no silent v2 fallback | WP9 negotiation/migration tests | covered-local |
| `TRQP3-BIND-*` | transport binding invariants | S21-09 transport/profile boundary tests | covered-local |
| `TRQP3-DISC-*` | discovery distinct from authority; downgrade resistance | S21-05 capability, well-known and differential tests | covered-local; independent interop external |
| `TRQP3-PROF-*` | profiles strengthen core; conflicts fail closed | S21-09 profile composition; negotiation tests | covered-local |
| `TRQP3-REC-*` | recognition separation and non-transitivity | recognition/conformance tests; agentic non-transitivity vector | covered-local; positive propagation intentionally absent |
| `TRQP3-ERR-*` | processing/transport errors distinct from semantic negative | S21-09 transport tests; RFC 9457 boundary | covered-local |
| `TRQP3-SEC-*` | downgrade/replay/injection/substitution/scope broadening | adversarial negatives across WP/S21/agentic suites | covered-local |
| `TRQP3-PRIV-*` | minimization cannot broaden proposition | critical-context/minimization negatives | covered-local |
| `TRQP3-AUD-*` | reconstructable decision and agent replacement | agentic audit/replacement vectors; operational guidance | covered-local |
| `TRQP3-COMP-*` | explicit migration, no inferred compatibility | WP9 v2/candidate negotiation and migration tests | covered-local |

## MUST accounting rule

A candidate MUST is release-accounted only when it is represented by a stable requirement ID, has a normative prose location, has schema/wire disposition where applicable, and has positive/negative executable evidence or an explicit non-machine-testable rationale.

For RC, no requirement family above may remain `unmapped`. Independent external interoperability is not substituted with repository-local evidence and remains explicitly bounded under G4.

## SHOULD accounting rule

Candidate SHOULD statements fall into two classes:

1. **Interoperability-affecting SHOULD** — must receive a stable requirement ID and executable evidence before RC.
2. **Operational/governance SHOULD** — may be release-accounted by an explicit rationale and guidance location when a deterministic protocol test would be artificial or misleading.

The final RC validation pass MUST fail if an interoperability-affecting SHOULD is present only as prose without a traceable disposition.

## External evidence boundary

Repository-local differential tests demonstrate internal consistency between independently structured local paths; they are not independent organizational interoperability. The latter remains an explicit external evidence path and MUST NOT be represented as green merely because local CI succeeds.