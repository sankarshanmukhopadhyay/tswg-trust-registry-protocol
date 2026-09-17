'use strict';

const OID_URN_PREFIX = 'urn:oid:';
const OID_PATTERN = /^[0-2](?:\.(?:0|[1-9][0-9]*))+$/;

const PKIX_EKU = Object.freeze({
  SERVER_AUTH: 'urn:oid:1.3.6.1.5.5.7.3.1',
  CLIENT_AUTH: 'urn:oid:1.3.6.1.5.5.7.3.2',
  CODE_SIGNING: 'urn:oid:1.3.6.1.5.5.7.3.3',
  EMAIL_PROTECTION: 'urn:oid:1.3.6.1.5.5.7.3.4',
  TIME_STAMPING: 'urn:oid:1.3.6.1.5.5.7.3.8',
  OCSP_SIGNING: 'urn:oid:1.3.6.1.5.5.7.3.9'
});

function requireActionIdentifier(value) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError('action identifier must be a non-empty string');
  }

  if (value.startsWith(OID_URN_PREFIX)) {
    const oid = value.slice(OID_URN_PREFIX.length);
    if (!OID_PATTERN.test(oid)) {
      throw new TypeError('OID action identifiers must use canonical urn:oid:<dotted-decimal> form');
    }
  }

  return value;
}

function describeActionIdentifier(value) {
  const identifier = requireActionIdentifier(value);
  if (!identifier.startsWith(OID_URN_PREFIX)) {
    return Object.freeze({
      identifier,
      kind: 'profile-or-local'
    });
  }

  return Object.freeze({
    identifier,
    kind: 'oid',
    oid: identifier.slice(OID_URN_PREFIX.length)
  });
}

/**
 * Action identifiers are compared exactly unless a negotiated profile supplies
 * an explicit equivalence rule. This helper deliberately performs no aliases,
 * vocabulary guessing, OID-to-token translation, or semantic broadening.
 */
function actionIdentifiersEqual(left, right) {
  return requireActionIdentifier(left) === requireActionIdentifier(right);
}

module.exports = {
  OID_URN_PREFIX,
  PKIX_EKU,
  requireActionIdentifier,
  describeActionIdentifier,
  actionIdentifiersEqual
};
