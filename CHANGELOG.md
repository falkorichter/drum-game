# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.0] - 2026-03-29

### Fixed
- Corrected 5-player bracket test assertion: round 1 has 2 real matches (not 1) with the sequential seeding algorithm

### Added
- GitHub Actions CI workflow to run bracket tests on push and pull request
- Node.js test runner (`run-tests.js`) to execute `.test.html` files headlessly in CI
- `package.json` for project metadata and `npm test` script
- `.gitignore` for Node.js artifacts
- `CHANGELOG.md` following Keep a Changelog v1.1.0 format

## [0.2.0] - 2025-01-01

### Added
- Song validation — pre-start checks for MP3 and mark position ([PR #7](https://github.com/falkorichter/drum-game/pull/7))
- Click-to-play match selection and best-of-three final ([PR #5](https://github.com/falkorichter/drum-game/pull/5))
- Match numbering in bracket cards ([PR #3](https://github.com/falkorichter/drum-game/pull/3))
- Core gameplay with beat hit scoring and tournament bracket ([PR #1](https://github.com/falkorichter/drum-game/pull/1))

[Unreleased]: https://github.com/falkorichter/drum-game/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/falkorichter/drum-game/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/falkorichter/drum-game/releases/tag/v0.2.0
