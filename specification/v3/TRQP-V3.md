# Trust Registry Query Protocol — Candidate v3

**Status:** Complete downstream release-candidate proposal; not an adopted Trust Over IP specification.

**Authority boundary:** This document is the normative specification for the downstream v3 candidate branch. It does not modify the authority of the approved v2 specification, and the name “v3” remains a downstream working designation until upstream disposition. Supporting work-packet, traceability and disposition documents are evidence; an implementer MUST NOT need them to reconstruct normative candidate behaviour.

## 1. Scope

The Trust Registry Query Protocol (TRQP) provides a machine-processable means to evaluate a bounded trust-registry proposition. This candidate defines the semantic processing obligations needed when a decision depends not only on a principal but also on verification material, authority, action, resource, evaluation time, decision-critical context and the quality of available evidence.

TRQP remains a read-only trust-registry query/evaluation protocol. It does not define agent messaging, delegation credentials, workflow authorization, payment, contract formation or agent lifecycle. External evidence about those matters MAY be evaluated as part of a bounded registry proposition without transferring their protocol semantics into TRQP.

The protocol distinguishes semantic decision state from transport state. A successful transport exchange is not evidence of a positive trust decision, and a transport failure is not authoritative evidence of a negative trust decision.

## 2. Conformance language and targets

The key words **MUST**, **MUST NOT**, **REQUIRED**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are normative within this downstream candidate.

Conformance to this candidate does not imply conformance to any future upstream major version unless upstream adopts equivalent requirements.

Candidate conformance targets are:

- **TRQP Processor/Endpoint** — accepts and evaluates bounded candidate propositions;
- **TRQP Consumer/Relying Party** — constructs candidate requests and interprets semantic results;
- **TRQP Binding** — carries semantic requests, responses and processing failures without changing their meaning;
- **TRQP Profile** — strengthens processing obligations without weakening or redefining mandatory core semantics.

## 3. Semantic model

### 3.1 Proposition

A TRQP evaluation operates on a proposition whose decision-relevant dimensions may include:

- semantic principal;
- verification material;
- authority or trust-registry scope;
- requested action;
- requested resource;
- evaluation time;
- additional declared decision-critical context.

A processor **MUST** resolve the proposition it is evaluating before producing an authoritative decision. It **MUST NOT** silently remove a decision-critical dimension when doing so broadens or otherwise changes the proposition. [`TRQP3-PROP-001`, `TRQP3-PROP-002`]

### 3.2 Principal and verification material

A semantic principal and verification material associated with that principal **MUST** be independently representable and independently governable. [`TRQP3-MAT-001`]

Recognition, registration or other positive state concerning a principal **MUST NOT** imply that every associated key, certificate, identifier or other verification material is current, valid, authorized or applicable. [`TRQP3-MAT-002`]

Where a request is qualified by verification material, evaluation **MUST** bind the decision to the exact principal/material/authority/action/resource proposition. A material mismatch **MUST NOT** fall back to a principal-only positive result. [`TRQP3-MAT-003`]

### 3.3 Decision-critical context

A requester **MAY** declare context members as decision-critical. A processor **MUST** either evaluate every supported decision-critical member according to the negotiated processing contract or terminate candidate processing with a non-positive/indeterminate result as appropriate. Unsupported critical semantics **MUST NOT** be ignored when ignoring them could broaden the proposition or produce a positive result. [`TRQP3-CTX-001`, `TRQP3-SEC-002`]

Unknown optional context that is not declared decision-critical **MAY** be handled according to the applicable negotiated profile or binding.

## 4. Lifecycle and invalidation

Principal, authorization/recognition relationship and verification-material lifecycle are independent decision inputs unless an applicable governance rule explicitly binds them.

Verification-material state **MUST** be evaluated independently from principal state. Revoked, expired, superseded or inapplicable material **MUST** invalidate a material-dependent positive decision without automatically revoking the principal. [`TRQP3-LIFE-001`]

Current state **MUST NOT** be projected backwards to answer a historical query. Historical evaluation **MUST** use authoritative effective-dated evidence applicable to the requested evaluation time. [`TRQP3-LIFE-002`]

If evidence sufficient to establish historical state is missing, conflicting, stale for the requested period or incomplete, the processor **MUST** return `indeterminate` rather than manufacture historical certainty. [`TRQP3-LIFE-003`]

## 5. Evidence semantics

### 5.1 Evidence sufficiency

Before interpreting evidence or absence, a processor **MUST** assess, where relevant, source authority, scope applicability, completeness, freshness, temporal coverage, integrity/provenance and conflict with other decision-relevant evidence. [`TRQP3-EVID-001`]

Incomplete, non-authoritative, stale, unavailable, conflicting or otherwise insufficient evidence **MUST NOT** be collapsed into either a positive result or an authoritative negative. [`TRQP3-EVID-002`]

Candidate evidence-state vocabulary is: `sufficient`, `incomplete`, `stale`, `unavailable`, `non-authoritative`, `conflicting`, and `unknown`. Evidence state is orthogonal to semantic decision state. `sufficient` evidence does not itself imply a positive result.

### 5.2 Absence

Absence **MAY** support an authoritative negative only when the evidence source is authoritative and complete for the evaluated scope and temporally sufficient for the requested evaluation. Record absence from an incomplete, stale, unavailable or non-authoritative source **MUST** yield `indeterminate`. [`TRQP3-EVID-003`]

### 5.3 Not applicable

A `not-applicable` outcome is semantically distinct from both authoritative negative and indeterminate evidence. Implementations **MUST** preserve that distinction in machine-actionable results.

## 6. Decision model

A conforming implementation **MUST** expose enough machine-actionable information to distinguish:

- **positive** — sufficient authoritative evidence supports the exact proposition;
- **negative** — sufficient authoritative evidence establishes that the exact proposition is not satisfied;
- **indeterminate** — the proposition cannot be authoritatively resolved from available evidence or processing capability;
- **not-applicable** — the requested proposition does not apply under the evaluated scope or rule.

[`TRQP3-DEC-001`]

A result **SHOULD** include stable reason information sufficient to distinguish material mismatch, revocation, expiry, supersession, unsupported decision-critical context, incomplete evidence, stale evidence, unavailable evidence, conflicting evidence and insufficient historical evidence where applicable.

Consumers **MUST NOT** infer semantic decision class solely from HTTP status, transport success or record absence. [`TRQP3-DEC-002`]

## 7. Request contract

A candidate request contract **MUST** be capable of representing, without semantic loss:

1. candidate version/processing contract;
2. semantic principal/entity;
3. authority scope;
4. action and resource where applicable;
5. verification-material qualification where applicable;
6. evaluation time where applicable;
7. context values;
8. the set of decision-critical context members;
9. required processing profiles.

Proposal-grade executable schemas are maintained under `development/verification-material/schemas/`. Final upstream member spelling and schema identifiers remain upstream authority; implementations of this downstream candidate **MUST** preserve the semantics above even if experimental serialization evolves.

A processor **MUST** validate the request before evaluation. Malformed or internally contradictory critical declarations **MUST NOT** be repaired by silently dropping the affected condition. [`TRQP3-REQ-001`]

## 8. Evaluation algorithm

A conforming candidate processor **MUST** implement behaviour equivalent to these ordered obligations:

1. resolve the requested proposition and all decision-critical dimensions;
2. establish that the negotiated processing contract supports those dimensions;
3. resolve applicable principal, relationship and verification-material lifecycle state;
4. determine the evidence authority, completeness, freshness and temporal sufficiency needed for the proposition;
5. evaluate the exact proposition without broadening it through fallback;
6. preserve uncertainty when evidence or processing capability is insufficient;
7. return a machine-actionable semantic decision and reason information;
8. preserve enough provenance to audit why the result was produced.

Processing order **MAY** differ internally if externally observable semantics are equivalent and fail closed at the same decision boundaries. [`TRQP3-EVAL-001`]

## 9. Response contract

A candidate response contract **MUST** be capable of representing, without semantic loss:

- semantic decision class;
- machine-actionable reason;
- evaluated proposition or stable binding to it;
- evaluation time;
- evidence state;
- relevant evidence/provenance/authority/completeness information where disclosure is permitted;
- processing/profile/version information required to interpret the result.

A relying party **MUST** evaluate the semantic decision class and **MUST NOT** equate transport-level success with a positive decision. [`TRQP3-RESP-001`]

Evidence references **SHOULD** be minimized to what is necessary for verification, audit and redress; implementations **SHOULD** avoid exposing unnecessary authority, relationship or correlating information.

## 10. Negotiation and migration

Candidate semantics are not transparently compatible with generic v2 processing when a request contains a decision-critical condition that a v2 peer may ignore as unknown optional context.

Before candidate evaluation, peers **MUST** establish a processing contract confirming support for the candidate semantics/version, all required profiles and their mandatory processing semantics, and every decision-critical context member in the request. A profile identifier alone is insufficient. [`TRQP3-NEG-001`]

If any required processing obligation cannot be established, candidate processing **MUST** terminate non-positively before semantic evaluation. A candidate request **MUST NOT** silently fall back to generic v2 processing. A v2-only peer **MUST NOT** be treated as satisfying candidate semantics merely because it can parse or accept the request. [`TRQP3-NEG-002`, `TRQP3-COMP-001`]

For migration:

- v2-only peer + candidate-critical request → explicit unsupported/processing failure; no candidate evaluation;
- candidate-only peer + v2 request → process only under an explicitly supported compatibility contract;
- dual-capability peers → negotiate the candidate contract before sending/evaluating candidate-critical semantics;
- failed or ambiguous negotiation → no silent generic-v2 fallback.

A distinct major version is the downstream-preferred signalling mechanism because these are breaking processing semantics. An equivalently mandatory, non-ignorable profile is safe only if its obligations are proven before evaluation. Final upstream version/profile naming remains upstream authority.

## 11. Transport and binding boundary

Candidate core semantics are transport-neutral. A binding maps semantic requests, responses and processing failures to transport constructs without changing their meaning.

A conforming binding **MUST NOT** create semantic meaning, drop decision-critical context, rewrite evaluation time or semantic scope, or confuse endpoint identity with principal, registry or authority identity. Transport success **MUST NOT** create a positive semantic decision; transport not-found, timeout or unavailability **MUST NOT** create an authoritative negative. [`TRQP3-BIND-001`]

Where HTTP is used, processing failures **SHOULD** use RFC 9457 Problem Details unless the applicable binding defines another representation. Problem Details represents processing failure, not a semantic negative.

Selection/adoption of production bindings beyond approved v2 remains an upstream/external interoperability matter; the semantic boundary above is normative for this candidate.

## 12. Endpoint and capability discovery

Discovery identifies where a service can be contacted and what processing capabilities it claims. Discovery **MUST** remain distinct from semantic authorization, recognition and trust-registry membership. [`TRQP3-DISC-001`]

A capability declaration used to admit candidate processing **SHOULD** identify the service/registry, supported protocol versions, supported profiles, mandatory processing semantics, supported decision-critical context and sufficient authority/freshness information to validate the declaration.

Unavailable, stale, conflicting or unauthorized capability metadata **MUST NOT** trigger generic-v2 downgrade for a candidate request. [`TRQP3-DISC-002`]

Endpoint movement **SHOULD** be possible without changing semantic principal, registry or authority identity.

The downstream candidate defines a transport-independent capability contract and includes an experimental HTTPS `.well-known` binding as executable evidence. No single discovery transport is required by core candidate semantics; final production discovery binding is an upstream/profile decision.

## 13. Governance and security profiles

A profile **MAY** strengthen evidence, governance, security, cryptographic or operational requirements. A profile **MUST NOT** silently redefine proposition identity or weaken mandatory core processing semantics. [`TRQP3-PROF-001`]

Profile selection **MUST NOT** permit ignoring decision-critical context, collapsing indeterminate evidence into authoritative negative, weakening exact material binding, or changing semantic scope merely to obtain a positive result.

Where multiple profiles apply, mandatory obligations **MUST** be jointly satisfiable. Conflicting mandatory obligations **MUST** fail closed before evaluation. [`TRQP3-PROF-002`]

Profile authority, lifecycle and versioning are governance/profile responsibilities unless a future adopted core specification further constrains them.

## 14. Recognition

Recognition is an explicitly scoped relationship supported by evidence and lifecycle. Recognition **MUST** remain distinct from authorization, verification-material validity and endpoint discovery. [`TRQP3-REC-001`]

Core candidate behaviour is **direct recognition only**. Absent an explicit propagation rule with sufficient authority, evidence, scope, lifecycle and path constraints, `A recognizes B` and `B recognizes C` **MUST NOT** imply `A recognizes C`. Graph reachability, cycles, shared profile membership, endpoint co-location or material validity **MUST NOT** manufacture recognition. [`TRQP3-REC-002`]

Positive recognition propagation is intentionally outside the RC core and requires separate future normative and interoperability evidence.

## 15. Error semantics

Processing and transport failures **MUST** remain distinguishable from semantic negative decisions. [`TRQP3-ERR-001`]

Where HTTP is used, materially revised error responses **SHOULD** use RFC 9457 Problem Details unless the binding defines another representation. Problem `type` identifiers and machine-readable extensions **SHOULD** be stable; clients **MUST NOT** depend on parsing human-readable detail.

Error representations **MUST** be assessed for privacy, correlation and authority-information leakage. A transport or processing error **MUST NOT** be converted into authoritative evidence that the queried proposition is false.

## 16. Security considerations

Implementations **MUST** protect against semantic downgrade, stale evidence replay, unauthorized evidence injection, verification-material substitution and scope broadening. [`TRQP3-SEC-001`]

Negotiation and discovery inputs are security-sensitive. Removal of a decision-critical condition, substitution of a weaker profile, stale capability metadata or forced legacy fallback can cause evaluation of a materially broader proposition. Unknown or unsupported critical semantics **MUST** fail closed. [`TRQP3-SEC-002`]

Implementations **SHOULD** bind decisions to the exact evaluated proposition and retain sufficient audit evidence to demonstrate that binding.

## 17. Privacy considerations

TRQP queries and evidence may reveal relationships, identifiers, authority structures, resource interests or historical activity. Implementations **SHOULD** minimize disclosed query context and evidence to what is necessary for the relying decision.

Historical and lifecycle surfaces **SHOULD** avoid exposing unnecessary event history when a bounded proof of current or historical state is sufficient. Discovery, evidence and error surfaces **SHOULD** be reviewed for stable correlators and cross-context linkability.

Privacy minimization **MUST NOT** be implemented by dropping a decision-critical condition and evaluating a broader proposition. [`TRQP3-PRIV-001`]

## 18. Auditability, redress and agent replacement

A decision-producing implementation **SHOULD** retain or be capable of producing evidence sufficient to establish the proposition evaluated, evaluation time, processing contract/profile, material lifecycle state, evidence authority/completeness/freshness judgment, semantic decision/reason and relevant supersession/revocation state. [`TRQP3-AUD-001`]

Audit evidence **SHOULD** support correction, challenge and re-evaluation without disclosure of unrelated registry information.

Where an autonomous agent participates, audit evidence **SHOULD** preserve a stable binding among runtime agent identity, represented principal/controller where relevant, exact external delegation evidence, bounded proposition and evaluation time. Agent or endpoint replacement **MUST NOT** rewrite historical attribution or semantic identity.

## 19. Agentic-system use and composition boundary

TRQP semantics are unchanged when consumers, subjects or relying parties are autonomous agents. Agent identity **MUST NOT** be equated with operator/controller/principal identity. Capability advertisement **MUST NOT** be interpreted as authorization. Component-level validity — including identity, key validity, recognition, capability or delegation evidence — **MUST NOT** by composition manufacture transaction authority.

External delegation evidence may be decision-critical context, but TRQP does not define the delegation instrument. A material change to delegated action, resource, scope, time, onward-delegation permission or relationship state changes the proposition and **MUST** be re-evaluated rather than inferred from a prior positive.

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
14. agent replacement preserves historical audit attribution;
15. individually valid evidence cannot manufacture broader transaction authority by composition.

The stable downstream requirement IDs and repository-local evidence mapping are published alongside this specification. Independent organizational interoperability remains an external evidence path and **MUST NOT** be claimed solely from local differential tests.

## 21. Compatibility with v2

This candidate represents a breaking processing change relative to generic v2 behaviour where unknown optional context may be ignored. The break is semantic rather than merely syntactic.

Implementations **MUST** treat migration as explicit negotiation. Syntactic acceptance by a legacy implementation is not evidence of semantic compatibility.

The approved v2 specification remains retained in `specification/v2-approved/` as the migration/provenance baseline. On this candidate branch it is not the normative implementation target for v3.

## 22. Operational requirements

Deployments **MUST** preserve the exact evaluated proposition across discovery, transport, evidence acquisition, evaluation, caching and audit. Operational convenience **MUST NOT** broaden a proposition by dropping decision-critical context, material qualification, authority, action, resource or evaluation time.

Evidence/capability caches **SHOULD** retain enough authority, freshness, effective-time and invalidation information to reproduce the decision boundary. Revocation, supersession and endpoint movement **SHOULD** have explicit invalidation paths.

Operational telemetry **MUST** preserve the distinction among semantic positive, semantic negative, indeterminate/not-applicable, processing failure and transport failure. Retries **MUST NOT** remove qualifiers, weaken profiles or switch to legacy processing merely to obtain an answer.

Values such as freshness windows, retention periods, evidence-source authority, profile selection and SLOs remain governance/deployment decisions unless this specification explicitly constrains them.

## 23. Serialization and schema status

Proposal-grade candidate request/response schemas and examples are executable artifacts in this branch. They are required to preserve the semantic contract in Sections 3–22. Schema compatibility **MUST NOT** be achieved by deleting critical context, material qualification, evaluation time, evidence state or semantic decision distinctions.

Final upstream schema identifiers, publication locations and adopted member spelling remain upstream authority. This authority boundary does not permit candidate implementations to weaken the semantics specified here.

## 24. Upstream and external authority boundaries

The downstream candidate is semantically complete for RC review. The following remain external decisions/evidence rather than local semantic OPENs:

1. upstream adoption of a major-version or equivalent mandatory-profile mechanism and final naming;
2. final upstream wire member names/schema identifiers;
3. selection/adoption of production discovery and transport bindings beyond approved v2;
4. governance/profile authority and lifecycle conventions not constrained by core semantics;
5. any future positive recognition-propagation rule;
6. independent organizational interoperability evidence.

None of these boundaries permits a candidate implementation to infer broader behavior. Where an external rule is absent, the fail-closed/core behavior specified above applies.

## 25. Traceability and evidence

Stable downstream normative IDs are in `development/next-draft/NORMATIVE-REQUIREMENTS.md`. Requirement-to-test mapping is in `development/next-draft/REQUIREMENT-TEST-TRACEABILITY.md`. Candidate schemas are under `development/verification-material/schemas/`; examples are under `development/next-draft/examples/`; implementation, migration, conformance, agentic and operational guidance are adjacent to this specification.

These supporting artifacts make the candidate auditable and testable. They do not introduce normative protocol behavior independently of this document. If an evidence/provenance document appears to do so, the candidate specification is defective and must be reconciled before release.

## 26. Candidate disposition and promotion invariant

This document is **complete as the normative downstream v3 candidate specification** but **not authoritative as an adopted TRQP v3**.

A competent implementer should be able to understand the proposed protocol behavior from this document, then use the adjacent schemas, examples, guides and tests to implement and verify it without reconstructing semantics from issues, pull requests or work-package history.

The candidate branch is promotion-ready only when repository/document references validate, schemas/examples remain aligned with this specification, the complete conformance/reference suite and RC-readiness controls are green, and a clean merge of `draft/next-trqp` into `main` would not require a second semantic-integration exercise.
