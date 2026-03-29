# 🥁 Beat Challenge — Drum Game

[![Tests](https://github.com/falkorichter/drum-game/actions/workflows/tests.yml/badge.svg)](https://github.com/falkorichter/drum-game/actions/workflows/tests.yml)

A competitive 2-player rhythm tournament game built as a single static HTML/JS page. Two players compete to hit a specific beat mark in a song as precisely as possible — the closest hit wins.

**▶️ Play it now: <https://falkorichter.github.io/drum-game/>**

---

## How It Works

1. Load an MP3 (via URL or file upload) and set a **mark position** in the song.
2. Add players and start a **single-elimination tournament**.
3. Each match plays the song from a random offset before the mark. Players press their key (**A** for Player 1, **L** for Player 2) when they think the mark is reached.
4. The player with the **smallest timing deviation** from the mark wins and advances.
5. The final match is **best-of-three**.

---

## Features

### Core Gameplay ([PR #1](https://github.com/falkorichter/drum-game/pull/1))

- **Beat hit scoring** — deviation measured in milliseconds; color-coded ratings from ⚡ PERFECT (<10 ms) to 😬 Missed (>200 ms)
- **3-2-1-GO countdown** with audio beeps and animated overlay
- **Random song offset** — each match starts at a random point before the mark (configurable min/max range) to prevent memorisation
- **Auto-end** — match terminates 4 seconds after the mark if no one hits
- **Tie detection** — if both players hit within 1 ms of each other the match replays automatically

### Settings & Audio

- **MP3 loading** via URL or local file upload
- **Visual waveform editor** — overview + zoomable detail view; click to set the mark position
- **Preview playback** starting 3 seconds before the mark
- **Idle music** — configurable background music that loops on the home screen
- **Tournament name** — custom title displayed throughout the UI
- **Player seed list** — pre-fill the player roster (one name per line, duplicate detection)
- All settings persisted in `localStorage`

### Tournament System

- **Single-elimination bracket** with automatic bye handling (see [Tournament Logic](#tournament-logic-for-non-power-of-2-player-counts) below)
- **Bracket visualisation** — rounds displayed left-to-right with match cards, winner badges, and highlighted current match
- **Round labels** — Round N → Quarter-Final → Semi-Final → Final
- **Player statistics table** — matches played, average & median deviation, elimination status
- **Tournament persistence** — full state saved to `localStorage`; resume or clear at any time
- **Replay tournament** — re-shuffle the same players and start over

### Match Numbers ([PR #3](https://github.com/falkorichter/drum-game/pull/3))

- Each match card in the bracket shows a **"Match X / N"** label so you can see how many matches each round contains.

### Click-to-Play & Best-of-Three Final ([PR #5](https://github.com/falkorichter/drum-game/pull/5))

- **Click-to-play** — all playable first-round matches are clickable, letting the organiser choose match order instead of following a fixed sequence.
- **Best-of-three final** — the championship match is played as a best-of-three series. The result screen shows the running series score and a "Next Game" button between games.
- Player stats include individual game deviations from the final series.

### Song Validation ([PR #7](https://github.com/falkorichter/drum-game/pull/7))

- **Pre-start validation** — the game prevents starting a tournament or match when no MP3 is loaded or when the mark position is not set.
- Start buttons are disabled with a descriptive alert until audio is ready.

### Bracket Connector Lines & Layout ([PR #9](https://github.com/falkorichter/drum-game/pull/9))

- **SVG connector lines** — classic bracket lines drawn between feeder matches and their target match in the next round, making the tournament flow visually clear.
- **Proper bracket spacing** — later-round match cards are vertically centered between their two feeder matches using a two-pass layout algorithm.
- **Sticky round titles** — round labels (Round 1, Quarter-Final, etc.) stay visible at the top when scrolling vertically, maintaining context for large tournaments.
- **Champion connector** — a line connects the final match to the champion column when a winner is decided.

### Export / Import ([PR #17](https://github.com/falkorichter/drum-game/pull/17))

- **JSON export** — download the full tournament state (bracket, results, settings) as a portable `.json` file from the bracket screen.
- **JSON import** — load a previously exported tournament from a `.json` file on the tournament setup screen. Includes validation and error feedback.
- **ASCII bracket export** — copy a text representation of the bracket to the clipboard (or download as `.txt`) for sharing in chats, emails, or documentation.

### Visual Design

- **Projector-friendly** dark theme with animated title, floating particle background, and confetti on champion reveal
- **Split-screen match view** — Player 1 (red/pink) vs Player 2 (cyan/blue) with key-press animations and hit flash effects
- **Result waveform** — post-match canvas showing the mark and both players' hit positions

---

## Tournament Logic for Non-Power-of-2 Player Counts

The bracket is **single-elimination** and always pads the player list to the **next power of 2** using bye slots. This means the tournament works for any number of players (2 or more), not just numbers divisible by 4.

### How Byes Work

| Players | Padded to | Rounds | Byes in Round 1 |
|---------|-----------|--------|-----------------|
| 2       | 2         | 1      | 0               |
| 3       | 4         | 2      | 1               |
| 4       | 4         | 2      | 0               |
| 5       | 8         | 3      | 3               |
| 6       | 8         | 3      | 2               |
| 7       | 8         | 3      | 1               |
| 8       | 8         | 3      | 0               |
| 10      | 16        | 4      | 6               |

1. **Padding**: the player array is extended with `null` entries until its length is a power of 2.
2. **First-round pairing**: players are paired sequentially. A real player paired with a `null` slot wins automatically (bye). Two `null` slots paired together produce a padding bye that is hidden from the UI.
3. **Bye propagation**: bye winners are pushed forward into subsequent rounds automatically. The algorithm iterates until the bracket is stable, using `p1NullBye` / `p2NullBye` markers to distinguish "slot empty because of a bye" from "slot empty because the upstream match hasn't been played yet".
4. **Result**: some players get a free pass in early rounds, but every real match always has two real players. The bracket converges to a single final match.

### Example — 5 Players

```
Round 1 (4 matches)        Round 2 (2 matches)       Final
┌──────────────┐
│ Alice vs Bob │──┐
└──────────────┘  │  ┌──────────────┐
                  ├──│ winner vs Ed │──┐
┌──────────────┐  │  └──────────────┘  │
│ Ed    (bye)  │──┘                    │  ┌──────────────┐
└──────────────┘                       ├──│    Final     │
┌──────────────┐                       │  └──────────────┘
│ Charlie vs D │──┐                    │
└──────────────┘  │  ┌──────────────┐  │
                  ├──│ winner (bye) │──┘
┌ ─ ─ ─ ─ ─ ─ ┐  │  └──────────────┘
  (null bye)   ──┘
└ ─ ─ ─ ─ ─ ─ ┘
```

- **Ed** has no opponent in Round 1 → automatic bye, advances to Round 2.
- The null-null bye is hidden; its "winner" (null) propagates up, giving the winner of Charlie vs D a bye into the Final.
- Every displayed match always features two real players.

---

## Running Locally

Open `index.html` in any modern browser — no build step or server required.

### Tests

Open `bracket.test.html` in a browser to run the bracket logic unit tests.

Open `export.test.html` in a browser to run the export/import unit tests.

**Run from the command line** (requires [Node.js](https://nodejs.org/) ≥ 18):

```bash
npm test
# or directly:
node run-tests.js
```

Tests are also executed automatically on every push and pull request via [GitHub Actions](https://github.com/falkorichter/drum-game/actions/workflows/tests.yml).

---

## Development Metadata

| Field | Value |
|-------|-------|
| Version | 0.3.1 |
| License | MIT |
| Node.js | ≥ 18 (for tests only) |
| CI | GitHub Actions (`tests.yml`) |
| Changelog | [CHANGELOG.md](CHANGELOG.md) |
| AI/LLM tools | GitHub Copilot Coding Agent (Claude Sonnet) |

### Contributing

- Bump the version in the README Development Metadata section with each non-documentation commit.
- Write comprehensive tests for new features in `bracket.test.html`.
- Verify no external code conflicts before merging.
- Document any AI/LLM tools used in the development process in this section.
- When adding new localization keys, ensure they are translated to all supported languages.
- Maintain `CHANGELOG.md` following [Keep a Changelog v1.1.0](https://keepachangelog.com/en/1.1.0/) format.
