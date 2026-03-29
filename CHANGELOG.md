# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Internationalization (i18n) system with language selector in Settings
- Translations for German (de), Spanish (es), French (fr), Japanese (ja), Portuguese (pt), and Chinese Simplified (zh_CN)
- CHANGELOG.md following Keep a Changelog v1.1.0 format
- package.json with semantic version tracking
- .gitignore file
- Development Metadata section in README
- Hint message for disabled "Start Match" button on bracket screen
- Console error logging for all error handlers

### Changed
- Disabled buttons now show explanatory hints instead of silently blocking interaction

### Fixed
- Silent error swallowing in try/catch blocks now logs to console for debugging

## [1.4.0] - 2025-06-01

### Added
- Pre-start validation preventing tournament/match start without MP3 or mark position
- Disabled start buttons with descriptive alerts until audio is ready

## [1.3.0] - 2025-05-01

### Added
- Click-to-play for all playable first-round matches
- Best-of-three final match series with running score display
- Player stats include individual game deviations from final series

## [1.2.0] - 2025-04-01

### Added
- Match numbering labels ("Match X / N") on bracket cards

## [1.1.0] - 2025-03-01

### Added
- Core gameplay with beat hit scoring and color-coded ratings
- 3-2-1-GO countdown with audio beeps
- Random song offset for each match
- Single-elimination tournament bracket with bye handling
- Visual waveform editor with zoom
- Settings persistence in localStorage
- Projector-friendly dark theme with animations

[Unreleased]: https://github.com/falkorichter/drum-game/compare/main...HEAD
[1.4.0]: https://github.com/falkorichter/drum-game/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/falkorichter/drum-game/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/falkorichter/drum-game/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/falkorichter/drum-game/releases/tag/v1.1.0
