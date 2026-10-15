# Riffle PHASE_1 Roadmap

Riffle's first roadmap of its own. The extraction from Flyt is finished (engine code moved, auto-sync removed, 1.0.0 and 1.1.0 published), so this phase carries what is left: the Dendry compiler moving into the package as a CLI, and the Riffle halves of the phrase engine once Flyt's design draws the line.

**Critical path:** `1CC.1 → 1CC.2 → 1CC.4`; the compiler port gates the browser-safe export path, and both gate the release Flyt switches its build script to.

---

## Milestone 1: Compiler and zone-graph release

**Goal:** Ship the Dendry compiler from Riffle and settle the zone-graph helpers that 1.1.0 released

- [ ] **1EX.1**: Fix the getZone linear scan so lookups stop walking the whole zone map on every call
  - Note: Issue riffle#5. The code landed with riffle#4 (merged 2026-10-15, released as 1.1.0), so nothing blocks this
- [ ] **1CC.1**: Port compile-dendry.js from Flyt as a runtime-neutral parameterised CLI with its tests: the title fallback, the input and output roots and the one-subgame-per-subdirectory convention become parameters, and the output is byte-identical under Node, Bun and Deno
  - Note: Was Flyt 10IC.5. Flyt's ADR 0002 (Flyt PR #30, branch docs/adr-compiler-home) is the brief and records the evidence. Runtime-neutral means: import built-ins with the node: prefix (node:fs, node:path), sort every directory listing before use, use no API only one runtime has and pin no behaviour to a runtime. Flyt measured the existing script (imports only fs and path) unchanged under Node 25.2.1, Bun 1.3.5 and Deno 2.9.7: all exit cleanly, but Bun lists directories in a different order from Node and the compiler inserts scenes in read order, so great-hall.json has the same 94 scenes in a different order under Bun. Acceptance: a fixture story compiled under all three runtimes with the outputs compared; if CI cannot install all three, record which it covers and which is checked by hand. Acceptance also includes the engine vocabulary guard covering the compiler, so the CLI must live under the guard's path filter (currently src/lib/) or the filter must widen with it
- [ ] **1CC.2**: Keep the compiler CLI behind its own export path so browser bundles never import file system code _(blocked: depends on 1CC.1)_
  - Note: Review note carried from Flyt PR #30. The constraint is file system code out of the browser bundle; the CLI itself stays runtime-neutral (1CC.1)
- [ ] **1CC.3**: Write the .dry format reference doc, moved from Flyt's docs/dendrynexus-reference.md, and document how to run the compiler CLI under Node, Bun and Deno
  - Note: Describes the compiler's input format, so it moves with the compiler. Also resolves the doc-comment references Flyt 8EX.5 removed for want of a Riffle equivalent. The package bin entry carries the usual node shebang because npm expects it; Bun users run it with bunx --bun and Deno users with deno run --allow-read --allow-write (commands as Flyt ran them; re-check against the shipped CLI before documenting)
- [ ] **1CC.4**: Publish the compiler CLI release _(blocked: depends on 1CC.2, 1CC.3)_
  - Note: Flyt then bumps the dependency, switches its compile:dendry script to the CLI and retires scripts/compile-dendry.js (Flyt-side tasks)
- [ ] **1AD.1**: Copy ADR 0001 (the Riffle boundary rule) and ADR 0002 (the compiler's home) from Flyt's docs/adr/ into Riffle's docs/adr/
  - Note: Both govern this repo but live only in Flyt. Flyt keeps ADR 0001 as the decision record of origin with a pointer here. Copy the updated ADR 0002 (it records the runtime-neutral requirement), found on Flyt PR #30's branch docs/adr-compiler-home, not the earlier text
- [ ] **1DC.1**: Document reset() in the README, and decide whether evaluateCondition is public API (a README row) or internal (marked so in the types)
  - Note: From Flyt, found while fixing a review comment on Flyt PR #29: Flyt's CLAUDE.md now defers to this README for the engine API. reset() clears the loaded game and state and returns loading and error to their defaults (Flyt calls it when the player returns to the menu); restart() returns to the first scene of the same game, and is the only one the README mentions. The 1.1.0 type declarations also expose evaluateCondition(condition?: string): boolean (src/lib/engine.svelte.ts:797), which the README omits. Changelog entry goes under Unreleased; ship as a 1.1.x patch or fold into the next release

---

## Milestone 2: Phrase engine

**Goal:** Build the Riffle halves of the phrase engine once Flyt's design draws the engine/game line

- [ ] **2PH.1**: Chained slot composition, Riffle half
  - Note: Placeholder. Flyt's ADR 0001 places chained, non-reversible slot composition (Flyt 2PE.1 and 2PE.2) in Riffle. Flyt's 2PE.1 (design the phrase-chain data model) draws the engine/Flyt line and is itself blocked by Flyt 1ES.1 (entity state schema): an external dependency, recorded here rather than wired. Flyt's 2PE.x IDs name different tasks from these
- [ ] **2PH.2**: Chained slot composition, second half _(blocked: depends on 2PH.1)_
  - Note: Placeholder; scope settles when 2PH.1 lands
- [ ] **2PH.3**: Unlock-condition evaluation, Riffle half: the engine evaluates, Flyt authors _(blocked: depends on 2PH.1)_
  - Note: Placeholder. Flyt's ADR 0001 splits unlock-condition resolution (Flyt 2PE.3) across both repos

---

## Dependency Diagram

```mermaid
graph LR
	classDef todo fill:#f6f6f6,stroke:#6f6f6f,color:#6f6f6f
	classDef inProgress fill:#e8f2ff,stroke:#0071af,color:#0071af
	classDef blocked fill:#fff8f6,stroke:#e0002b,color:#e0002b,stroke-width:2px
	classDef paused fill:#fdf4ff,stroke:#b01fe3,color:#b01fe3,stroke-dasharray:4 3
	classDef deferred fill:#fff8f3,stroke:#ac5c00,color:#ac5c00,stroke-dasharray:2 4,font-style:italic
	classDef done fill:#e0ffd9,stroke:#008217,color:#008217
	classDef outOfScope fill:#f6f6f6,stroke:#717171,color:#717171,stroke-dasharray:2 2
	classDef mile fill:#e3f7ff,stroke:#007590,color:#007590,font-weight:bold
	classDef external fill:#fff9e5,stroke:#7d6f00,color:#7d6f00,stroke-dasharray:4 3,font-style:italic
	1EX.1["1EX.1: Fix the getZone linear scan so lookups s…"]
	1CC.1["1CC.1: Port compile-dendry.js from Flyt as a ru…"]
	1CC.2["1CC.2: Keep the compiler CLI behind its own exp…"]
	1CC.3["1CC.3: Write the .dry format reference doc, mov…"]
	1CC.4["1CC.4: Publish the compiler CLI release"]
	1AD.1["1AD.1: Copy ADR 0001 (the Riffle boundary rule)…"]
	1DC.1["1DC.1: Document reset() in the README, and deci…"]
	M1["M1: Compiler and zone-graph release"]:::mile
	2PH.1["2PH.1: Chained slot composition, Riffle half"]
	2PH.2["2PH.2: Chained slot composition, second half"]
	2PH.3["2PH.3: Unlock-condition evaluation, Riffle half…"]
	M2["M2: Phrase engine"]:::mile
	1EX.1 --> M1
	1CC.1 --> 1CC.2
	1CC.2 --> 1CC.4
	1CC.3 --> 1CC.4
	1CC.4 --> M1
	1AD.1 --> M1
	1DC.1 --> M1
	2PH.1 --> 2PH.2
	2PH.1 --> 2PH.3
	2PH.2 --> M2
	2PH.3 --> M2
	class 1AD.1,1CC.1,1CC.3,1DC.1,1EX.1,2PH.1 todo
	class 1CC.2,1CC.4,2PH.2,2PH.3 blocked
```
