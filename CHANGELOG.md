# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- SVG connector lines between bracket matches showing which two matches feed into the next round
- Proper vertical spacing so later-round match cards are vertically centered between their two feeder matches
- Sticky round titles that remain visible at the top of each column when scrolling vertically in large tournaments
- Champion connector line from the final match to the champion column
- Data attributes (`data-round`, `data-match`) on bracket match elements for connector line mapping
- Unit tests for bracket feeder index mapping and expected connector line counts
- Hint message for disabled "Start Match" button on bracket screen
- Console error logging for all error handlers
- `.gitignore` file

### Changed

- Bracket body gap increased from 20px to 40px to accommodate connector lines
- Bracket columns now use `flex-shrink: 0` for consistent layout
- Connector line colour uses `--text-dim` with 45% opacity for subtle visibility
- Disabled buttons now show explanatory hints instead of silently blocking interaction

### Fixed
- Silent error swallowing in try/catch blocks now logs to console for debugging

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

[Unreleased]: https://github.com/falkorichter/drum-game/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/falkorichter/drum-game/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/falkorichter/drum-game/releases/tag/v0.1.0
