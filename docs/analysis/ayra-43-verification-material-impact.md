# Ayra #43 impact: principal identity, verification material, and trust-decision semantics

Status: analysis / downstream tracking input  
Observed: 2026-09-09  
External source: https://github.com/ayraforum/ayra-trust-registry-resources/issues/43

## Proposition

Ayra Trust Registry Resources issue #43 exposes a TRQP semantic boundary that should be tracked independently of the specific AAMVA VICAL and ICAO PKD use cases:

> A semantic actor or principal, the authority relationship governing that actor, and the cryptographic verification material through which the actor operates are distinct resources with distinct lifecycles.

A certificate or key therefore should not be silently substituted for an `authority_id` or `entity_id` when the intended subject of the trust statement is an organization or other principal.

This analysis is maintained in this downstream repository so that implementation and conformance work can proceed without asserting authority over the upstream TRQP specification. **When corresponding upstream TRQP issues become available, they will be linked here and used as the authoritative upstream disposition points.**

## Why this matters

The PKD examples expose five separable concepts:

1. statement issuer / governing authority;
2. governed or recognized principal;
3. verification material (certificate/key and version);
4. authorized action or purpose; and
5. governed credential/document/resource type.

Collapsing these concepts creates lifecycle and trust-decision ambiguity. An organization can remain recognized while a certificate rotates, expires, or is revoked. Conversely, a certificate can be valid cryptographically without establishing that its subject is authorized for a requested purpose.

## Impact on TRQP semantics

### 1. Principal identity must remain distinct from verification material

TRQP should be able to express a relationship equivalent to:

```yaml
entity_id: did:example:issuer
verification_material:
  type: application/pkix-cert
  uri: ni:///sha-256;<digest>
  role: IACA
```

The exact syntax is not decided here. The invariant is semantic: the principal and the material used to verify or operationalize that principal's authority are not interchangeable.

This distinction generalizes beyond X.509 to DID verification methods, delegated signing keys, agent operational keys, and other rotating cryptographic material.

### 2. Decision-critical extensions must not be silently ignored

Ayra #43 identifies a security-significant interoperability failure mode. If a client qualifies a query with exact verification material but a generic endpoint ignores that qualifier, the endpoint could return a positive organization-level result that the client incorrectly interprets as applying to the supplied certificate.

Required invariant:

> A decision-critical qualifier MUST either be understood and applied or cause an explicit unsupported/indeterminate outcome. It MUST NOT be silently ignored while returning a positive trust decision.

Potential upstream mechanisms include profile negotiation, a `must_understand` facility, or a dedicated standardized query type. This downstream analysis does not select the normative mechanism.

### 3. Absence and indeterminacy require explicit semantics

The following states are not equivalent:

- listed and applicable;
- listed but not applicable;
- revoked;
- expired;
- not listed;
- unknown; and
- stale source data.

Required invariant:

> Absence MUST NOT automatically be interpreted as an authoritative negative unless the queried source is authoritative and complete for the declared scope and evaluation time.

Similarly, missing or stale evidence must not collapse into a positive result.

### 4. Historical evaluation binds multiple lifecycle domains

A trust decision may depend on:

- authority/recognition state;
- authorization for an action/resource;
- verification-material association;
- certificate/key validity and revocation;
- source-artifact freshness/completeness; and
- evaluation time.

These dependencies can change independently. The canonical change/invalidation model therefore needs to distinguish governance/authority lifecycle, authorization lifecycle, cryptographic-material lifecycle, evidence/source lifecycle, and derived trust-decision lifecycle.

## TSPP impact

This analysis is a direct input to the TSPP invalidation tranche. TSPP should eventually provide testable handling for at least:

```text
recognized principal + valid material       -> eligible for positive evaluation
recognized principal + revoked material     -> MUST NOT produce positive material-bound result
recognized principal + unknown material     -> unknown/not-listed, according to authoritative scope
recognized principal + stale source         -> indeterminate/stale
recognized principal + wrong purpose        -> not-applicable
historical query outside material validity   -> MUST NOT produce current-style positive result
```

The exact normative result vocabulary remains subject to upstream TRQP disposition.

## TSMS impact

TSMS should model the generic semantic distinction rather than X.509-specific vocabulary:

```text
Principal
   |
   +-- governed/recognized by --> Authority
   |
   +-- authorized for ---------> Purpose/Resource
   |
   +-- represented or verified through --> VerificationMaterial
                                              |
                                              +-- role
                                              +-- validity interval
                                              +-- status
                                              +-- provenance
```

Suggested ownership boundary:

- TSMM: canonical principal / verification-material semantics;
- TIS: portable identifiers and contracts;
- TGA: executable compositions, lifecycle rules, and negative cases.

No TSMS change should pre-empt normative TRQP decisions.

## Interop Lab candidate

Create a bounded conformance experiment rather than implementing AAMVA or ICAO infrastructure wholesale.

Candidate identifier: `IC-TRQP-PKI-001`  
Working title: **Principal / Verification-Material Separation**

Minimum scenario:

1. Authority R recognizes Issuer A.
2. A is associated with certificate C1 for purpose P.
3. C1 rotates to C2.
4. C1 remains queryable historically where evidence permits.
5. C2 is subsequently revoked.
6. Source evidence becomes stale.
7. A/material is absent from a source whose completeness is either known or unknown.

Key falsification case:

> A client supplies decision-critical verification material; a server that does not understand that qualifier must not silently ignore it and return an unqualified positive result.

The Interop Lab owns composition testing and evidence only. It does not become the authority for canonical TRQP semantics.

## Upstream disposition

The following inputs should be raised or linked against the upstream TRQP specification when suitable upstream issues are available:

1. separate principal identity from verification material;
2. define critical-extension/profile-negotiation behaviour;
3. define indeterminate, stale, absence, and completeness semantics;
4. clarify absolute versus authority-scoped identifier syntax and comparison;
5. clarify when cryptographic material can itself be a principal;
6. define certificate/key rotation and historical evaluation semantics.

**Tracking rule:** upstream issue references are currently pending. When upstream TRQP issues are created or identified, add their links to this section and treat them as the authoritative specification discussion/disposition. Do not infer upstream acceptance from this downstream document.

## Acceptance criteria for downstream work

- [ ] Canonical TRQP tracker records principal/material separation as an explicit proposition.
- [ ] TSPP work tracks material-bound invalidation, revocation, stale evidence, absence, and historical evaluation without prematurely inventing upstream normative semantics.
- [ ] Interop Lab has a bounded case for principal/material separation and ignored-critical-qualifier failure.
- [ ] Tests distinguish authoritative negative results from unknown/stale/incomplete evidence.
- [ ] Cross-repository artifacts link their semantic dependencies rather than duplicating normative ownership.
- [ ] Upstream TRQP issue links are added when available.

## Residual uncertainty

Ayra #43 is an external proposal, not an adopted TRQP specification change. The precise wire representation, result vocabulary, profile-negotiation mechanism, identifier rules, and compatibility/versioning consequences remain unresolved until upstream disposition exists.
