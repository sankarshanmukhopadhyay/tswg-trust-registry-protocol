# TRQP v3 requirements and feature-completeness ledger

Status: downstream release-control artifact; not upstream normative text.

This ledger is the release-accounting surface for candidate v3. An item is not complete merely because candidate prose exists: disposition, normative location, conformance evidence and authority state must be explicit.

## Disposition vocabulary

`retained` · `changed` · `superseded` · `removed-with-rationale` · `profile` · `deferred`

## Approved v2 baseline

| ID | v2 surface | v3 disposition | Candidate location | Evidence / next action |
|---|---|---|---|---|
| V2-CORE-01 | authority / authority statement model | retained+changed | §§3–9 | add stable requirement IDs |
| V2-CORE-02 | authorization statement/query | retained+changed | §§3–10 | exact proposition + evidence semantics already exercised |
| V2-CORE-03 | recognition statement/query | retained+changed | §14 | #38 release-blocking for deterministic non-transitivity boundary |
| V2-CORE-04 | delegation is an authority-statement type | retained-boundary | scope + agentic guide | TRQP may evaluate delegation-dependent propositions but does not define delegation instrument; #43 |
| V2-CORE-05 | TRQP consumer ↔ endpoint scope | retained | §§1,11–12 | agent requester does not change protocol role semantics |
| V2-CORE-06 | system of record out of scope | retained | §1 / scope firewall | preserve |
| V2-CORE-07 | bridge implementation out of scope | retained | §1 / binding docs | preserve while defining bridge semantic obligations |
| V2-CORE-08 | read-only query protocol | retained | §1 | lifecycle queries do not add update operations |
| V2-ID-01 | authority/entity identifiers | changed | §§3,7 + identifier profile | reconcile upstream #194; absolute URI vs URI-reference decision required |
| V2-API-01 | authorization request/response | changed | §§7–9 | candidate schema + conformance mapping required |
| V2-API-02 | recognition request/response | changed | §§7–9,14 | candidate schema + direct-recognition vectors required |
| V2-BIND-01 | HTTPS binding | retained+changed | §§11,15 | #39: preserve semantic/transport separation + RFC 9457 processing errors |
| V2-SCHEMA-01 | authorization request schema | changed | candidate schemas | schema must express critical context/version/profile/material qualification |
| V2-SCHEMA-02 | authorization response schema | changed | candidate schemas | schema must expose decision/reason/evidence state |
| V2-SCHEMA-03 | recognition request schema | changed | candidate schemas | direct recognition proposition must remain explicit |
| V2-SCHEMA-04 | recognition response schema | changed | candidate schemas | direct vs any future propagated result must be distinguishable |
| V2-CONF-01 | conformance obligations | superseded | §19 + requirement register | move to requirement-ID ↔ test coverage |
| V2-CONS-01 | security/privacy considerations | retained+strengthened | §§16–18 | add agentic downgrade/composition/race threats |
| V2-VERS-01 | versioning/compatibility | changed | §§10,20 | explicit no-silent-v2-fallback semantics |

## Upstream production-readiness backlog

| Upstream | Topic | v3 disposition | Release significance |
|---|---|---|---|
| #175 | production-readiness umbrella | superseded-by-ledger | every child dispositioned below |
| #176 | lifecycle/revocation/time-T semantics | changed/core | release-blocking; candidate §§4–5 already establish core temporal/evidence semantics |
| #177 | endpoint discovery | profile/experimental | core separation is release-blocking; `.well-known` binding remains experimental pending external interop (#35) |
| #178 | transport extensibility | retained-boundary | core must be transport-neutral; additional transports can remain post-v3 profiles if semantic binding contract is complete (#39) |
| #179 | credential ecosystem mapping | profile | non-core; document semantic boundary and examples, no new mandatory core behaviour |
| #180 | operational guidance | informative | required documentation for RC, not protocol semantics |
| #181 | governance metadata profiles | profile | profiles may strengthen but never redefine proposition/core semantics |
| #182 | recognition modeling/proofs | changed/core | direct recognition semantics and non-transitivity are release-blocking (#38) |
| #183 | security profiles | profile | profile composition/strengthening rules release-blocking; concrete profile catalogue may remain optional |
| #194 | certificate/public-key identifiers | profile+core-clarification | identifier syntax/comparison boundary release-blocking; PKI-specific canonicalization may be companion profile |

## Section 21 release classification

| S21 | Issue | Release classification |
|---|---|---|
| S21-01 | #31 | authority-dependent; downstream recommendation required |
| S21-02 | #32 | release-blocking wire contract |
| S21-03 | #33 | release-blocking critical-context contract |
| S21-04 | #34 | release-blocking decision vocabulary |
| S21-05 | #35 | core separation release-blocking; concrete discovery binding may remain experimental |
| S21-06 | #36 | release-blocking migration semantics; final upstream mechanism authority-dependent |
| S21-07 | #37 | release-blocking evidence vocabulary |
| S21-08 | #38 | direct recognition + non-transitivity release-blocking; positive propagation MAY be deferred |
| S21-09 | #39 | transport-neutral semantic binding contract release-blocking; additional production transports MAY be deferred |

## Agentic stress overlay

Every core requirement touching subject, authority, context, time, evidence, recognition, discovery or profiles MUST be tested against autonomous-agent participation. Agentic stress does not create a separate wire protocol.

Required separations:

```text
agent != controller/operator != principal/delegator
capability != authorization
recognition != authorization
discovery != authority
delegation evidence != transaction authorization
component validity != composition validity
```

Tracked by #43.

## Release accounting rule

A row may be marked complete only when:

```yaml
disposition: explicit
candidate_text: present
normative_requirement_ids: assigned-if-normative
schema_impact: reconciled
tests: linked-if-testable
agentic_stress: evaluated-if-applicable
authority_state: explicit
```
