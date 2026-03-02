import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import crypto from 'node:crypto';
import fs from 'node:fs';
import net from 'node:net';
import { fileURLToPath } from 'node:url';

import DHT from 'hyperdht';

import { ScBridgeClient } from '../src/sc-bridge/client.js';
import { peerStart, peerStatus, peerStop } from '../src/peer/peerManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

async function pickFreePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.unref();
    srv.on('error', reject);
    srv.listen(0, '127.0.0.1', () => {
      const addr = srv.address();
      const port = typeof addr === 'object' && addr ? addr.port : 0;
      srv.close(() => resolve(port));
    });
  });
}

test('e2e: peermgr can start/stop a peer (single-store guard enforced)', async (t) => {
  const runId = crypto.randomBytes(4).toString('hex');
  const store = `e2e-peermgr-${runId}`;
  const name = `peer-${runId}`;
  const name2 = `peer2-${runId}`;
  const scPort = await pickFreePort();
  const rfqChannel = `rfq-${runId}`;

  const dhtPort = 30000 + crypto.randomInt(0, 10000);
  const dht = DHT.bootstrapper(dhtPort, '127.0.0.1');
  await dht.ready();
  const dhtBootstrap = `127.0.0.1:${dhtPort}`;
  t.after(async () => {
    try {
      await dht.destroy({ force: true });
    } catch (_e) {}
  });

  const start = await peerStart({
    repoRoot,
    name,
    store,
    scPort,
    subnetChannel: `e2e-subnet-${runId}`,
    dhtBootstrap: [dhtBootstrap],
    sidechannels: [rfqChannel],
    // Keep e2e fast.
    sidechannelPowEnabled: false,
    sidechannelWelcomeRequired: false,
    readyTimeoutMs: 30_000,
  });

  t.after(async () => {
    try {
      await peerStop({ repoRoot, name, signal: 'SIGINT', waitMs: 5000 });
    } catch (_e) {}
  });

  assert.ok(['peer_started', 'peer_already_running'].includes(start.type), `unexpected start type: ${start.type}`);
  assert.equal(start.name, name);
  assert.equal(start.store, store);
  assert.ok(start.sc_bridge?.url?.includes(String(scPort)));
  assert.ok(start.sc_bridge?.token_file);

  // Store guard: starting another instance with the same store must fail.
  const scPort2 = await pickFreePort();
  await assert.rejects(
    () =>
      peerStart({
        repoRoot,
        name: name2,
        store,
        scPort: scPort2,
        subnetChannel: `e2e-subnet-${runId}-2`,
        dhtBootstrap: [dhtBootstrap],
        sidechannels: [rfqChannel],
        sidechannelPowEnabled: false,
        sidechannelWelcomeRequired: false,
        readyTimeoutMs: 10_000,
      }),
    /already running/i
  );

  const token = String(fs.readFileSync(start.sc_bridge.token_file, 'utf8') || '').trim();
  assert.ok(token.length >= 32, 'expected non-empty sc-bridge token');

  const sc = new ScBridgeClient({ url: start.sc_bridge.url, token });
  await sc.connect({ timeoutMs: 15_000 });
  const info = await sc.info();
  sc.close();
  assert.equal(info.type, 'info');
  const peerStore = String(info.info?.peerStore || '');
  assert.ok(peerStore.endsWith(store) || peerStore.endsWith(`${store}/`), `unexpected peerStore: ${peerStore}`);

  const status = peerStatus({ repoRoot, name });
  assert.equal(status.type, 'peer_status');
  assert.equal(status.peers.length, 1);
  assert.equal(status.peers[0].store, store);
  assert.equal(status.peers[0].alive, true);

  const stopped = await peerStop({ repoRoot, name, signal: 'SIGINT', waitMs: 5000 });
  assert.equal(stopped.type, 'peer_stopped');
  assert.equal(stopped.ok, true);

  const status2 = peerStatus({ repoRoot, name });
  assert.equal(status2.type, 'peer_status');
  assert.equal(status2.peers.length, 1);
  assert.equal(status2.peers[0].alive, false);
});
