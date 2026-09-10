# Trust Registry Query Protocol — Candidate v3

**Status:** Downstream experimental candidate; not an adopted Trust Over IP specification.

**Authority boundary:** This document is a complete candidate major-version specification assembled from downstream executable evidence. It does not modify or supersede `specification/v2-approved/`, and the name “v3” is a downstream working designation pending upstream disposition.

## 1. Scope

The Trust Registry Query Protocol (TRQP) provides a machine-processable means to evaluate a bounded trust-registry proposition. This candidate defines the semantic processing obligations needed when a decision depends not only on a principal but also on verification material, authority, action, resource, evaluation time, decision-critical context and the quality of available evidence.

The protocol distinguishes semantic decision state from transport state. A successful transport exchange is not evidence of a positive trust decision, and a transport failure is not authoritative evidence of a negative trust decision.

## 2. Conformance language

The key words **MUST**, **MUST NOT**, **REQUIRED**, **SHOULD**, **SHOULD NOT**, **MAY** and **OPTIONAL** are to be interpreted as normative requirements within this downstream candidate.

Conformance to this candidate does not imply conformance to any future upstream major version unless upstream adopts equivalent requirements.

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

An implementation MUST resolve the proposition it is evaluating before producing an authoritative decision. It MUST NOT silently remove a decision-critical dimension when doing so broadens or otherwise changes the proposition.

### 3.2 Principal and verification material

A semantic principal and verification material associated with that principal MUST be independently representable and independently governable.

Recognition, registration or other positive state concerning a principal MUST NOT imply that every associated key, certificate, identifier or other verification material is current, valid, authorized or applicable.

Where a request is qualified by verification material, evaluation MUST bind the decision to the exact principal/material/authority/action/resource proposition. A material mismatch MUST NOT fall back to a principal-only positive result.

### 3.3 Decision-critical context

A requester MAY declare context members as decision-critical. A processor MUST either evaluate every supported decision-critical member according to the negotiated processing contract or return a non-positive indeterminate outcome.

A processor MUST NOT ignore an unsupported decision-critical condition when ignoring it could broaden the proposition or produce a positive result that would not have been produced had the condition been evaluated.

Unknown optional context that is not declared decision-critical MAY be handled according to the applicable negotiated profile or binding.

## 4. Lifecycle and invalidation

Principal, authorization/recognition relationship and verification-material lifecycle are independent decision inputs unless an applicable governance rule explicitly binds them.

Verification-material state MUST be evaluated independently from principal state. Revoked, expired, superseded or inapplicable material MUST invalidate a material-dependent positive decision without automatically revoking the principal.

A current state MUST NOT be projected backwards to answer a historical query. Historical evaluation MUST use authoritative effective-dated evidence applicable to the requested evaluation time.

If evidence sufficient to establish historical state is missing, conflicting, stale for the requested period or incomplete, the processor MUST return an indeterminate outcome rather than manufacture historical certainty.

## 5. Evidence semantics

### 5.1 Evidence sufficiency

Before interpreting evidence or absence, an implementation MUST assess, where relevant:

- source authority;
- scope applicability;
- completeness for the evaluated scope;
- freshness/currentness;
- temporal coverage;
- integrity/provenance;
- conflict with other decision-relevant evidence.

Incomplete, non-authoritative, stale, unavailable, conflicting or otherwise insufficient evidence MUST NOT be collapsed into either a positive result or an authoritative negative.

### 5.2 Absence

Absence MAY support an authoritative negative only when the evidence source is authoritative and complete for the evaluated scope and temporally sufficient for the requested evaluation.

Record absence from an incomplete, stale, unavailable or non-authoritative source MUST yield an indeterminate outcome.

### 5.3 Not applicable

A `not-applicable` outcome is semantically distinct from both authoritative negative and indeterminate evidence. Implementations MUST preserve that distinction in machine-actionable results.

## 6. Decision model

A conforming implementation MUST expose enough machine-actionable information for a relying system to distinguish at least the following semantic classes:

- **positive** — sufficient authoritative evidence supports the exact proposition;
- **negative** — sufficient authoritative evidence establishes that the exact proposition is not satisfied;
- **indeterminate** — the proposition cannot be authoritatively resolved from the available evidence or processing capability;
- **not-applicable** — the requested proposition does not apply under the evaluated scope or rule.

A result SHOULD include stable reason information sufficient to distinguish material mismatch, revocation, expiry, supersession, unsupported decision-critical context, incomplete evidence, stale evidence, unavailable evidence, conflicting evidence and insufficient historical evidence where applicable.

The exact upstream decision/reason vocabulary remains an unresolved authority question. Implementations MUST NOT require consumers to infer semantic decision class solely from HTTP status, transport success or record absence.

## 7. Request processing

A candidate request SHOULD be capable of expressing:

1. the semantic principal;
2. authority/action/resource scope where applicable;
3. verification-material qualification where applicable;
4. evaluation time where a non-current decision is requested;
5. additional context;
6. which context members are decision-critical;
7. the candidate version/profile processing contract being requested.

Exact normative member names and serialization remain experimental pending upstream disposition.

A processor MUST validate the request before evaluation. Malformed or internally contradictory decision-critical declarations MUST NOT be repaired by silently dropping the affected condition.

## 8. Evaluation algorithm

A conforming candidate processor MUST implement behaviour equivalent to the following ordered obligations:

1. resolve the requested proposition and all decision-critical dimensions;
2. establish that the negotiated processing contract supports those dimensions;
3. resolve applicable principal, relationship and verification-material lifecycle state;
4. determine the evidence authority, completeness, freshness and temporal sufficiency needed for the proposition;
5. evaluate the exact proposition without broadening it through fallback;
6. preserve uncertainty when evidence or processing capability is insufficient;
7. return a machine-actionable semantic decision and reason information;
8. preserve enough provenance to audit why the result was produced.

Processing order MAY differ internally if the externally observable semantics are equivalent and fail closed at the same decision boundaries.

## 9. Response processing

A candidate response SHOULD expose:

- semantic decision class;
- reason or reasons;
- evaluated proposition or a stable binding to it;
- evaluation time;
- relevant evidence/provenance references where disclosure is permitted;
- processing/profile/version information needed to interpret the result.

A relying party MUST evaluate the semantic decision class and MUST NOT equate transport-level success with a positive decision.

Evidence references SHOULD be minimized to what is necessary for verification, audit and redress; implementations SHOULD avoid exposing unnecessary authority, relationship or correlating information.

## 10. Negotiation and migration

Candidate semantics are not transparently compatible with generic v2 processing when a request contains a decision-critical condition that a v2 peer may ignore as unknown optional context.

Before candidate evaluation, peers MUST establish a processing contract that confirms:

- support for the requested candidate semantics/version;
- support for all required profiles;
- the mandatory processing semantics bound by those profiles;
- support for every decision-critical context member in the request.

A profile identifier by itself is insufficient. If any required processing obligation cannot be established, candidate evaluation MUST terminate non-positively before semantic evaluation.

A candidate request MUST NOT silently fall back to generic v2 processing. A v2-only peer MUST NOT be treated as satisfying candidate semantics merely because it can parse or accept the request.

The final upstream version/profile mechanism and migration vocabulary remain unresolved.

## 11. Transport and binding boundary

**Candidate/open section — NTRQP-006 remains research-tracked.**

The semantic model in Sections 3–10 is intended to be independent of a particular transport. A binding maps semantic requests, responses and processing failures to transport constructs without changing their meaning.

The following safety invariants apply to candidate implementations and experiments:

- transport success MUST NOT create a positive semantic decision;
- transport `not found`, timeout or unavailability MUST NOT automatically create an authoritative negative;
- a binding MUST NOT drop decision-critical context;
- a binding MUST NOT rewrite evaluation time or semantic scope;
- endpoint identity MUST NOT be confused with principal, registry or authority identity.

These invariants do not constitute upstream adoption of a transport-independent TRQP architecture. Production bindings beyond approved v2 remain unresolved.

## 12. Endpoint and capability discovery

**Candidate/open section — NTRQP-007 remains research-tracked.**

Discovery identifies where a service can be contacted and what processing capabilities it claims. Discovery MUST remain distinct from semantic authorization, recognition and trust-registry membership.

A capability declaration used to admit candidate processing SHOULD identify the service/registry, supported protocol versions, supported profiles, mandatory processing semantics, supported decision-critical context and sufficient authority/freshness information to validate the declaration.

An unavailable, stale, conflicting or unauthorized capability declaration MUST NOT trigger generic-v2 downgrade for a candidate request.

Endpoint movement SHOULD be possible without changing the semantic identity of the principal, registry or authority.

The discovery mechanism itself — including whether DNS, `.well-known`, DID resolution, registry-of-registries or another mechanism is used — remains unresolved.

## 13. Governance and security profiles

**Candidate/open section — NTRQP-008 remains research-tracked.**

A profile MAY strengthen evidence, governance, security, cryptographic or operational requirements. A profile MUST NOT silently redefine the identity of the proposition being evaluated or weaken mandatory core processing semantics.

Profile selection MUST NOT permit:

- ignoring decision-critical context;
- collapsing indeterminate evidence into authoritative negative;
- weakening exact material binding;
- changing semantic scope merely to obtain a positive result.

Where multiple profiles apply, their mandatory obligations MUST be jointly satisfiable. Unresolved conflicts MUST fail closed before evaluation.

Profile authority, lifecycle, versioning and composition remain candidate research matters beyond the bounded negotiation evidence already established.

## 14. Recognition

**Candidate/open section — NTRQP-009 remains research-tracked.**

Recognition is an explicitly scoped relationship supported by evidence and lifecycle. Recognition MUST remain distinct from authorization, verification-material validity and endpoint discovery.

Absent an explicit propagation rule with sufficient authority, evidence, scope, lifecycle and path constraints:

`A recognizes B` and `B recognizes C` MUST NOT imply `A recognizes C`.

Graph reachability alone MUST NOT manufacture recognition authority. Cycles, shared profile membership, endpoint co-location or verification-material validity MUST NOT be interpreted as recognition.

Any future propagated-recognition result MUST be distinguishable from direct recognition and requires separate normative and interoperability evidence before promotion.

## 15. Error semantics

Processing failures MUST remain distinguishable from semantic negative decisions.

Where an HTTP binding is used, materially revised error responses SHOULD use RFC 9457 Problem Details unless the applicable binding defines another representation. Problem `type` identifiers and machine-readable extensions SHOULD be stable; clients MUST NOT depend on parsing human-readable detail.

Error representations MUST be assessed for privacy, correlation and authority-information leakage.

A transport or processing error MUST NOT be converted into authoritative evidence that the queried proposition is false.

## 16. Security considerations

Implementations MUST protect against semantic downgrade, stale evidence replay, unauthorized evidence injection, verification-material substitution and scope broadening.

Negotiation and discovery inputs are security-sensitive. An attacker able to remove a decision-critical condition, substitute a weaker profile, provide stale capability metadata or force legacy fallback may cause evaluation of a materially broader proposition.

Implementations SHOULD bind decisions to the exact evaluated proposition and retain sufficient audit evidence to demonstrate that binding.

Unknown or unsupported critical semantics MUST fail closed.

## 17. Privacy considerations

TRQP queries and evidence may reveal relationships, identifiers, authority structures, resource interests or historical activity. Implementations SHOULD minimize disclosed query context and evidence to what is necessary for the relying decision.

Historical and lifecycle endpoints SHOULD avoid exposing unnecessary event history when a bounded proof of current or historical state is sufficient.

Discovery, evidence and error surfaces SHOULD be reviewed for stable correlators and cross-context linkability.

Privacy minimization MUST NOT be implemented by dropping a decision-critical condition and evaluating a broader proposition.

## 18. Auditability and redress

A decision-producing implementation SHOULD retain or be capable of producing evidence sufficient to establish:

- the proposition evaluated;
- evaluation time;
- processing contract/profile used;
- material lifecycle state considered;
- evidence authority/completeness/freshness judgment;
- semantic decision and reason;
- relevant supersession/revocation state.

Audit evidence SHOULD support correction, challenge and re-evaluation without requiring disclosure of unrelated registry information.

## 19. Conformance requirements

Candidate conformance is claim-based. A conforming implementation MUST demonstrate, through tests or equivalent machine-verifiable evidence, at least that:

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
12. graph reachability is not interpreted as transitive recognition.

Items 10–12 are candidate safety invariants associated with research-tracked NTRQP-006, NTRQP-007 and NTRQP-009; their presence here does not advance those research propositions to upstream-ready candidate text.

## 20. Compatibility

This candidate represents a breaking processing change relative to generic v2 behaviour where unknown optional context may be ignored. The break is semantic rather than merely syntactic.

Implementations MUST therefore treat migration as an explicit negotiation problem. Syntactic acceptance by a legacy implementation is not evidence of semantic compatibility.

`specification/v2-approved/` remains the approved v2 baseline and is not modified by this candidate.

## 21. Authority and unresolved decisions

The following require upstream normative disposition before this candidate can be represented as an adopted TRQP major version:

1. final major-version versus mandatory-profile mechanism;
2. normative wire name for verification-material qualification;
3. normative mechanism for declaring decision-critical context;
4. exact decision/result/reason vocabulary;
5. capability/profile discovery and negotiation contract;
6. migration behaviour between generic v2 and candidate processing;
7. exact treatment and vocabulary for incomplete, stale, conflicting and unavailable evidence;
8. recognition propagation/transitivity semantics;
9. transport/profile boundaries and production bindings.

Open upstream issues are evidence of active consideration, not normative acceptance.

## 22. Traceability

The evidence-backed normative core derives from WP0–WP9 and the NTRQP proposition register:

- NTRQP-01–NTRQP-08: semantic/evidence/lifecycle core;
- NTRQP-09–NTRQP-10: compatibility and negotiated-processing requirements;
- NTRQP-11–NTRQP-12: experimental request/response mechanisms;
- NTRQP-13–NTRQP-14: upstream authority and wire/migration questions;
- NTRQP-006–NTRQP-009 research tracks: transport independence, discovery, profile boundaries and recognition.

Authoritative downstream traceability remains in `development/next-draft/TRACEABILITY.md`; upstream relationship judgments remain in `development/next-draft/UPSTREAM-RECONCILIATION.md`.

## 23. Candidate disposition

This document is **complete as a downstream candidate specification** but **not authoritative as TRQP v3**.

Completeness means that an implementer can understand the proposed semantic model, processing obligations, compatibility boundary, conformance claims and unresolved authority questions without reconstructing the design from work-package notes.

Promotion remains artifact-specific and requires upstream disposition. No unresolved question is converted to consensus by publication of this candidate.
