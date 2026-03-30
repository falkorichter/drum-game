# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.3] - 2026-03-30

### Fixed
- **companion.html**: `localStorage.setItem/getItem` now wrapped in try-catch, fixing a `QuotaExceededError` (or `SecurityError`) crash on iOS Safari in Private Browsing mode — this was the root cause of the "Script error." reported via Eruda on iPad.
- **companion.html**: Added a visible error banner (`#global-error-banner`) and global `window.onerror` / `unhandledrejection` handlers so JavaScript errors are displayed on the page itself, removing the need for Eruda or devtools for mobile debugging.

## [0.4.2] - 2026-03-30

### Added
- **Quick-mode companion URLs** — `/p1` and `/p2` shortcuts redirect to `companion.html?player=1` and `companion.html?player=2` respectively. These auto-select the player role and auto-connect to the WebSocket relay on page load, showing a minimal UI with only the HIT button and motion sensor visible.
- **ASCII QR codes on startup** — `wireless-server.js` now prints ASCII QR codes (via `qrcode-terminal`) for the P1 and P2 quick URLs at server startup, making it trivial to scan-and-play from a phone without typing any URL.
- **`qrcode-terminal` dependency** added to `package.json` for terminal QR code rendering.
- `exitQuickMode()` function lets users tap "Show full settings" from the minimal companion UI to access the full connection/settings view.

## [0.4.1] - 2026-03-30

### Fixed
- Companion page motion detection now correctly detects non-secure contexts (plain HTTP from a LAN IP) and shows a clear HTTPS warning instead of the misleading "DeviceMotion API not available" message on Chrome Android or the silent "Motion permission denied" on iOS Safari. The tap button is highlighted as the reliable alternative.
- iOS permission button is now hidden when page is not in a secure context (it would always be silently denied anyway).
- `requestMotionPermission()` now checks `window.isSecureContext` before calling `DeviceMotionEvent.requestPermission()` and shows an actionable error message.
- Improved error message when `DeviceMotionEvent.requestPermission()` returns `'denied'` to distinguish system-level denial from the HTTPS issue.

## [0.4.0] - 2026-03-29

### Added

- **Wireless Mode** — phones on the same Wi-Fi network can act as virtual drum sticks
  - `wireless-server.js` — optional Node.js WebSocket relay server (run with `npm run wireless`)
  - `companion.html` — mobile-optimised phone companion page served by the relay server
  - Accelerometer/gyro hit detection via the DeviceMotion API on the companion page (adjustable sensitivity)
  - Manual tap button on the companion page as a fallback (or for players who prefer tapping)
  - Supports iOS permission model for DeviceMotion (`requestPermission` API)
  - RTT-based latency correction: the game subtracts half the measured round-trip time from each wireless hit for millisecond-accurate timing
  - Wireless settings card in the Settings screen (enable/disable toggle, server URL, auto-connect option, live test button)
  - Wireless status pill shown on the match screen whenever wireless mode is active
  - Auto-reconnect with configurable delay when the server connection drops
  - `wireless.test.html` — 35 unit tests covering latency correction, deviation computation, URL validation, and message routing
  - `npm run wireless` script to start the relay server

### Changed

- Version bumped to `0.4.0` (new optional wireless feature)
- `package.json` now lists `ws@^8.18.0` as a runtime dependency (needed only for `npm run wireless`)

## [0.3.1] - 2026-03-29

### Added

- SVG connector lines between bracket matches showing which two matches feed into the next round
- Proper vertical spacing so later-round match cards are vertically centered between their two feeder matches
- Sticky round titles that remain visible at the top of each column when scrolling vertically in large tournaments
- Champion connector line from the final match to the champion column
- Data attributes (`data-round`, `data-match`) on bracket match elements for connector line mapping
- Unit tests for bracket feeder index mapping and expected connector line counts
- Hint message for disabled "Start Match" button on bracket screen
- Console error logging for all error handlers

### Changed

- Bracket body gap increased from 20px to 40px to accommodate connector lines
- Bracket columns now use `flex-shrink: 0` for consistent layout
- Connector line colour uses `--text-dim` with 45% opacity for subtle visibility
- Disabled buttons now show explanatory hints instead of silently blocking interaction

### Fixed
- Silent error swallowing in try/catch blocks now logs to console for debugging

## [0.3.0] - 2026-03-29

### Fixed
- Corrected 5-player bracket test assertion: round 1 has 2 real matches (not 1) with the sequential seeding algorithm

### Added
- GitHub Actions CI workflow to run bracket tests on push and pull request
- Node.js test runner (`run-tests.js`) to execute `.test.html` files headlessly in CI
- `npm test` script in `package.json`

## [0.2.0] - 2026-03-29

### Added
- **JSON export** — download the full tournament state and settings as a portable JSON file from the bracket screen
- **JSON import** — load a previously exported tournament from a JSON file on the tournament setup screen with validation and error reporting
- **ASCII bracket export** — copy a text representation of the bracket to the clipboard (or download as `.txt`) for sharing in chats, emails, or documentation
- `export.test.html` — unit tests for export/import roundtrip, validation, and ASCII bracket generation
- `package.json` with semantic versioning (initial version `0.2.0`)
- `CHANGELOG.md` following Keep a Changelog v1.1.0 format

## [0.1.0] - 2025-01-01

### Added
- Core gameplay — beat hit scoring, countdown, random song offset, auto-end, tie detection
- Settings & audio — MP3 loading, waveform editor, preview, idle music, tournament name, player seed list
- Tournament system — single-elimination bracket, bye handling, bracket visualisation, statistics, persistence
- Match numbers ([PR #3](https://github.com/falkorichter/drum-game/pull/3))
- Click-to-play & best-of-three final ([PR #5](https://github.com/falkorichter/drum-game/pull/5))
- Song validation ([PR #7](https://github.com/falkorichter/drum-game/pull/7))
- `bracket.test.html` — unit tests for bracket logic

[Unreleased]: https://github.com/falkorichter/drum-game/compare/v0.4.3...HEAD
[0.4.3]: https://github.com/falkorichter/drum-game/compare/v0.4.2...v0.4.3
[0.4.2]: https://github.com/falkorichter/drum-game/compare/v0.4.1...v0.4.2
[0.4.1]: https://github.com/falkorichter/drum-game/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/falkorichter/drum-game/compare/v0.3.1...v0.4.0
[0.3.1]: https://github.com/falkorichter/drum-game/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/falkorichter/drum-game/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/falkorichter/drum-game/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/falkorichter/drum-game/releases/tag/v0.1.0
