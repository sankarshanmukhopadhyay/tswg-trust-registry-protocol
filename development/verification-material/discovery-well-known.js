'use strict';

const { validateCapabilityDocument } = require('./discovery');

const WELL_KNOWN_PATH = '/.well-known/trqp-capabilities';

function capabilityUrl(origin) {
  const url = new URL(origin);
  url.pathname = WELL_KNOWN_PATH;
  url.search = '';
  url.hash = '';
  return url.toString();
}

function resolveWellKnownResponse({ origin, status, content_type, body }, options = {}) {
  if (status !== 200) return { resolved: false, reason: 'capability-metadata-unavailable' };
  if (typeof content_type !== 'string' || !content_type.toLowerCase().startsWith('application/json')) {
    return { resolved: false, reason: 'malformed-capability-document' };
  }

  let document;
  try {
    document = typeof body === 'string' ? JSON.parse(body) : body;
  } catch {
    return { resolved: false, reason: 'malformed-capability-document' };
  }

  const validation = validateCapabilityDocument(document, options);
  if (!validation.valid) return { resolved: false, reason: validation.reason };

  return {
    resolved: true,
    binding: 'https-well-known-experiment',
    retrieval_url: capabilityUrl(origin),
    capability: validation
  };
}

module.exports = { WELL_KNOWN_PATH, capabilityUrl, resolveWellKnownResponse };
