# Response Grounding Experiment — Candidate v3

**Status:** experimental design evidence for downstream issue #69 and upstream trustoverip/tswg-trust-registry-protocol#195.

## Proposition

A TRQP response can expose a small, optional, interoperable description of the basis of its semantic determination without standardizing the responder's persistence model or disclosing raw evidence.

## Separation of concerns

| Surface | Meaning | Authority |
|---|---|---|
| semantic result | the protocol determination | TRQP response |
| `evidence_state` | sufficiency/quality of evidence for the exact proposition | processor assessment |
| `grounding` | optional reference to the bounded authoritative basis used for the determination | descriptive/provenance metadata |
| internal evidence handling | storage, history reconstruction, record selection, audit retention | implementation-specific |

Grounding MUST NOT override or reinterpret the semantic result. A grounding reference does not become authoritative merely because a responder returns it.

## Use cases

1. **Current lookup:** identify the authoritative statement/version supporting a current positive or negative determination.
2. **Historical lookup:** bind a historical determination to source state whose effective interval covers `time_requested`.
3. **Audit/dispute:** retain a stable reference or digest sufficient to identify the basis that was relied upon without returning raw internal evidence.
4. **Reproducibility:** allow a consumer to correlate a later verification with the source version or immutable reference used earlier.
5. **Assurance profile:** permit a stronger profile to require signed/stamped artifacts without making signatures mandatory in core TRQP.

## Minimum candidate vocabulary

`grounding` is OPTIONAL. When present it contains one or more grounding entries.

Each entry:

- MUST include `source_id`, a stable reference meaningful within the source's declared context;
- MUST include `source_authority`, identifying the authority responsible for the referenced source state;
- MAY include `source_version`;
- MAY include `digest`, as an algorithm-qualified binding to an immutable representation;
- MAY include `effective_from` and `effective_until`;
- MAY include `evidence_ref`, an indirect reference suitable for authorized retrieval or audit.

At least one of `source_version`, `digest`, or `evidence_ref` SHOULD be supplied when reproducibility is the purpose.

## Temporal rule

For a historical query, grounding that claims to identify the basis of the determination MUST be temporally applicable to the requested evaluation time. A later observation, revocation, or current-state record MUST NOT be represented as the grounding for an earlier determination unless it validly establishes state for that earlier effective interval.

## Disclosure boundary

Grounding is provenance, not a debugging dump. A responder MUST NOT expose raw evidence, internal database identifiers, hidden authority relationships, policy internals, or other information the requester is not authorized to receive merely to populate `grounding`.

Omission of grounding is valid under the base Candidate v3 contract. A profile MAY strengthen this requirement.

## Cryptographic binding disposition

Core Candidate v3 should permit an algorithm-qualified digest but should not require signed/stamped response artifacts. Signing, timestamping, notarisation, or stronger evidence packaging changes assurance requirements and is better expressed by an assurance profile unless interoperability evidence demonstrates a universal core requirement.

## Falsification assessment

The candidate survives the initial falsification test because the minimum model can be expressed using protocol-bound provenance fields without requiring database/event-log/credential semantics. It remains optional, does not alter the result taxonomy, and can be omitted without changing existing Candidate v3 interpretation.

## Conformance propositions

- **TRQP3-GROUND-001:** omission of `grounding` remains valid.
- **TRQP3-GROUND-002:** every grounding entry identifies both source and source authority.
- **TRQP3-GROUND-003:** grounding does not create or override `decision`, `authorized`, `recognized`, or `evidence_state`.
- **TRQP3-GROUND-004:** historical grounding intervals, when supplied, cover the requested evaluation time.
- **TRQP3-GROUND-005:** digest values are algorithm-qualified opaque bindings; their presence does not itself prove authority or authenticity.
- **TRQP3-GROUND-006:** base conformance does not require raw evidence, signatures, timestamps, or implementation persistence identifiers.

## Decision gate

Merge into `draft/next-trqp` only if schema, OpenAPI, compatibility, historical, and negative tests support these propositions without weakening existing evidence semantics.
