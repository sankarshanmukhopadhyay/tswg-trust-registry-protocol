const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

const {
  validateEnvelope,
  projectTransportFacts,
  checkCriticalTransportContext,
  correlates,
  classifyTspFailure
} = require('../development/verification-material/tsp-binding');

const ROOT = path.resolve(__dirname, '..');
const BINDING_DIR = path.join(ROOT, 'specification', 'v3', 'bindings', 'tsp');

function fixture(name) {
  return JSON.parse(fs.readFileSync(path.join(BINDING_DIR, 'examples', name), 'utf8'));
}

const query = fixture('query.json');
const response = fixture('response.json');
const problem = fixture('problem.json');

test('binding envelope schema freezes protocol, version, binding and message classes', () => {
  const schema = JSON.parse(fs.readFileSync(path.join(BINDING_DIR, 'schema.json'), 'utf8'));
  assert.equal(schema.properties.protocol.const, 'trqp');
  assert.equal(schema.properties.protocol_version.const, '3.0-candidate');
  assert.equal(schema.properties.binding.const, 'tsp');
  assert.deepEqual(schema.properties.message_type.enum, ['query', 'response', 'problem']);
  assert.equal(schema.additionalProperties, false);
});

test('worked query, response and problem envelopes satisfy binding-level validation', () => {
  for (const envelope of [query, response, problem]) {
    assert.deepEqual(validateEnvelope(envelope), { ok: true, errors: [] });
  }
});

test('TSP transport facts do not manufacture TRQP semantic identity or decision state', () => {
  const facts = projectTransportFacts({
    sender_vid: 'did:example:sender',
    receiver_vid: 'did:example:receiver',
    authenticated: true,
    relationship_verified: true,
    intermediary_vid: 'did:example:router'
  });

  assert.deepEqual(facts, {
    tsp_sender_vid: 'did:example:sender',
    tsp_receiver_vid: 'did:example:receiver',
    tsp_authenticated: true,
    tsp_relationship_verified: true
  });

  for (const forbidden of ['entity_id', 'authority_id', 'recognized', 'authorized', 'decision']) {
    assert.equal(Object.hasOwn(facts, forbidden), false);
  }
});

test('matching decision-critical requester VID is verified without rewriting the proposition', () => {
  const before = JSON.parse(JSON.stringify(query));
  const result = checkCriticalTransportContext(query, {
    sender_vid: 'did:example:tsp-requester',
    receiver_vid: 'did:example:registry-tsp',
    authenticated: true,
    relationship_verified: true
  });

  assert.equal(result.ok, true);
  assert.deepEqual(query, before);
  assert.equal(result.transport_facts.tsp_sender_vid, 'did:example:tsp-requester');
  assert.equal(Object.hasOwn(result.transport_facts, 'entity_id'), false);
});

test('mismatched decision-critical requester VID fails closed before semantic evaluation', () => {
  const result = checkCriticalTransportContext(query, {
    sender_vid: 'did:example:attacker',
    receiver_vid: 'did:example:registry-tsp',
    authenticated: true,
    relationship_verified: true
  });

  assert.equal(result.ok, false);
  assert.equal(result.problem.kind, 'binding-processing-failure');
  assert.equal(result.problem.code, 'tsp-critical-context-mismatch');
  assert.equal(result.problem.failed_requirement, 'TRQP3-TSP-006');
  assert.equal(Object.hasOwn(result.problem, 'decision'), false);
});

test('missing authenticated TSP fact for critical context fails closed', () => {
  const result = checkCriticalTransportContext(query, {
    receiver_vid: 'did:example:registry-tsp',
    authenticated: false
  });

  assert.equal(result.ok, false);
  assert.equal(result.problem.code, 'unavailable-authenticated-tsp-context');
  assert.equal(Object.hasOwn(result.problem, 'decision'), false);
});

test('a verified TSP relationship does not imply TRQP recognition or authorization', () => {
  const facts = projectTransportFacts({
    sender_vid: query.body.entity_id,
    receiver_vid: query.body.authority_id,
    authenticated: true,
    relationship_verified: true
  });

  assert.equal(facts.tsp_authenticated, true);
  assert.equal(facts.tsp_relationship_verified, true);
  assert.equal(Object.hasOwn(facts, 'recognized'), false);
  assert.equal(Object.hasOwn(facts, 'authorized'), false);
});

test('response and problem correlation is explicit and independent of TSP relationship state', () => {
  assert.equal(correlates(query, response), true);
  assert.equal(correlates(query, problem), true);

  const substituted = { ...response, in_reply_to: 'urn:uuid:ffffffff-ffff-4fff-8fff-ffffffffffff' };
  assert.equal(correlates(query, substituted), false);
});

test('TSP transport failures remain processing failures rather than semantic negatives', () => {
  for (const code of [
    'tsp-vid-verification-failed',
    'tsp-route-unavailable',
    'tsp-decryption-failed',
    'tsp-message-timeout'
  ]) {
    const failure = classifyTspFailure(code, 'synthetic test failure');
    assert.equal(failure.kind, 'binding-processing-failure');
    assert.equal(failure.failed_requirement, 'TRQP3-TSP-008');
    assert.equal(Object.hasOwn(failure, 'decision'), false);
  }
});

test('problem envelopes are forbidden from carrying semantic decisions', () => {
  const invalid = {
    ...problem,
    body: { ...problem.body, decision: 'negative' }
  };
  const validation = validateEnvelope(invalid);
  assert.equal(validation.ok, false);
  assert.match(validation.errors.join(' '), /must not contain semantic decision/);
});

test('binding specification exposes all twelve experimental requirements', () => {
  const spec = fs.readFileSync(path.join(BINDING_DIR, 'TRQP-TSP-BINDING.md'), 'utf8');
  for (let i = 1; i <= 12; i += 1) {
    const id = `TRQP3-TSP-${String(i).padStart(3, '0')}`;
    assert.match(spec, new RegExp(id));
  }
});
