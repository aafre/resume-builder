/// <reference types="vitest" />
import { describe, it, expect, beforeEach } from 'vitest';
import { capturePrerenderPayloads, getPrerenderPayload } from '../utils/prerenderPayload';

/**
 * The capture has to happen before React replaces #root with a lazy route's
 * Suspense fallback, so these tests pin the two properties that matter: a
 * payload survives being read after its tag is gone, and a malformed payload
 * costs the page its fast path rather than its render.
 */

const addPayload = (id: string, json: string) => {
  const el = document.createElement('script');
  el.type = 'application/json';
  el.id = id;
  el.setAttribute('data-prerender-payload', '');
  el.textContent = json;
  document.body.appendChild(el);
  return el;
};

describe('prerenderPayload', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('reads a captured payload back after its tag has been removed', () => {
    const el = addPayload('job-example-data', JSON.stringify({ meta: { slug: 'receptionist' } }));
    capturePrerenderPayloads();

    // What the Suspense fallback does to #root:
    el.remove();

    expect(getPrerenderPayload<{ meta: { slug: string } }>('job-example-data')).toEqual({
      meta: { slug: 'receptionist' },
    });
  });

  it('skips a malformed payload instead of throwing', () => {
    addPayload('broken-data', '{ not json');

    expect(() => capturePrerenderPayloads()).not.toThrow();
    expect(getPrerenderPayload('broken-data')).toBeNull();
  });

  it('returns null for an id that was never prerendered', () => {
    capturePrerenderPayloads();

    expect(getPrerenderPayload('absent-data')).toBeNull();
  });

  it('ignores json script tags that are not payload tags', () => {
    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = 'schema-graph';
    el.textContent = JSON.stringify({ '@type': 'FAQPage' });
    document.body.appendChild(el);

    capturePrerenderPayloads();

    expect(getPrerenderPayload('schema-graph')).toBeNull();
  });
});
