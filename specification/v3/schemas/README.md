# TRQP v3 candidate schemas

This directory is the stable public discovery surface for candidate wire schemas.

The executable source schemas are currently maintained at:

- [`../../../development/verification-material/schemas/wp7-request.schema.json`](../../../development/verification-material/schemas/wp7-request.schema.json) — qualified candidate request
- [`../../../development/verification-material/schemas/wp7-response.schema.json`](../../../development/verification-material/schemas/wp7-response.schema.json) — candidate semantic response

The historical `wp7-*` filenames are engineering provenance, not intended public API names. `openapi.yaml` in the parent directory provides stable developer-facing component names (`QualifiedRequest`, `SemanticResponse`, `Evidence`, `Problem`) while retaining one executable schema source to avoid drift.

A future schema-publication tranche may physically promote/rename the JSON Schema files once final upstream naming and identifiers are decided. Until then, implementations should treat the candidate specification and OpenAPI contract as the public navigation surface and the source JSON Schemas as executable validation artifacts.

Schema acceptance does not override normative semantics: unsupported decision-critical context, material qualification, negotiation failure or insufficient evidence must still fail according to the candidate specification.