# Approved-v2 publication integrity

Status: downstream informative evidence; no normative amendment.

Authority baseline: [upstream commit 6863733878f3657e05f70764bb474a9fb918de9a](https://github.com/trustoverip/tswg-trust-registry-protocol/commit/6863733878f3657e05f70764bb474a9fb918de9a). All four approved schema files and the three other copies per schema were byte-identical at inspection. The approved API insert directives nevertheless referenced the working draft. This change corrects only the insert source, not the approved schema bytes or normative prose.

Run from the repository root:

```sh
node --test tests/approved-publication.test.js
```

The tests pin the upstream Git blob identities of approved schemas, check the actual SpecUp config and insert directives, compare the two compatibility directories structurally (including annotations), and demonstrate rejection of substituted insert targets and altered required fields. Draft schemas are permitted to evolve independently. The compatibility directories are treated as approved-v2 distribution copies for this downstream check; an intentional change requires explicit review of that assumption and the pins.

JSON Schema validation alone is insufficient: the approved Identifiers and Conformance sections require non-empty action/resource strings even though the request schemas lack minLength. RFC 3339 format handling also depends on validator configuration. The tests record these boundaries, not a new validator or endpoint verdict. They do not establish actual registry authority, global uniqueness, governance-framework discovery, transport behavior or historical evidence sufficiency.

The existing CTS owns executable endpoint conformance and replay; this check is source/publication integrity only. Some CTS profile fixtures have different request/response shapes; reconciling their applicability is separate work. No CTS, TSPP, Hub or candidate-v3 semantics are changed.

The PR workflow runs the checks and existing SpecUp render command without deployment. It checks both output entry points exist; it does not certify rendered HTML semantic equivalence. The existing main publication workflow runs the integrity check before rendering/deployment.
