# TRQP v3 over Trust Spanning Protocol (TSP) Binding

**Status:** experimental downstream binding for the TRQP v3 candidate. This document is not an adopted Trust Over IP specification and does not modify the authority of the upstream TSP specification.

## 1. Purpose

This binding defines how a complete TRQP v3 request, response, or processing problem is carried as a higher-layer payload over the Trust Spanning Protocol (TSP).

TSP and TRQP have deliberately separate responsibilities:

- **TSP** provides authenticated directional message carriage between endpoints identified by Verifiable Identifiers (VIDs), with confidentiality and metadata-privacy mechanisms where selected by the TSP deployment.
- **TRQP** evaluates an exact bounded trust-registry proposition against applicable authority and evidence and returns a semantic decision.

A conforming implementation MUST preserve this separation. TSP authentication, a TSP Relationship, routing state, endpoint discovery, or successful TSP delivery MUST NOT manufacture TRQP principal identity, authority, recognition, authorization, evidence sufficiency, or semantic decision.

## 2. Authority boundary

The upstream TSP specification remains authoritative for TSP message construction, VID verification, relationships, confidentiality, routing, nesting, encoding, and transport-independent TSP behavior. This binding does not redefine those mechanisms.

The TRQP v3 candidate remains authoritative for bounded propositions, negotiation, evidence sufficiency, lifecycle, recognition, authorization, decision classes, critical context, and audit semantics.

This document defines only the mapping between those layers.

## 3. Binding model

A TRQP-over-TSP exchange has four logical layers:

```text
application policy / relying decision
              |
          TRQP v3
              |
     TRQP-over-TSP envelope
              |
             TSP
              |
   underlying transport mechanism
```

The binding envelope is carried as a TSP higher-layer payload. The TSP implementation MAY use direct, routed, nested, confidential, or other TSP-defined modes without changing the enclosed TRQP proposition.

TSP intermediaries MUST NOT be required to understand TRQP semantics.

## 4. Binding envelope

The binding envelope has these members:

| Member | Required | Meaning |
|---|---:|---|
| `protocol` | yes | Fixed value `trqp`. |
| `protocol_version` | yes | TRQP processing contract carried by the envelope. Experimental value: `3.0-candidate`. |
| `binding` | yes | Fixed value `tsp`. |
| `message_type` | yes | `query`, `response`, or `problem`. |
| `message_id` | yes | Unique message identifier used for correlation and audit. |
| `in_reply_to` | response/problem | Identifier of the query to which the message responds. |
| `body` | yes | Complete TRQP request/response or binding-processing problem payload. |

The binding MUST carry the TRQP body without dropping, broadening, rewriting, or inventing decision-critical semantics.

A `response` or `problem` MUST identify the corresponding query using `in_reply_to`. A TSP Relationship is not itself a TRQP transaction identifier.

## 5. Identity and authority separation

TSP VIDs are transport-layer identity facts. TRQP principals and authorities are semantic proposition dimensions. They are not interchangeable by default.

### TRQP3-TSP-001 — payload preservation

A conforming binding MUST carry a complete TRQP request, response, or processing problem without changing its semantic meaning.

### TRQP3-TSP-002 — sender VID separation

The authenticated TSP sender/source VID MUST NOT implicitly establish the TRQP `entity_id`, represented principal, controller, delegate, or other semantic subject.

### TRQP3-TSP-003 — receiver VID separation

The TSP receiver/destination VID MUST NOT implicitly establish the TRQP `authority_id` or registry authority.

### TRQP3-TSP-004 — relationship/recognition separation

The existence of a TSP Relationship MUST NOT establish TRQP recognition.

### TRQP3-TSP-005 — authentication/authorization separation

Successful TSP authentication or message verification MUST NOT establish TRQP authorization.

A deployment MAY deliberately bind an authenticated TSP VID into TRQP decision-critical context. When it does, the binding MUST compare the authenticated transport value with the declared TRQP value and MUST fail closed on mismatch. The binding MUST NOT silently insert or substitute the value after proposition construction.

## 6. Transport-derived critical context

This experimental binding reserves two optional context names for explicit cross-layer binding:

- `requester_vid` — expected authenticated TSP sender/source VID;
- `receiver_vid` — expected TSP receiver/destination VID.

If either name appears in `critical_context`, the corresponding value MUST appear in `context` and MUST match the authenticated TSP transport fact available to the receiving implementation.

A mismatch is a binding/processing failure. It is not an authoritative TRQP semantic negative.

If these members are not declared critical, a conforming binding MUST NOT inject them into the semantic proposition merely because TSP exposes them.

### TRQP3-TSP-006 — critical transport binding

A TSP-derived attribute declared as TRQP decision-critical context MUST be checked against the authenticated transport fact. Missing, unsupported, or mismatched critical transport context MUST fail closed before semantic evaluation.

## 7. Request/response correlation

TSP messages are directional and asynchronous, so this binding provides explicit correlation independent of TSP relationship state.

### TRQP3-TSP-007 — correlation

Each binding message MUST contain a unique `message_id`. Each `response` or `problem` MUST contain `in_reply_to` equal to the corresponding query `message_id`.

Consumers MUST reject or quarantine a response whose correlation cannot be established.

## 8. Failure semantics

TRQP semantic decisions are `positive`, `negative`, `indeterminate`, and `not-applicable`. TSP transport, VID verification, routing, decryption, decoding, or binding validation failures are not semantic decisions.

A binding-processing failure is carried, where a higher-layer reply is possible, using `message_type: "problem"`. A problem body MUST NOT contain a TRQP semantic `decision` field.

Recommended problem members are:

- `type` — stable problem identifier URI or URN;
- `title` — short stable summary;
- `code` — machine-readable binding error code;
- `detail` — optional human-readable detail;
- `failed_requirement` — optional TRQP3-TSP requirement identifier.

### TRQP3-TSP-008 — failure separation

TSP transport, authentication, verification, routing, confidentiality, decoding, or binding failures MUST NOT be represented as TRQP `negative` semantic decisions.

### TRQP3-TSP-009 — fail-closed binding negotiation

Unsupported required TRQP version, binding semantics, or decision-critical TSP-derived context MUST fail closed and MUST NOT trigger silent retry as a broader TRQP query or legacy v2 query.

## 9. Routing and intermediaries

TSP routed mode may expose or protect different transport metadata depending on the TSP mechanism selected. Such routing facts do not alter the TRQP proposition.

### TRQP3-TSP-010 — routing neutrality

Intermediary identity, route selection, next-hop VID, transport address, or routing metadata MUST NOT replace or modify `entity_id`, `authority_id`, requested action, resource, verification material, evaluation time, or other decision-critical TRQP context.

### TRQP3-TSP-011 — opaque intermediary processing

A conforming TSP intermediary MUST NOT be required by this binding to interpret TRQP payload semantics.

## 10. Confidentiality and minimization

TSP can provide confidentiality and metadata-privacy mechanisms. Deployment policy determines when those mechanisms are required.

TRQP evidence disclosure remains subject to TRQP minimization and audit requirements. Encrypting the payload does not justify sending unnecessary evidence.

### TRQP3-TSP-012 — disclosure minimization

A deployment SHOULD minimize TRQP evidence and proposition disclosure consistently with the required semantic decision, audit obligations, and selected TSP protection mode.

## 11. Discovery and capability advertisement

A TRQP capability advertisement MAY identify TSP as a supported binding and provide a receiver VID needed to reach the endpoint, for example:

```json
{
  "trqp_versions": ["3.0-candidate"],
  "bindings": [
    {
      "type": "tsp",
      "receiver_vid": "did:example:registry-tsp"
    }
  ]
}
```

The advertised `receiver_vid` is addressing/binding information. It MUST NOT substitute for a TRQP `authority_id`, recognition statement, or authorization decision.

## 12. Conformance target

The conformance target defined by this document is **TRQP v3 TSP Binding**.

Conformance requires evidence for all applicable `TRQP3-TSP-*` requirements. Repository-local tests demonstrate internal consistency only; they do not establish independent implementation interoperability with an external TSP stack.

The executable downstream evidence is maintained in `tests/tsp-binding.test.js` and `development/verification-material/tsp-binding.js`.

## 13. Security considerations

The binding must defend against cross-layer semantic confusion. In particular:

- an authenticated sender is not automatically an authorized actor;
- an authenticated receiver is not automatically the semantic authority;
- a verified TSP Relationship is not TRQP recognition;
- a TSP delivery failure is not evidence that the proposition is false;
- TSP routing metadata is not semantic authority metadata;
- correlation identifiers must not be reused in ways that permit response substitution;
- authenticated TSP-derived values used as critical context must be compared, not inferred or silently inserted; and
- TSP key rotation or VID lifecycle must not be conflated with TRQP principal or verification-material lifecycle unless the exact proposition explicitly binds them.

## 14. Privacy considerations

TSP offers mechanisms intended to reduce exposure of content and metadata, but the TRQP payload can itself contain sensitive identifiers, relationships, evidence, and requested actions. Implementations SHOULD select TSP confidentiality and metadata-privacy modes appropriate to the deployment and SHOULD avoid stable correlation identifiers outside the lifetime necessary for transaction handling and audit.

## 15. Interoperability evidence boundary

This experimental binding demonstrates that the downstream TRQP v3 semantic model can be mapped onto asynchronous authenticated message carriage without relying on HTTP request/response semantics. Full interoperability remains unproven until tested against an independently implemented TSP stack and independently implemented TRQP peer.

Until such evidence exists, implementations MUST describe conformance as repository-local or experimental and MUST NOT claim independent cross-implementation interoperability.
