# Riffle

A Svelte 5 reactive game engine for interactive fiction compiled by [DendryNexus](<https://github.com/JasonWarrenUK/dendrynexus>). Riffle wraps compiled game JSON in a fully reactive runtime, powering branching narratives with player choices, difficulty checks, card/deck mechanics, and quality systems.

## Features

- **Reactive state** — Built on Svelte 5 runes (`$state`, `$derived`) for automatic UI updates
- **Branching narrative** — Scene navigation with conditional go-to, go-to-ref, set-root, and game-over states
- **Choice system** — Priority, frequency, and order-based selection with viewability/choosability conditions, tag expansion (`#tag`), and min/max limits
- **Difficulty checks** — Broad and narrow difficulty curves with configurable scalers, human-readable labels (*almost impossible* → *straightforward*), and roll tracking
- **Card/deck/hand system** — Draw, play, and discard cards across multiple hands with pinned cards, max hand sizes, and per-hand state
- **Quality system** — Named attributes with typed display (integer, fudge, on/off, word scale, raw) and min/max clamping
- **Content rendering** — Quality interpolation (`[+ qualityName +]`), conditional text (`[? if condition : text ?]`), and markdown-style formatting
- **Arena topology** — Concentric-circle spatial system (inner/middle/outer rings, 13 zones) with adjacency relationships

## Structure

```
index.ts              Main exports
engine.svelte.ts      Core game engine (RiffleEngine class)
types.ts              TypeScript type definitions for compiled game data
arena.ts              Arena topology and spatial adjacency utilities
```

## Usage

```typescript
import { RiffleEngine } from 'riffle';

const engine = new RiffleEngine();
await engine.load('/path/to/game.json');

// Reactive state (Svelte 5 runes)
engine.display;       // Current scene content and choices
engine.qualityList;   // All qualities with current values
engine.lastCheck;     // Last difficulty check result

// Player actions
engine.choose('scene-id');          // Navigate to a scene
engine.drawCard('deck-id');         // Draw a card from a deck
engine.playCard('card-id');         // Play a card from hand
engine.playPinnedCard('card-id');   // Play a pinned card
engine.discardCard('card-id');      // Discard without playing
engine.restart();                   // Restart the game
```

## API

### `RiffleEngine`

| Member | Type | Description |
|---|---|---|
| `game` | `CompiledGame \| null` | Loaded game data |
| `state` | `GameState` | Current game state (qualities, visits, history, hands) |
| `loading` | `boolean` | Whether a game is currently loading |
| `error` | `string \| null` | Error message from last load attempt |
| `currentScene` | `GameScene \| null` | Derived: the active scene object |
| `display` | `DisplayContent \| null` | Derived: rendered scene with choices for the UI |
| `qualityList` | `Array` | Derived: all qualities with current values |
| `lastCheck` | `CheckResult \| null` | Result of the most recent difficulty check |

### Arena Utilities

```typescript
import { getZone, getAdjacent, areAdjacent, ZONES } from 'riffle';

getZone('m3');              // Get a zone by ID
getAdjacent('i1');          // Get all zones adjacent to a zone
areAdjacent('i1', 'm2');   // Check if two zones share an edge
```

### Difficulty Labels

| Probability | Label |
|---|---|
| ≤ 10% | almost impossible |
| ≤ 30% | high-risk |
| ≤ 40% | tough |
| ≤ 50% | very chancy |
| ≤ 60% | chancy |
| ≤ 70% | modest |
| ≤ 80% | very modest |
| ≤ 90% | low risk |
| > 90% | straightforward |

## Requirements

- **Svelte 5** — Uses runes (`$state`, `$derived`) for reactivity
- **DendryNexus** — Expects compiled `game.json` from `dendrynexus compile`
