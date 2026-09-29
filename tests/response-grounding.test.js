const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const groundingSchema = JSON.parse(fs.readFileSync(path.join(ROOT, 'specification/v3/schemas/response-grounding.schema.json'), 'utf8'));

test('grounding remains optional at the response-contract boundary', () => {
  const responseSchema = JSON.parse(fs.readFileSync(path.join(ROOT, 'development/verification-material/schemas/response.schema.json'), 'utf8'));
  assert.equal((responseSchema.required || []).includes('grounding'), false);
});

test('each grounding entry requires source and source authority', () => {
  assert.deepEqual(groundingSchema.items.required.sort(), ['source_authority', 'source_id']);
});

test('grounding vocabulary is bounded and does not contain decision fields', () => {
  assert.equal(groundingSchema.items.additionalProperties, false);
  for (const forbidden of ['decision', 'authorized', 'recognized', 'evidence_state', 'reason']) {
    assert.equal(Object.hasOwn(groundingSchema.items.properties, forbidden), false);
  }
});

test('grounding supports stable reproducibility bindings without requiring raw evidence', () => {
  const properties = groundingSchema.items.properties;
  for (const expected of ['source_version', 'digest', 'evidence_ref']) {
    assert.equal(Object.hasOwn(properties, expected), true);
  }
  for (const forbidden of ['raw_evidence', 'database_id', 'signature', 'private_state']) {
    assert.equal(Object.hasOwn(properties, forbidden), false);
  }
});

test('digest is explicitly algorithm-qualified', () => {
  assert.match(groundingSchema.items.properties.digest.pattern, /:/);
});

test('historical grounding exposes an effective interval', () => {
  const properties = groundingSchema.items.properties;
  assert.equal(properties.effective_from.format, 'date-time');
  assert.equal(properties.effective_until.format, 'date-time');
});

test('grounding schema does not prescribe a persistence model', () => {
  const serialized = JSON.stringify(groundingSchema);
  for (const implementationTerm of ['database', 'event_log', 'table_name', 'credential_store']) {
    assert.equal(serialized.includes(implementationTerm), false);
  }
});
