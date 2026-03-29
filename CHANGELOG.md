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

### Changed

- Bracket body gap increased from 20px to 40px to accommodate connector lines
- Bracket columns now use `flex-shrink: 0` for consistent layout
- Connector line colour uses `--text-dim` with 45% opacity for subtle visibility

[Unreleased]: https://github.com/falkorichter/drum-game/compare/main...HEAD
