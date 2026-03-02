import test from 'node:test';
import assert from 'node:assert/strict';

import { fetchJson } from '../src/price/request.js';

test('price fetchJson: works without AbortController (Pear/Bare fallback)', async () => {
  const savedFetch = globalThis.fetch;
  const savedAbort = globalThis.AbortController;
  try {
    // Simulate Pear/Bare runtimes that lack AbortController.
    // Keep fetch minimal and deterministic.
    globalThis.AbortController = undefined;
    globalThis.fetch = async () => ({
      ok: true,
      status: 200,
      async text() {
        return '{"ok":true}';
      },
    });

    const r = await fetchJson('https://example.invalid', { timeoutMs: 50 });
    assert.deepEqual(r, { ok: true });
  } finally {
    globalThis.fetch = savedFetch;
    globalThis.AbortController = savedAbort;
  }
});

