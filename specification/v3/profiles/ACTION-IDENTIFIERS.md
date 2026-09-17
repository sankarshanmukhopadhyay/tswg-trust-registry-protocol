# TRQP v3 Action Identifier Profile

> **Status:** downstream candidate profile for TRQP v3. This profile is not an adopted Trust Over IP specification and does not modify approved TRQP v2.

## 1. Purpose

TRQP v3 treats `action` as a decision-relevant part of the exact bounded proposition. This profile defines how independently governed ecosystems can use stable action identifiers without replacing the existing `action: string` wire contract.

The profile also defines the boundary between TRQP authorization semantics and externally defined purpose vocabularies, including X.509 Extended Key Usage (EKU) OIDs.

## 2. Core rule

An action identifier names the **purpose or action whose authorization is being evaluated by TRQP**. It does not, by itself, establish that any particular credential, certificate, key, service, or principal satisfies the rules associated with that external vocabulary.

Changing the action identifier changes the proposition and requires re-evaluation. A processor MUST NOT silently broaden, alias, rewrite, or substitute an action identifier unless an explicitly negotiated profile defines an equivalence rule. [`TRQP3-ACT-001`, `TRQP3-ACT-005`]

## 3. Identifier forms

The `action` member remains a non-empty string.

Deployments intended to interoperate across governance domains SHOULD use globally scoped identifiers rather than unqualified local tokens. [`TRQP3-ACT-002`]

Where an action is identified by an Object Identifier (OID), the canonical TRQP representation SHOULD use the OID URN form:

```text
urn:oid:<dotted-decimal>
```

Example:

```text
urn:oid:1.3.6.1.5.5.7.3.3
```

This profile does not allocate a TRQP-specific OID arc. Existing identifiers SHOULD be reused where their published semantics exactly match the action being evaluated. A deployment MAY define additional URI- or OID-based vocabularies when no suitable established identifier exists, but ownership and semantics must be discoverable from the applicable governance/profile definition.

Local tokens such as `purchase` remain syntactically valid under the v3 candidate. They are not globally interoperable merely because two authorities use the same text.

## 4. Reuse of external vocabularies

Reusing an externally defined identifier imports only the action or purpose meaning needed to identify the TRQP proposition. It MUST NOT silently import unrelated validation, credential, transport, or authorization semantics from the external protocol. [`TRQP3-ACT-003`]

For example, a PKIX EKU OID can provide a stable identifier for a purpose such as code signing. TRQP then evaluates a proposition such as:

> Is principal P authorized by authority A for the purpose identified by `urn:oid:1.3.6.1.5.5.7.3.3` with respect to resource R and any declared decision-critical qualifiers?

The answer remains a TRQP semantic decision derived from authoritative registry evidence.

## 5. Extended Key Usage (EKU) boundary

When an EKU OID is reused as a TRQP action identifier, it identifies the purpose of the TRQP authorization proposition only. [`TRQP3-ACT-004`]

A processor or consumer MUST NOT infer from the action identifier that:

- a particular X.509 certificate contains the corresponding EKU;
- certificate path validation has succeeded;
- the EKU is valid or sufficient for the relying operation;
- the certificate or key is current, unrevoked, uncompromised, or applicable to the principal; or
- the certificate itself grants governance authorization.

Conversely, possession or successful validation of a certificate containing an EKU MUST NOT establish a positive TRQP authorization result.

Where a proposition is also qualified by certificate or key material, verification-material validity/applicability and action authorization are independent decision inputs. Both MUST be established where the governing proposition requires both.

This preserves the v3 separation between principal state, verification-material state, action authorization, recognition, and authority.

## 6. Worked example

```json
{
  "trqp_version": "3.0-candidate",
  "entity_id": "did:example:publisher",
  "authority_id": "did:example:software-trust-registry",
  "action": "urn:oid:1.3.6.1.5.5.7.3.3",
  "resource": "urn:artifact:release:example-1",
  "critical_context": ["verification_material"],
  "context": {
    "verification_material": "urn:sha256:codesigning-cert"
  },
  "required_profiles": ["trqp-v3-action-identifiers"]
}
```

A positive result means that sufficient authoritative evidence supports this exact TRQP proposition. It does not mean that the referenced certificate was independently proven to contain the code-signing EKU unless that fact is separately established by the applicable verification-material processing and evidence.

## 7. Processing requirements

### TRQP3-ACT-001 — proposition identity

The processor MUST treat the exact action identifier as part of proposition identity. Changing it requires re-evaluation.

### TRQP3-ACT-002 — global identifiers

For cross-domain interoperability, deployments SHOULD use globally scoped identifiers. OID-valued actions SHOULD use canonical `urn:oid:<dotted-decimal>` form.

### TRQP3-ACT-003 — bounded semantic import

Reuse of an externally defined identifier MUST import only the referenced purpose/action meaning required to identify the TRQP proposition. Other protocol semantics remain independently governed and evaluated.

### TRQP3-ACT-004 — EKU non-inference

An EKU OID used as an action identifier MUST NOT imply certificate EKU presence, certificate validity, material applicability, or TRQP authorization. Certificate EKU presence or validity MUST NOT imply TRQP authorization.

### TRQP3-ACT-005 — no silent equivalence

Unknown, unsupported, differently serialized, or locally aliased action identifiers MUST NOT be silently broadened, rewritten, or treated as equivalent without an explicit negotiated equivalence rule.

## 8. Conformance and evidence

Conformance evidence for this profile SHOULD demonstrate at least:

1. exact OID action match can participate in a positive proposition;
2. a different OID produces an action mismatch even when principal/material/authority/resource otherwise match;
3. certificate EKU metadata does not create a TRQP authorization record;
4. a local token is not automatically equivalent to a standardized OID; and
5. malformed `urn:oid:` identifiers are rejected by profile-aware validation.

Executable downstream evidence is provided by:

- `development/verification-material/action-identifiers.js`; and
- `tests/action-identifiers.test.js`.

## 9. Security and governance considerations

Identifier reuse reduces vocabulary proliferation but can create semantic confusion if the external identifier is interpreted as carrying more authority than it actually does. Implementers therefore MUST preserve the authority boundary between identifier meaning and authoritative decision evidence.

Private OIDs and locally governed URI namespaces MAY be used, but relying parties need an applicable profile or governance definition that establishes ownership and meaning. Mere syntactic validity is not semantic interoperability.

An implementation MUST NOT treat recognition of an identifier namespace as recognition of the authority that issued a TRQP result.

## 10. Compatibility

This profile is additive to the candidate v3 wire contract because `action` remains a string. It tightens interpretation for deployments that claim this profile.

Approved v2 remains unchanged. Upstream adoption, final vocabulary design, and any future standardized action registry remain external governance decisions.