# Candidate Next TRQP Draft — Development Plan

Status: **downstream experimental / non-normative**  
Branch: `draft/next-trqp`  
Upstream repository: https://github.com/trustoverip/tswg-trust-registry-protocol  
Reference-implementation tracker: https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/issues/1  
Reference-implementation branch: https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/tree/feat/verification-material-reference

## Purpose

This branch is a specification workbench for exploring what a future TRQP draft could look like when proposed normative changes are backed by implementation, tests, interoperability evidence, and explicit upstream issue provenance.

It is **not** an upstream TRQP release, does not claim ToIP consensus, and must not be cited as normative TRQP. The current upstream specification remains authoritative.

No change from this branch should be promoted to this fork's `main` merely because it is drafted here. Promotion and any upstream contribution are separate governance decisions.

## Development discipline

Candidate requirements should be traceable through the following evidence chain wherever applicable:

```text
upstream issue / external interoperability pressure
                    |
                    v
             proposition
                    |
                    v
        reference implementation
                    |
          +---------+---------+
          |                   |
     positive tests     falsification tests
          |                   |
          +---------+---------+
                    |
                    v
        interoperability evidence
                    |
                    v
       candidate normative delta
```

Narrative convenience is not sufficient evidence for a new MUST/SHOULD requirement.

## Current upstream inputs

### Umbrella production-readiness proposal

https://github.com/trustoverip/tswg-trust-registry-protocol/issues/175

This issue supplies the broad release pressure: lifecycle, discovery, transport extensibility, credential integration, operational guidance, governance metadata, recognition semantics, and security profiles.

### Lifecycle and temporal semantics

https://github.com/trustoverip/tswg-trust-registry-protocol/issues/176

Candidate destination: core temporal evaluation semantics plus an optional lifecycle profile where ecosystem-specific state vocabulary is required.

Related implementation work: WP4–WP6 under https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/issues/1

### Endpoint discovery

https://github.com/trustoverip/tswg-trust-registry-protocol/issues/177

Candidate destination: discovery convention/profile, kept separate from core authorization and recognition semantics.

### Transport extensibility

https://github.com/trustoverip/tswg-trust-registry-protocol/issues/178

Candidate destination: clarify transport-independent core processing semantics and retain HTTPS/REST as a binding. Alternative bindings should not redefine the meaning of authorization or recognition.

### Credential ecosystem mapping

https://github.com/trustoverip/tswg-trust-registry-protocol/issues/179

Candidate destination: optional mapping profile / informative integration guidance. Credential status and proof mechanisms must not be conflated with TRQP authority statements.

### Operational guidance

https://github.com/trustoverip/tswg-trust-registry-protocol/issues/180

Candidate destination: explicitly non-normative operational appendix covering caching, rate limiting, observability, availability, audit logging, and related production concerns.

### Governance assurance profiles

https://github.com/trustoverip/tswg-trust-registry-protocol/issues/181

Candidate destination: optional baseline/high-assurance governance metadata profiles. Profile selection must not silently change core query semantics.

### Recognition semantics

https://github.com/trustoverip/tswg-trust-registry-protocol/issues/182

Candidate destination: strengthened recognition model, including relationship publication/evidence boundaries and lifecycle implications. Transitivity must not be assumed without explicit semantics and evidence.

### Security profiles

https://github.com/trustoverip/tswg-trust-registry-protocol/issues/183

Candidate destination: optional security profiles layered over stable protocol semantics. Authentication strength, replay resistance, key rotation, timestamping, and auditability are security posture choices unless they materially alter the decision proposition.

### Certificate/public-key identifiers

https://github.com/trustoverip/tswg-trust-registry-protocol/issues/194

This issue provides a concrete PKI pressure test and candidate content-addressed identifier direction. It also exposes an architectural question that this downstream work must test explicitly:

1. **material-as-principal** — the certificate/public key itself is the `entity_id`; and/or
2. **material-qualified principal** — `entity_id` remains the semantic principal and independently identified verification material narrows the decision.

These are different propositions and must not be conflated merely because both can be useful in PKI-backed trust registries.

## External interoperability inputs

Ayra trust-registry resource issue:
https://github.com/ayraforum/ayra-trust-registry-resources/issues/43

Ayra is treated as citable external evidence/pressure, not as normative TRQP authority and not as content to lift wholesale.

High Assurance Verifiable Identifiers WIP specification:
https://trustoverip.github.io/high-assurance-verifiable-identifiers/

HAVID is an architectural input supporting separation of independently governed identifier semantics and relationships. It is not treated as a substitute for TRQP authorization, recognition, critical-query handling, evidence completeness, or lifecycle semantics.

## Candidate specification architecture

The working hypothesis is:

```text
TRQP Core
├── concepts and decision propositions
├── authorization
├── recognition
├── identifier semantics
├── temporal evaluation
├── extension and capability semantics
├── result/evidence semantics
└── transport-independent processing

Bindings
└── HTTPS/REST

Profiles
├── lifecycle
├── PKI / certificate and public-key
├── governance baseline
├── governance high-assurance
├── security
└── credential ecosystem mapping

Discovery
└── endpoint/capability convention

Operational guidance
└── non-normative deployment appendix
```

This structure is provisional. Implementation evidence may invalidate it.

## Reference-implementation traceability

The implementation work is tracked at:
https://github.com/sankarshanmukhopadhyay/tswg-trust-registry-protocol/issues/1

Current work packets map to candidate draft questions as follows:

| Work packet | Evidence question | Candidate draft impact |
| --- | --- | --- |
| WP0 | What does current TRQP v2 actually require? | compatibility baseline |
| WP1 | Can principal and verification material remain independently represented? | concepts / identifier semantics |
| WP2 | Can authorization be safely bound to exact material? | authorization processing |
| WP3 | What happens when a decision-critical qualifier is unsupported? | extension/capability semantics |
| WP4 | How does material lifecycle affect only dependent decisions? | lifecycle profile/core invalidation rule |
| WP5 | How are negative, absent, stale, incomplete and unknown distinguished? | result/evidence semantics |
| WP6 | How is state evaluated at time T? | temporal semantics |
| WP7 | What is the smallest interoperable wire representation? | schemas/versioning/profile boundary |
| WP8 | Does independent interoperability evidence falsify the design? | conformance/evidence package |

## Candidate versioning question

Do **not** assign a final version number yet.

The key release question is whether safe support for decision-critical qualifiers and richer result/evidence semantics can be introduced compatibly within TRQP v2's current rule that unknown optional/context members are ignored. If safety requires changing that processing rule or otherwise changes how existing conformant endpoints handle valid queries, a major-version boundary may be warranted.

The reference implementation and WP3/WP7 compatibility evidence should decide this rather than naming the release first.

## Promotion gates

A candidate normative delta is ready for consideration only when:

- its authority/provenance is linked using full URLs;
- assumptions are explicit;
- implementation exists where executable behaviour is relevant;
- positive and negative/falsification tests exist;
- compatibility impact is recorded;
- interoperability evidence exists where practical;
- unresolved normative choices remain visible;
- relevant upstream issue disposition has been reconciled when available.

## Immediate sequence

1. Continue WP3 on `feat/verification-material-reference`.
2. Record WP3's candidate normative delta in this branch after its behaviour is tested.
3. Build a traceability register mapping candidate requirements to upstream issues and implementation evidence.
4. Repeat for WP4–WP8.
5. Only after the evidence package is coherent, assemble candidate specification prose/structure for review.
6. Do not merge this branch to `main` or propose it upstream without a separate explicit judgment.
