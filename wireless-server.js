#!/usr/bin/env node
/**
 * wireless-server.js
 *
 * Optional relay server for Wireless Drum-Stick Mode.
 * Phones open companion.html in their browser, connect here via WebSocket,
 * and their accelerometer/gyro "hits" are forwarded to the main game page.
 *
 * Usage:
 *   node wireless-server.js [port]
 *   npm run wireless
 *
 * The server:
 *  - Serves companion.html at GET /companion
 *  - Accepts WebSocket upgrades at ws://<host>:<port>
 *  - Relays every message received from any client to all OTHER connected clients
 *  - Prints local IP addresses so you can easily point your phone at the right URL
 */

'use strict';

const http  = require('http');
const path  = require('path');
const fs    = require('fs');
const os    = require('os');
const { WebSocketServer } = require('ws');

const PORT = parseInt(process.env.PORT || process.argv[2] || '8765', 10);

/* ── HTTP server (serves companion.html) ─────────────────────────────── */
const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];

  if (url === '/' || url === '/companion' || url === '/companion.html') {
    const filePath = path.join(__dirname, 'companion.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error('Could not read companion.html:', err);
        res.writeHead(500);
        res.end('Could not serve companion.html');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    });
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

/* ── WebSocket relay ─────────────────────────────────────────────────── */
const wss = new WebSocketServer({ server });
const clients = new Set();

wss.on('connection', (ws, req) => {
  clients.add(ws);
  const addr = req.socket.remoteAddress;
  console.log(`[WS] Client connected: ${addr}  (total: ${clients.size})`);

  // Notify all clients of the updated count
  broadcast({ type: 'status', clients: clients.size }, null);

  ws.on('message', (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw.toString());
    } catch (e) {
      console.error('[WS] Invalid JSON from client:', e.message);
      return;
    }

    // Stamp with server receive time for diagnostics
    msg.serverTs = Date.now();

    if (msg.type === 'ping') {
      // Respond only to the sender
      try {
        ws.send(JSON.stringify({ type: 'pong', clientTs: msg.clientTs, serverTs: msg.serverTs }));
      } catch (e) {
        console.error('[WS] Error sending pong:', e.message);
      }
      return;
    }

    // Relay to all other connected clients
    broadcast(msg, ws);
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log(`[WS] Client disconnected: ${addr}  (total: ${clients.size})`);
    broadcast({ type: 'status', clients: clients.size }, null);
  });

  ws.on('error', (err) => {
    console.error(`[WS] Socket error (${addr}):`, err.message);
  });
});

function broadcast(obj, exclude) {
  const data = JSON.stringify(obj);
  for (const client of clients) {
    if (client === exclude) continue;
    if (client.readyState !== 1 /* OPEN */) continue;
    try {
      client.send(data);
    } catch (e) {
      console.error('[WS] Broadcast error:', e.message);
    }
  }
}

/* ── Start & print connection info ───────────────────────────────────── */
server.listen(PORT, '0.0.0.0', () => {
  console.log('\n🥁  Drum Game — Wireless Server\n');
  console.log(`   WebSocket   ws://localhost:${PORT}`);
  console.log(`   Companion   http://localhost:${PORT}/companion\n`);

  // Print all non-loopback IPv4 addresses so phones can connect
  const ifaces = os.networkInterfaces();
  for (const name of Object.keys(ifaces)) {
    for (const iface of ifaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        console.log(`   📱 Phone URL  http://${iface.address}:${PORT}/companion`);
        console.log(`   🎮 Game URL   ws://${iface.address}:${PORT}`);
      }
    }
  }

  console.log('\n   Press Ctrl+C to stop.\n');
});

server.on('error', (err) => {
  console.error('Server error:', err.message);
  process.exit(1);
});
