'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { CORE, composeAssuranceProfiles } = require('../development/verification-material/profile-composition');
const at = '2026-10-12T00:00:00Z';
const opts = { at, trustedAuthorities: ['urn:authority:governance', 'urn:authority:security'] };
const p = (id, more = {}) => ({
  id, authority: 'urn:authority:governance', version: '1', status: 'active',
  effective_from: '2026-01-01T00:00:00Z', required: [], prohibited: [], ...more
});
test('independently governed profiles compose additively without removing core semantics', () => {
  const r = composeAssuranceProfiles([p('gov',{required:['audit']}),p('sec',{authority:'urn:authority:security',required:['mTLS']})],opts);
  assert.equal(r.admissible,true);
  CORE.forEach(x=>assert.ok(r.required.includes(x)));
  assert.deepEqual(r.profile_versions,{gov:'1',sec:'1'});
});
test('profile cannot prohibit a mandatory core rule',()=>{
  const r=composeAssuranceProfiles([p('bad',{prohibited:[CORE[0]]})],opts);
  assert.equal(r.admissible,false);assert.equal(r.reason,'conflicting-profile-obligations');
});
test('incompatible profile requirements fail closed',()=>{
  assert.equal(composeAssuranceProfiles([p('one',{required:['audit']}),p('two',{prohibited:['audit']})],opts).admissible,false);
});
test('untrusted authority never receives governance power from metadata',()=>{
  const r=composeAssuranceProfiles([p('bad',{authority:'urn:unknown'})],opts);
  assert.equal(r.reason,'invalid-or-untrusted-profile');assert.equal(r.decision,'indeterminate');
});
test('unknown, duplicate and malformed obligations cannot be silently repaired',()=>{
  for(const input of [[],[p('x',{required:['audit','audit']})],[p('x'),p('x')],[p('x',{required:'audit'})]]) {
    assert.equal(composeAssuranceProfiles(input,opts).admissible,false);
  }
});
test('effective window is start-inclusive and expiry-exclusive',()=>{
  const profile=p('exp',{effective_from:at,expires_at:'2026-10-13T00:00:00Z'});
  assert.equal(composeAssuranceProfiles([profile],opts).admissible,true);
  assert.equal(composeAssuranceProfiles([profile],{...opts,at:'2026-10-13T00:00:00Z'}).reason,'inactive-profile');
});
test('suspended and superseded profiles cannot be admitted',()=>{
  for (const status of ['suspended','superseded','revoked',null]) {
    assert.equal(composeAssuranceProfiles([p('x',{status})],opts).reason,'inactive-profile');
  }
});
test('missing or invalid evaluation time cannot become success',()=>{
  assert.equal(composeAssuranceProfiles([p('x')],{trustedAuthorities:opts.trustedAuthorities}).reason,'invalid-evaluation-time');
  assert.equal(composeAssuranceProfiles([p('x')],{...opts,at:'nonsense'}).admissible,false);
});
