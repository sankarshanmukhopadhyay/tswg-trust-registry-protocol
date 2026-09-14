'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { bindRequest, processTransportOutcome, composeProfiles } = require('../development/verification-material/transport-binding');

test('binding preserves exact decision-critical semantic envelope', () => {
  const request = {
    principal: 'did:example:a',
    action: 'purchase',
    resource: 'urn:item:1',
    evaluation_time: '2026-09-14T00:00:00Z',
    critical_context: ['delegation'],
    context: { delegation: 'urn:evidence:d1' }
  };
  const bound = bindRequest(request, { endpoint: 'https://registry.example/trqp' });
  assert.deepEqual(bound.semantic, request);
});

test('HTTP 200 does not manufacture semantic positive', () => {
  const result = processTransportOutcome({ status: 200 });
  assert.equal(result.kind, 'processing-failure');
  assert.equal(result.decision, null);
});

test('HTTP 404 does not manufacture authoritative semantic negative', () => {
  const result = processTransportOutcome({ status: 404 });
  assert.equal(result.kind, 'processing-failure');
  assert.equal(result.decision, null);
});

test('timeout/unavailability remains processing failure', () => {
  const result = processTransportOutcome({ problem: { type: 'urn:trqp:timeout' } });
  assert.equal(result.kind, 'processing-failure');
  assert.equal(result.decision, null);
});

test('explicit semantic negative survives transport mapping', () => {
  const result = processTransportOutcome({ status: 200, semantic: { decision: 'negative', reason: 'authoritative-absence' } });
  assert.equal(result.kind, 'semantic');
  assert.equal(result.decision, 'negative');
});

test('profile composition is additive when obligations are compatible', () => {
  const result = composeProfiles([
    { required: ['critical-context', 'material-binding'] },
    { required: ['fresh-evidence'] }
  ]);
  assert.equal(result.admissible, true);
  assert.deepEqual(new Set(result.required), new Set(['critical-context', 'material-binding', 'fresh-evidence']));
});

test('conflicting profiles fail closed before evaluation', () => {
  const result = composeProfiles([
    { required: ['critical-context'] },
    { prohibited: ['critical-context'] }
  ]);
  assert.equal(result.admissible, false);
  assert.equal(result.reason, 'conflicting-profile-obligations');
});
