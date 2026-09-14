# Migrating from approved TRQP v2 to downstream candidate v3

Status: informative downstream guide. Candidate v3 is not an adopted Trust Over IP specification.

## Executive migration rule

Candidate v3 is a semantic breaking change where a relying decision depends on context, verification material, evidence sufficiency, historical state, profiles or other dimensions that generic v2 processing may not understand. A candidate request MUST NOT be sent to a v2 processor under an assumption that syntactic acceptance means semantic compatibility.

## What remains stable

TRQP remains a read-oriented trust-registry query/evaluation protocol. Systems of record, registry update operations, agent messaging, delegation credentials, payment authorization and workflow orchestration remain outside core scope.

## Material changes

| Area | v2 baseline | Candidate v3 |
|---|---|---|
| proposition | authority/entity/action/resource oriented | exact bounded proposition may include material, time and critical context |
| result | authorization/recognition result | explicit positive / authoritative-negative / indeterminate / not-applicable semantics |
| absence | implementation-dependent risk | authoritative negative only from authoritative complete evidence |
| verification material | not first-class in approved request schemas | independently evaluated when decision-critical |
| history | limited explicit semantics | effective-dated evidence; current state not projected backward |
| unknown context | may be ignored under legacy extensibility | declared critical context cannot be silently ignored |
| profiles/version | legacy version handling | processing contract must establish required semantics before evaluation |
| discovery | endpoint concern | explicitly separated from authority/recognition; experimental binding remains non-core |
| recognition | direct query | explicit non-transitivity unless an authoritative propagation rule exists |
| errors | transport/application conventions | processing errors remain separate from semantic negative; HTTP binding should use Problem Details |

## Migration sequence

1. Inventory each relying decision and identify all decision-critical dimensions.
2. Classify existing v2 calls that are genuinely expressible without candidate semantics; those may remain v2.
3. For candidate-dependent calls, negotiate candidate version/profile/critical-context support before evaluation.
4. Do not downgrade a candidate-dependent call to generic v2.
5. Update consumers to process semantic decision class and reason, not HTTP success or record absence.
6. Preserve evidence/provenance sufficient for audit, historical reconstruction and redress.
7. Validate against the candidate conformance corpus before claiming candidate-v3 compatibility.

## Agentic systems

Autonomous participation does not change the migration rule. Agent identity, capability and externally supplied delegation evidence MUST NOT be collapsed into transaction authorization. An agent-dependent proposition should be migrated only when all decision-critical scope/action/resource/time/evidence dimensions can be preserved end to end.

## Compatibility claim

A product should claim only the processing level it has demonstrated. `v2 compatible`, `candidate-v3 parser`, and `candidate-v3 conformant` are materially different claims. Parsing candidate fields without enforcing their mandatory semantics is not candidate-v3 conformance.