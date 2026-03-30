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
 *  - Serves companion.html at GET /companion (full UI)
 *  - Serves quick-mode at GET /p1  (Player 1 auto-connect minimal UI)
 *  - Serves quick-mode at GET /p2  (Player 2 auto-connect minimal UI)
 *  - Accepts WebSocket upgrades at ws://<host>:<port>
 *  - Relays every message received from any client to all OTHER connected clients
 *  - Prints ASCII QR codes for P1 and P2 quick URLs on startup
 */

'use strict';

const http    = require('http');
const path    = require('path');
const fs      = require('fs');
const os      = require('os');
const qr      = require('qrcode-terminal');
const { WebSocketServer } = require('ws');

const PORT = parseInt(process.env.PORT || process.argv[2] || '8765', 10);

/* ── HTTP server (serves companion.html) ─────────────────────────────── */
const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];

  // /p1 and /p2 redirect to companion with the player pre-set
  if (url === '/p1') {
    res.writeHead(302, { Location: `/companion?player=1` });
    res.end();
    return;
  }
  if (url === '/p2') {
    res.writeHead(302, { Location: `/companion?player=2` });
    res.end();
    return;
  }

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

/* ── Collect local network IPs ───────────────────────────────────────── */
function getLocalIPs() {
  const ips = [];
  const ifaces = os.networkInterfaces();
  for (const name of Object.keys(ifaces)) {
    for (const iface of ifaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }
  return ips;
}

/* ── Print QR codes sequentially (callback-based) ───────────────────── */
function printQRCode(label, url, callback) {
  console.log(`  ${label}`);
  console.log(`  ${url}`);
  qr.generate(url, { small: true }, (qrStr) => {
    // Indent each line by 2 spaces for readability
    const indented = qrStr.split('\n').map(l => '  ' + l).join('\n');
    console.log(indented);
    if (callback) callback();
  });
}

/* ── Start & print connection info ───────────────────────────────────── */
server.listen(PORT, '0.0.0.0', () => {
  const ips = getLocalIPs();

  console.log('\n🥁  Drum Game — Wireless Server\n');

  if (ips.length === 0) {
    // Fallback: no external network found, show localhost only
    const p1 = `http://localhost:${PORT}/companion?player=1`;
    const p2 = `http://localhost:${PORT}/companion?player=2`;
    console.log('  (No external network interface found — showing localhost URLs)\n');
    printQRCode('🎮 Player 1 (localhost)', p1, () => {
      printQRCode('🎮 Player 2 (localhost)', p2, () => {
        console.log(`  🎮 Game WebSocket  ws://localhost:${PORT}`);
        console.log('\n  Press Ctrl+C to stop.\n');
      });
    });
    return;
  }

  // Print QR codes for each local IP
  const ip = ips[0]; // primary interface
  const p1Url = `http://${ip}:${PORT}/companion?player=1`;
  const p2Url = `http://${ip}:${PORT}/companion?player=2`;

  if (ips.length > 1) {
    console.log(`  (Multiple interfaces found: ${ips.join(', ')} — using ${ip})\n`);
  }

  printQRCode('📱 Player 1', p1Url, () => {
    printQRCode('📱 Player 2', p2Url, () => {
      console.log(`  🎮 Game WebSocket  ws://${ip}:${PORT}\n`);
      if (ips.length > 1) {
        for (const extraIp of ips.slice(1)) {
          console.log(`     Also available on  ws://${extraIp}:${PORT}`);
        }
        console.log('');
      }
      console.log('  Press Ctrl+C to stop.\n');
    });
  });
});

server.on('error', (err) => {
  console.error('Server error:', err.message);
  process.exit(1);
});
