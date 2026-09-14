# Trust Registry Query Protocol — Candidate v3

## Abstract

The Trust Registry Query Protocol (TRQP) enables a relying party to evaluate a bounded proposition against trust-registry evidence. This downstream candidate extends the approved v2 processing model so that implementations can preserve the exact decision boundary when authorization or recognition depends on verification material, authority, action, resource, evaluation time, decision-critical context, evidence sufficiency, profiles, or externally defined delegated authority.

The candidate preserves a strict distinction between semantic decision state and transport or processing state. It also defines fail-closed handling for unsupported critical semantics, explicit evidence sufficiency, historical evaluation, direct recognition, profile composition, downgrade resistance, and agentic use. TRQP remains a read-only query/evaluation protocol; it does not become an agent protocol, delegation protocol, payment protocol, or workflow engine.

## Status of this document

**Status:** complete downstream release-candidate proposal; not an adopted Trust Over IP specification.

**Authority boundary:** this document is the normative specification for the downstream v3 candidate carried on `draft/next-trqp`. It does not modify the authority of the approved v2 specification, and the name “v3” remains a downstream working designation until upstream disposition. Supporting traceability, test, reconciliation, and development-evidence artifacts are assurance material. An implementer MUST NOT need them to reconstruct normative candidate behavior.

The stable downstream line remains `main` with approved v2. Completion of this branch does not imply promotion to `main`. Any upstream contribution, adoption, or future downstream replacement of the stable line is a separate governance decision.

## 1. Scope

TRQP provides a machine-processable means to evaluate a bounded trust-registry proposition. A bounded proposition is the exact claim a relying party needs resolved, including all dimensions that can materially change the answer. Depending on the use case, those dimensions can include a semantic principal, authority scope, action, resource, verification material, evaluation time, required profile, and additional decision-critical context.

The central design problem addressed by this candidate is semantic broadening. A legacy or incomplete implementation can appear interoperable at the syntax or transport layer while silently evaluating a broader proposition than the requester intended. For example, dropping a verification-material qualifier can turn “is this principal authorized using this exact key?” into “is this principal authorized at all?”; dropping a resource can turn a resource-bounded authorization into an unbounded one; and projecting current state backwards can fabricate historical certainty. This candidate makes those distinctions explicit and testable.

TRQP remains a read-only trust-registry query/evaluation protocol. It does not define agent messaging, delegation credentials, workflow authorization, payment, contract formation, registry mutation, or agent lifecycle. External evidence about those matters MAY be evaluated as part of a bounded registry proposition without transferring their protocol semantics into TRQP.

The protocol distinguishes semantic decision state from transport state. A successful transport exchange is not evidence of a positive trust decision, and a transport failure is not authoritative evidence of a negative trust decision.

### 1.1 Design goals

The candidate is designed to:

- preserve the exact proposition across discovery, transport, evaluation, caching, and audit;
- prevent silent semantic downgrade or broadening;
- distinguish authoritative negative results from uncertainty or lack of evidence;
- allow verification material and principal identity to have independent lifecycle;
- support historical evaluation using effective-dated evidence rather than current-state inference;
- keep discovery, capability, recognition, authorization, and transport identity separate;
- remain transport-neutral at the semantic core while supporting concrete bindings;
- make conformance machine-verifiable wherever practical; and
- remain safe when a requester, subject, delegate, controller, or relying party is an autonomous agent.

### 1.2 Non-goals

This specification does not:

- define how trust registries are populated or governed;
- define delegation or authorization credentials;
- define agent-to-agent messaging or workflow protocols;
- define positive recognition transitivity or trust-path inference;
- define payment or transaction execution;
- require a specific discovery transport for the core protocol; or
- claim independent organizational interoperability solely from repository-local tests.

### 1.3 Relationship to approved v2

Approved v2 remains the stable baseline under `specification/v2-approved/`. Candidate v3 is a semantic breaking change when correct processing depends on dimensions that a generic v2 peer may parse, ignore, or fail to enforce. Syntactic acceptance by a legacy implementation is therefore not proof of semantic compatibility.

The migration principle is explicit negotiation: a candidate-critical request is processed as candidate v3 only after the required version, profiles, and decision-critical semantics have been established. It is never silently rewritten into a broader v2 query.

### 1.4 Terminology

For this document:

- **Authority**: the registry, governance, or trust scope against which a proposition is evaluated. Authority identity is semantic and MUST NOT be inferred solely from an endpoint URI.
- **Binding**: a mapping between transport constructs and TRQP semantic requests, responses, and processing failures. A binding carries semantics; it does not create or weaken them.
- **Consumer / relying party**: the party that constructs a proposition and relies on the resulting semantic decision.
- **Decision-critical context**: request context whose omission, alteration, or unsupported interpretation can materially change the proposition or result. Decision-critical context cannot be silently ignored.
- **Evidence**: information used to establish or refute a proposition, together with the authority, completeness, freshness, temporal coverage, integrity, and provenance needed to interpret it.
- **Evidence state**: the sufficiency or quality classification of available evidence, independent of the final semantic decision.
- **Principal**: the semantic subject whose trust-registry state is being evaluated. A principal is not automatically identical to a runtime agent, endpoint, controller, key, or certificate.
- **Processing contract**: the established set of candidate semantics, version, profiles, and decision-critical capabilities that both sides rely on for evaluation.
- **Profile**: a named set of additional obligations that may strengthen core processing without weakening or redefining mandatory core semantics.
- **Proposition**: the exact bounded statement being evaluated, including every decision-relevant dimension.
- **Recognition**: an explicitly scoped relationship that one authority or actor directly recognizes another for the applicable rule. Recognition is distinct from authorization and verification-material validity.
- **Semantic decision**: a protocol-level conclusion about the proposition: `positive`, `negative`, `indeterminate`, or `not-applicable`.
- **Transport / processing failure**: failure to carry, validate, negotiate, or evaluate a request. It is not a semantic negative result.
- **Verification material**: a key, certificate, identifier, or other cryptographic/verification reference whose applicability may be independently governed from the principal.

### 1.5 Architecture and roles

A typical TRQP interaction involves four logical roles, which MAY be co-located:

1. a **consumer/relying party** that formulates the proposition;
2. a **processor/endpoint** that validates the processing contract and evaluates the proposition;
3. an **authority/evidence source** that supplies authoritative trust-registry evidence; and
4. a **binding/discovery layer** that locates and carries requests and responses.

Implementations MUST preserve the semantic boundaries among those roles. In particular, contacting an endpoint does not establish that endpoint as the semantic authority; discovering a capability does not establish transaction authorization; and obtaining an HTTP success response does not establish a positive trust decision.

## 2. Conformance language and targets

The key words **MUST**, **MUST NOT**, **REQUIRED**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **RECOMMENDED**, **NOT RECOMMENDED**, **MAY**, and **OPTIONAL** in this document are to be interpreted as described in BCP 14, RFC 2119 and RFC 8174, when, and only when, they appear in all capitals.

Conformance to this candidate does not imply conformance to any future upstream major version unless upstream adopts equivalent requirements.

Candidate conformance targets are:

- **TRQP Processor/Endpoint** — accepts and evaluates bounded candidate propositions;
- **TRQP Consumer/Relying Party** — constructs candidate requests and interprets semantic results;
- **TRQP Binding** — carries semantic requests, responses and processing failures without changing their meaning; and
- **TRQP Profile** — strengthens processing obligations without weakening or redefining mandatory core semantics.

A conformance claim SHOULD name its target and candidate version/profile. “Parses v3 fields” is not equivalent to “conforms to candidate v3 processing semantics.”

## 3. Semantic model

### 3.1 Proposition

A TRQP evaluation operates on a proposition whose decision-relevant dimensions may include:

- semantic principal;
- verification material;
- authority or trust-registry scope;
- requested action;
- requested resource;
- evaluation time; and
- additional declared decision-critical context.

A processor **MUST** resolve the proposition it is evaluating before producing an authoritative decision. It **MUST NOT** silently remove a decision-critical dimension when doing so broadens or otherwise changes the proposition. [`TRQP3-PROP-001`, `TRQP3-PROP-002`]

For implementation purposes, the proposition should be treated as an immutable decision envelope. Internal services MAY normalize or enrich it, but externally observable semantics MUST remain bound to the same principal, authority, action, resource, material, time, and critical context. If any of those dimensions changes, the processor is evaluating a different proposition and MUST re-evaluate rather than reuse a prior result without an explicit equivalence rule.

### 3.2 Principal and verification material

A semantic principal and verification material associated with that principal **MUST** be independently representable and independently governable. [`TRQP3-MAT-001`]

Recognition, registration or other positive state concerning a principal **MUST NOT** imply that every associated key, certificate, identifier or other verification material is current, valid, authorized or applicable. [`TRQP3-MAT-002`]

Where a request is qualified by verification material, evaluation **MUST** bind the decision to the exact principal/material/authority/action/resource proposition. A material mismatch **MUST NOT** fall back to a principal-only positive result. [`TRQP3-MAT-003`]

This separation is essential during rotation, revocation, supersession, compromise recovery, or migration between cryptographic systems. A principal may remain recognized while one key is revoked and another becomes current. Conversely, valid cryptographic material does not establish that the principal is authorized for a requested action or resource.

### 3.3 Decision-critical context

A requester **MAY** declare context members as decision-critical. A processor **MUST** either evaluate every supported decision-critical member according to the negotiated processing contract or terminate candidate processing with a non-positive/indeterminate result as appropriate. Unsupported critical semantics **MUST NOT** be ignored when ignoring them could broaden the proposition or produce a positive result. [`TRQP3-CTX-001`, `TRQP3-SEC-002`]

Unknown optional context that is not declared decision-critical **MAY** be handled according to the applicable negotiated profile or binding.

Decision-critical context is deliberately explicit because extensible request formats create a downgrade hazard. A peer that accepts unknown JSON members but ignores their meaning is not candidate-capable for a request that declares those members critical.

## 4. Lifecycle and invalidation

Principal, authorization/recognition relationship and verification-material lifecycle are independent decision inputs unless an applicable governance rule explicitly binds them.

Verification-material state **MUST** be evaluated independently from principal state. Revoked, expired, superseded or inapplicable material **MUST** invalidate a material-dependent positive decision without automatically revoking the principal. [`TRQP3-LIFE-001`]

Current state **MUST NOT** be projected backwards to answer a historical query. Historical evaluation **MUST** use authoritative effective-dated evidence applicable to the requested evaluation time. [`TRQP3-LIFE-002`]

If evidence sufficient to establish historical state is missing, conflicting, stale for the requested period or incomplete, the processor **MUST** return `indeterminate` rather than manufacture historical certainty. [`TRQP3-LIFE-003`]

A conforming implementation therefore needs a lifecycle model capable of answering “what was true at time T?” separately from “what is true now?”. A revocation at T2 does not by itself prove that the material was invalid at T1; similarly, evidence of current validity does not prove historical validity if the relevant historical interval cannot be established.

## 5. Evidence semantics

### 5.1 Evidence sufficiency

Before interpreting evidence or absence, a processor **MUST** assess, where relevant, source authority, scope applicability, completeness, freshness, temporal coverage, integrity/provenance and conflict with other decision-relevant evidence. [`TRQP3-EVID-001`]

Incomplete, non-authoritative, stale, unavailable, conflicting or otherwise insufficient evidence **MUST NOT** be collapsed into either a positive result or an authoritative negative. [`TRQP3-EVID-002`]

Candidate evidence-state vocabulary is: `sufficient`, `incomplete`, `stale`, `unavailable`, `non-authoritative`, `conflicting`, and `unknown`. Evidence state is orthogonal to semantic decision state. `sufficient` evidence does not itself imply a positive result.

Evidence sufficiency is a property of the evidence set relative to the exact proposition. A source can be authoritative for one scope and non-authoritative for another; complete for current state and incomplete for historical state; or fresh enough for one relying decision and too stale for another. Deployments therefore SHOULD make authority, completeness, freshness, and temporal coverage explicit governance inputs rather than hidden implementation assumptions.

### 5.2 Absence

Absence **MAY** support an authoritative negative only when the evidence source is authoritative and complete for the evaluated scope and temporally sufficient for the requested evaluation. Record absence from an incomplete, stale, unavailable or non-authoritative source **MUST** yield `indeterminate`. [`TRQP3-EVID-003`]

This rule prevents a common failure mode: “not found” is not equivalent to “known false.” A timeout, stale cache, partial registry, or unauthorized mirror cannot establish authoritative absence.

### 5.3 Not applicable

A `not-applicable` outcome is semantically distinct from both authoritative negative and indeterminate evidence. Implementations **MUST** preserve that distinction in machine-actionable results.

For example, a rule may not govern the requested resource class at all. That is different from a governed resource for which authoritative evidence establishes that the principal is not authorized, and different again from a governed resource for which evidence is insufficient.

## 6. Decision model

A conforming implementation **MUST** expose enough machine-actionable information to distinguish:

- **positive** — sufficient authoritative evidence supports the exact proposition;
- **negative** — sufficient authoritative evidence establishes that the exact proposition is not satisfied;
- **indeterminate** — the proposition cannot be authoritatively resolved from available evidence or processing capability; and
- **not-applicable** — the requested proposition does not apply under the evaluated scope or rule.

[`TRQP3-DEC-001`]

A result **SHOULD** include stable reason information sufficient to distinguish material mismatch, revocation, expiry, supersession, unsupported decision-critical context, incomplete evidence, stale evidence, unavailable evidence, conflicting evidence and insufficient historical evidence where applicable.

Consumers **MUST NOT** infer semantic decision class solely from HTTP status, transport success or record absence. [`TRQP3-DEC-002`]

Applications SHOULD branch on the semantic decision first and reason second. A boolean authorization field, where present for compatibility or convenience, is not an adequate replacement for the semantic decision because `false`, `indeterminate`, and `not-applicable` have materially different relying-party consequences.

## 7. Request contract

A candidate request contract **MUST** be capable of representing, without semantic loss:

1. candidate version/processing contract;
2. semantic principal/entity;
3. authority scope;
4. action and resource where applicable;
5. verification-material qualification where applicable;
6. evaluation time where applicable;
7. context values;
8. the set of decision-critical context members; and
9. required processing profiles.

Proposal-grade executable schemas are maintained under `development/verification-material/schemas/` and are discoverable from `specification/v3/schemas/`. Final upstream member spelling and schema identifiers remain upstream authority; implementations of this downstream candidate **MUST** preserve the semantics above even if experimental serialization evolves.

A processor **MUST** validate the request before evaluation. Malformed or internally contradictory critical declarations **MUST NOT** be repaired by silently dropping the affected condition. [`TRQP3-REQ-001`]

The candidate HTTP realization and field-level parameter semantics are documented in `API.md` and `openapi.yaml`. Those artifacts define a downstream binding convention, while this document remains the source of normative protocol semantics.

## 8. Evaluation algorithm

A conforming candidate processor **MUST** implement behavior equivalent to these ordered obligations:

1. resolve the requested proposition and all decision-critical dimensions;
2. establish that the negotiated processing contract supports those dimensions;
3. resolve applicable principal, relationship and verification-material lifecycle state;
4. determine the evidence authority, completeness, freshness and temporal sufficiency needed for the proposition;
5. evaluate the exact proposition without broadening it through fallback;
6. preserve uncertainty when evidence or processing capability is insufficient;
7. return a machine-actionable semantic decision and reason information; and
8. preserve enough provenance to audit why the result was produced.

Processing order **MAY** differ internally if externally observable semantics are equivalent and fail closed at the same decision boundaries. [`TRQP3-EVAL-001`]

A useful implementation decomposition is validation → negotiation → evidence resolution → lifecycle resolution → semantic evaluation → decision construction → audit capture. Implementations MAY combine stages internally, but SHOULD keep their failure classes distinguishable so that an unsupported processing contract cannot be misreported as an authoritative semantic negative.

## 9. Response contract

A candidate response contract **MUST** be capable of representing, without semantic loss:

- semantic decision class;
- machine-actionable reason;
- evaluated proposition or stable binding to it;
- evaluation time;
- evidence state;
- relevant evidence/provenance/authority/completeness information where disclosure is permitted; and
- processing/profile/version information required to interpret the result.

A relying party **MUST** evaluate the semantic decision class and **MUST NOT** equate transport-level success with a positive decision. [`TRQP3-RESP-001`]

Evidence references **SHOULD** be minimized to what is necessary for verification, audit and redress; implementations **SHOULD** avoid exposing unnecessary authority, relationship or correlating information.

A response SHOULD contain enough stable information to let a relying party reproduce the decision boundary it relied on. Where privacy or policy prevents disclosure of raw evidence, the response MAY instead carry bounded references, digests, or provenance statements sufficient for authorized audit and redress.

## 10. Negotiation and migration

Candidate semantics are not transparently compatible with generic v2 processing when a request contains a decision-critical condition that a v2 peer may ignore as unknown optional context.

Before candidate evaluation, peers **MUST** establish a processing contract confirming support for the candidate semantics/version, all required profiles and their mandatory processing semantics, and every decision-critical context member in the request. A profile identifier alone is insufficient. [`TRQP3-NEG-001`]

If any required processing obligation cannot be established, candidate processing **MUST** terminate non-positively before semantic evaluation. A candidate request **MUST NOT** silently fall back to generic v2 processing. A v2-only peer **MUST NOT** be treated as satisfying candidate semantics merely because it can parse or accept the request. [`TRQP3-NEG-002`, `TRQP3-COMP-001`]

For migration:

- v2-only peer + candidate-critical request → explicit unsupported/processing failure; no candidate evaluation;
- candidate-only peer + v2 request → process only under an explicitly supported compatibility contract;
- dual-capability peers → negotiate the candidate contract before sending/evaluating candidate-critical semantics; and
- failed or ambiguous negotiation → no silent generic-v2 fallback.

A distinct major version is the downstream-preferred signaling mechanism because these are breaking processing semantics. An equivalently mandatory, non-ignorable profile is safe only if its obligations are proven before evaluation. Final upstream version/profile naming remains upstream authority.

The migration guide in `guides/MIGRATION-FROM-V2.md` provides deployment sequencing and compatibility claim guidance.

## 11. Transport and binding boundary

Candidate core semantics are transport-neutral. A binding maps semantic requests, responses and processing failures to transport constructs without changing their meaning.

A conforming binding **MUST NOT** create semantic meaning, drop decision-critical context, rewrite evaluation time or semantic scope, or confuse endpoint identity with principal, registry or authority identity. Transport success **MUST NOT** create a positive semantic decision; transport not-found, timeout or unavailability **MUST NOT** create an authoritative negative. [`TRQP3-BIND-001`]

Where HTTP is used, processing failures **SHOULD** use RFC 9457 Problem Details unless the applicable binding defines another representation. Problem Details represents processing failure, not a semantic negative.

Selection/adoption of production bindings beyond approved v2 remains an upstream/external interoperability matter; the semantic boundary above is normative for this candidate.

The candidate HTTP binding in `API.md` uses `POST /trqp/v3/query` as a downstream convention. Implementers MUST NOT interpret that path as an adopted upstream endpoint identifier.

## 12. Endpoint and capability discovery

Discovery identifies where a service can be contacted and what processing capabilities it claims. Discovery **MUST** remain distinct from semantic authorization, recognition and trust-registry membership. [`TRQP3-DISC-001`]

A capability declaration used to admit candidate processing **SHOULD** identify the service/registry, supported protocol versions, supported profiles, mandatory processing semantics, supported decision-critical context and sufficient authority/freshness information to validate the declaration.

Unavailable, stale, conflicting or unauthorized capability metadata **MUST NOT** trigger generic-v2 downgrade for a candidate request. [`TRQP3-DISC-002`]

Endpoint movement **SHOULD** be possible without changing semantic principal, registry or authority identity.

The downstream candidate defines a transport-independent capability contract and includes an experimental HTTPS `.well-known` binding as executable evidence. No single discovery transport is required by core candidate semantics; final production discovery binding is an upstream/profile decision.

Discovery data is security-sensitive configuration. Implementations SHOULD validate publisher authority, freshness, service identity, supported processing semantics, and conflict state before using capability metadata to admit a candidate request.

## 13. Governance and security profiles

A profile **MAY** strengthen evidence, governance, security, cryptographic or operational requirements. A profile **MUST NOT** silently redefine proposition identity or weaken mandatory core processing semantics. [`TRQP3-PROF-001`]

Profile selection **MUST NOT** permit ignoring decision-critical context, collapsing indeterminate evidence into authoritative negative, weakening exact material binding, or changing semantic scope merely to obtain a positive result.

Where multiple profiles apply, mandatory obligations **MUST** be jointly satisfiable. Conflicting mandatory obligations **MUST** fail closed before evaluation. [`TRQP3-PROF-002`]

Profile authority, lifecycle and versioning are governance/profile responsibilities unless a future adopted core specification further constrains them.

Profiles SHOULD document their authority, version, lifecycle, mandatory semantics, additional context fields, evidence requirements, and conformance expectations. A profile name without those semantics is not sufficient negotiation evidence.

## 14. Recognition

Recognition is an explicitly scoped relationship supported by evidence and lifecycle. Recognition **MUST** remain distinct from authorization, verification-material validity and endpoint discovery. [`TRQP3-REC-001`]

Core candidate behavior is **direct recognition only**. Absent an explicit propagation rule with sufficient authority, evidence, scope, lifecycle and path constraints, `A recognizes B` and `B recognizes C` **MUST NOT** imply `A recognizes C`. Graph reachability, cycles, shared profile membership, endpoint co-location or material validity **MUST NOT** manufacture recognition. [`TRQP3-REC-002`]

Positive recognition propagation is intentionally outside the RC core and requires separate future normative and interoperability evidence.

This direct-only rule is deliberately conservative. A graph algorithm can prove reachability, but reachability alone does not prove that the recognizing authority intended its recognition to transitively confer status on another actor.

## 15. Error semantics

Processing and transport failures **MUST** remain distinguishable from semantic negative decisions. [`TRQP3-ERR-001`]

Where HTTP is used, materially revised error responses **SHOULD** use RFC 9457 Problem Details unless the binding defines another representation. Problem `type` identifiers and machine-readable extensions **SHOULD** be stable; clients **MUST NOT** depend on parsing human-readable detail.

Error representations **MUST** be assessed for privacy, correlation and authority-information leakage. A transport or processing error **MUST NOT** be converted into authoritative evidence that the queried proposition is false.

Typical processing failures include malformed requests, unsupported critical context, failed version/profile negotiation, conflicting mandatory profiles, and unavailable required services. Those failures occur before or outside authoritative semantic resolution and therefore MUST remain distinguishable from a `negative` decision.

## 16. Security considerations

TRQP sits on a decision boundary: incorrect broadening can cause a relying system to grant authority, recognition, or access that the evidence does not support. Implementations therefore **MUST** protect against semantic downgrade, stale evidence replay, unauthorized evidence injection, verification-material substitution and scope broadening. [`TRQP3-SEC-001`]

Negotiation and discovery inputs are security-sensitive. Removal of a decision-critical condition, substitution of a weaker profile, stale capability metadata or forced legacy fallback can cause evaluation of a materially broader proposition. Unknown or unsupported critical semantics **MUST** fail closed. [`TRQP3-SEC-002`]

Implementations **SHOULD** bind decisions to the exact evaluated proposition and retain sufficient audit evidence to demonstrate that binding.

### 16.1 Threat classes

Implementers SHOULD explicitly test at least the following threats:

- **semantic downgrade** — a candidate request is re-issued under v2 or a weaker profile after negotiation failure;
- **qualifier stripping** — material, resource, action, time, or critical context is removed before evaluation;
- **verification-material substitution** — a valid key for the wrong principal or lifecycle interval is accepted;
- **evidence replay** — stale but formerly valid evidence is reused after revocation or supersession;
- **evidence poisoning** — an unauthorized or non-authoritative publisher injects apparently valid registry evidence;
- **confused authority** — endpoint identity, service discovery metadata, or capability publication is mistaken for semantic authority;
- **false composition** — individually valid identity, capability, recognition, or delegation components are composed into transaction authority not granted by any authoritative rule; and
- **historical rewriting** — current revocation or replacement state is projected backwards and changes historical attribution.

### 16.2 Agentic systems

Autonomous agents increase the risk of confused-deputy and false-composition failures because identity, capability, delegation evidence, and transaction authority can all be machine-readable and individually valid. A processor MUST still evaluate the exact represented principal, agent where applicable, action, resource, scope, time, and external delegation evidence. Agent replacement or endpoint movement MUST NOT rewrite historical attribution.

## 17. Privacy considerations

TRQP queries and evidence may reveal relationships, identifiers, authority structures, resource interests or historical activity. Implementations **SHOULD** minimize disclosed query context and evidence to what is necessary for the relying decision.

Historical and lifecycle surfaces **SHOULD** avoid exposing unnecessary event history when a bounded proof of current or historical state is sufficient. Discovery, evidence and error surfaces **SHOULD** be reviewed for stable correlators and cross-context linkability.

Privacy minimization **MUST NOT** be implemented by dropping a decision-critical condition and evaluating a broader proposition. [`TRQP3-PRIV-001`]

### 17.1 Privacy threat classes

Implementers SHOULD consider:

- correlation through stable principal, agent, evidence, or capability identifiers;
- leakage of protected relationships through recognition or delegation context;
- disclosure of registry topology or authority structure through errors;
- excessive historical disclosure when only a bounded state proof is required;
- cross-context reuse of evidence identifiers; and
- audit records that retain more contextual data than required for redress.

Privacy-preserving deployments MAY use opaque references, selective disclosure, protected evidence channels, or other privacy-enhancing mechanisms, provided they preserve every decision-critical semantic dimension required for correct evaluation.

## 18. Auditability, redress and agent replacement

A decision-producing implementation **SHOULD** retain or be capable of producing evidence sufficient to establish the proposition evaluated, evaluation time, processing contract/profile, material lifecycle state, evidence authority/completeness/freshness judgment, semantic decision/reason and relevant supersession/revocation state. [`TRQP3-AUD-001`]

Audit evidence **SHOULD** support correction, challenge and re-evaluation without disclosure of unrelated registry information.

Where an autonomous agent participates, audit evidence **SHOULD** preserve a stable binding among runtime agent identity, represented principal/controller where relevant, exact external delegation evidence, bounded proposition and evaluation time. Agent or endpoint replacement **MUST NOT** rewrite historical attribution or semantic identity.

A useful audit record is not merely a copy of the response. It should allow an authorized reviewer to answer: what exact proposition was evaluated, under which processing contract, against which authoritative evidence, at what time, and why did the implementation choose this decision class and reason?

## 19. Agentic-system use and composition boundary

TRQP semantics are unchanged when consumers, subjects or relying parties are autonomous agents. Agent identity **MUST NOT** be equated with operator/controller/principal identity. Capability advertisement **MUST NOT** be interpreted as authorization. Component-level validity — including identity, key validity, recognition, capability or delegation evidence — **MUST NOT** by composition manufacture transaction authority.

External delegation evidence may be decision-critical context, but TRQP does not define the delegation instrument. A material change to delegated action, resource, scope, time, onward-delegation permission or relationship state changes the proposition and **MUST** be re-evaluated rather than inferred from a prior positive.

For agentic B2C, C2B, or C2C use, an implementation SHOULD be able to distinguish at least: runtime agent, represented principal/controller, semantic authority, verification material, delegation evidence, action, resource, and evaluation time. The exact representation may be profile-defined, but the distinctions cannot be erased if they are decision-critical.

## 20. Conformance requirements

Candidate conformance is claim-based. A conforming implementation **MUST** demonstrate, through tests or equivalent machine-verifiable evidence, at least that:

1. principal/material mismatch cannot fall back to principal-only positive;
2. revoked/expired/superseded material cannot produce a material-dependent positive;
3. unsupported decision-critical context cannot be silently ignored;
4. incomplete/non-authoritative/stale/unavailable evidence cannot become authoritative negative;
5. authoritative complete absence can be distinguished from insufficient absence;
6. current state is not projected backwards for historical evaluation;
7. not-applicable is distinct from negative and indeterminate;
8. generic-v2 fallback cannot process candidate decision-critical semantics;
9. profile labels without mandatory processing semantics cannot admit candidate evaluation;
10. transport failure is not interpreted as semantic negative;
11. discovery metadata is not interpreted as authorization or recognition;
12. graph reachability is not interpreted as transitive recognition;
13. conflicting profile obligations fail closed;
14. agent replacement preserves historical audit attribution; and
15. individually valid evidence cannot manufacture broader transaction authority by composition.

The stable downstream requirement IDs and repository-local evidence mapping are published in `conformance/`. Independent organizational interoperability remains an external evidence path and **MUST NOT** be claimed solely from local differential tests.

Conformance claims SHOULD distinguish parser compatibility, binding compatibility, processor conformance, consumer conformance, and profile conformance. A product that accepts candidate syntax but ignores mandatory failure behavior is not a conforming candidate processor.

## 21. Compatibility with v2

This candidate represents a breaking processing change relative to generic v2 behavior where unknown optional context may be ignored. The break is semantic rather than merely syntactic.

Implementations **MUST** treat migration as explicit negotiation. Syntactic acceptance by a legacy implementation is not evidence of semantic compatibility.

The approved v2 specification remains retained in `specification/v2-approved/` as the migration/provenance baseline. On this candidate branch it is not the normative implementation target for v3.

See `guides/MIGRATION-FROM-V2.md` for deployment guidance and claim language.

## 22. Operational requirements

Deployments **MUST** preserve the exact evaluated proposition across discovery, transport, evidence acquisition, evaluation, caching and audit. Operational convenience **MUST NOT** broaden a proposition by dropping decision-critical context, material qualification, authority, action, resource or evaluation time.

Evidence/capability caches **SHOULD** retain enough authority, freshness, effective-time and invalidation information to reproduce the decision boundary. Revocation, supersession and endpoint movement **SHOULD** have explicit invalidation paths.

Operational telemetry **MUST** preserve the distinction among semantic positive, semantic negative, indeterminate/not-applicable, processing failure and transport failure. Retries **MUST NOT** remove qualifiers, weaken profiles or switch to legacy processing merely to obtain an answer.

Values such as freshness windows, retention periods, evidence-source authority, profile selection and SLOs remain governance/deployment decisions unless this specification explicitly constrains them.

Operational deployments SHOULD define observable metrics for negotiation failure, evidence unavailability, stale/conflicting evidence, semantic decision class, cache invalidation, and profile conflict without exposing unnecessary sensitive context.

## 23. Serialization and schema status

Proposal-grade candidate request/response schemas and examples are executable artifacts in this branch. They are required to preserve the semantic contract in Sections 3–22. Schema compatibility **MUST NOT** be achieved by deleting critical context, material qualification, evaluation time, evidence state or semantic decision distinctions.

Final upstream schema identifiers, publication locations and adopted member spelling remain upstream authority. This authority boundary does not permit candidate implementations to weaken the semantics specified here.

The public developer surface under `specification/v3/` intentionally separates semantic authority from schema publication authority: `TRQP-V3.md` owns protocol meaning; `API.md`, `openapi.yaml`, and the candidate JSON Schemas realize that meaning for the downstream HTTP candidate.

## 24. Upstream and external authority boundaries

The downstream candidate is semantically complete for RC review. The following remain external decisions/evidence rather than local semantic OPENs:

1. upstream adoption of a major-version or equivalent mandatory-profile mechanism and final naming;
2. final upstream wire member names/schema identifiers;
3. selection/adoption of production discovery and transport bindings beyond approved v2;
4. governance/profile authority and lifecycle conventions not constrained by core semantics;
5. any future positive recognition-propagation rule; and
6. independent organizational interoperability evidence.

None of these boundaries permits a candidate implementation to infer broader behavior. Where an external rule is absent, the fail-closed/core behavior specified above applies.

## 25. Traceability and evidence

Stable downstream normative IDs are in `specification/v3/conformance/REQUIREMENTS.md`. Requirement-to-test mapping is in `specification/v3/conformance/TRACEABILITY.md`. Conformance coverage and interoperability guidance are adjacent under `specification/v3/conformance/`. Candidate schemas are discoverable under `specification/v3/schemas/` with executable source schemas retained under `development/verification-material/schemas/`. Worked examples are under `specification/v3/examples/`, and implementation, migration, agentic, and operational guidance are under `specification/v3/guides/`.

Development history, upstream reconciliation, disposition records, stress models, and other provenance are under `development/evidence/v3/`. These supporting artifacts make the candidate auditable and testable. They do not introduce normative protocol behavior independently of this document. If an evidence/provenance document appears to do so, the candidate specification is defective and must be reconciled.

## 26. Candidate disposition and branch invariant

This document is **complete as the normative downstream v3 candidate specification** but **not authoritative as an adopted TRQP v3**.

A competent implementer should be able to understand the proposed protocol behavior from this document, then use the adjacent API, schemas, examples, guides, conformance controls, and tests to implement and verify it without reconstructing semantics from issues, pull requests, or work-package history.

The branch invariant is:

```text
main            = stable downstream TRQP v2
draft/next-trqp = complete downstream proposed TRQP v3
```

Completion of the candidate does not imply or require a merge to `main`. The candidate branch is review-ready when repository/document references validate, schemas/examples remain aligned with this specification, and the complete conformance/reference suite and RC-readiness controls are green.

## 27. IANA considerations

This downstream candidate requests no IANA actions.

If a future adopted version defines globally registered media types, well-known URI suffixes, problem-type registries, or other Internet registries, those actions belong to the adopted specification and are outside the authority of this downstream candidate.

## 28. References

### 28.1 Normative references

- **RFC 2119 / BCP 14** — S. Bradner, *Key words for use in RFCs to Indicate Requirement Levels*.
- **RFC 8174 / BCP 14** — B. Leiba, *Ambiguity of Uppercase vs Lowercase in RFC 2119 Key Words*.
- **RFC 9457** — M. Nottingham, E. Wilde, S. Dalal, *Problem Details for HTTP APIs*, for the candidate HTTP processing-error representation where applicable.

### 28.2 Informative references

- **RFC 7322** — H. Flanagan, S. Ginoza, *RFC Style Guide*, used as an editorial reference for specification structure and technical prose.
- Approved TRQP v2 material retained under `specification/v2-approved/`.
- Candidate developer API, schemas, examples, guides, and conformance material under `specification/v3/`.

## Appendix A. Worked-flow reading guide

The examples under `specification/v3/examples/` are informative, but they are designed to exercise the normative boundaries in this document. Implementers should begin with five flows:

1. an ordinary positive authorization against authoritative complete evidence;
2. a material-qualified request where the principal remains valid but the exact key does not;
3. an unavailable or incomplete evidence source that produces `indeterminate`, not `negative`;
4. a historical evaluation whose result differs from current state because revocation occurred later; and
5. an agent acting for a principal under external delegation evidence, demonstrating that identity, capability, and component validity do not by themselves compose into transaction authority.

Those flows should then be mapped to the stable requirement IDs and executable tests in `conformance/` and `tests/`.