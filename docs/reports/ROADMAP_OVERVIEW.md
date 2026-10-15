# Riffle PHASE_1: Roadmap Overview

**11 tasks across 2 milestones.** Files: `.claude/roadmaps.json` (machine-readable), `docs/roadmaps/PHASE_1.md` (full task list with Mermaid dependency diagram).

> This roadmap starts where Flyt's milestones M8 to M10 ended. The twelve extraction tasks they held (audit, moving arena.ts, README reconciliation, the vocabulary guard, removing auto-sync, publishing 1.0.0 and switching Flyt to the package) are done and stay in Flyt's history. Only open work came across.

---

## What we're building

Riffle is published (`@jasonwarrenuk/riffle` 1.1.0) and Flyt imports it. Two pieces of engine-shaped code still live only in Flyt: the Dendry compiler (`scripts/compile-dendry.js`) and the `.dry` reference doc that describes its input. Flyt's ADR 0002 decided the compiler belongs in Riffle as a CLI, with its three Flyt-specific parts (the title fallback, the `story/` and `static/` roots, the one-subgame-per-subdirectory convention) turned into parameters. Milestone 1 does that move and publishes it. The CLI must run identically under Node, Bun and Deno (Flyt found Bun lists directories in a different order, which changed the order of scenes in the compiled output), so the port sorts every directory listing and uses only `node:`-prefixed built-ins. It lives in `src/cli/`, outside the browser entry's source, and sits behind its own export path so browser bundles never import file system code. The milestone adds three housekeeping tasks: the `getZone` linear scan (issue #5), copying ADRs 0001 and 0002 into this repo so the rule that guards it lives here, and documenting `reset()` in the README now that Flyt's own docs defer to it for the engine API.

Milestone 2 holds the Riffle halves of the phrase engine. ADR 0001 places chained slot composition in Riffle and splits unlock-condition evaluation across both repos (the engine evaluates, Flyt authors). The three tasks are placeholders: Flyt's own 2PE.1 (the phrase-chain data model) decides where the line falls, and that task is blocked in Flyt behind the entity state schema (1ES.1).

## Milestone sequence and the reasoning behind it

**M1 Compiler and zone-graph release** has no external blockers. The compiler chain (`1CC.1 → 1CC.2 → 1CC.4`) is the critical path, with `1CC.5` (how to run the CLI under each runtime) following `1CC.1` because its commands cannot be checked until the CLI exists; `1CC.3`, `1EX.1`, `1AD.1` and `1DC.1` run alongside it. Once `1CC.4` publishes, Flyt's remaining half (bump the dependency, switch `compile:dendry` to the CLI, retire the script) lives on Flyt's roadmap.

**M2 Phrase engine** waits on Flyt. `2PH.1` depends on the external gate `GFLYTPHRASE`, so the roadmap tooling shows it as blocked and refuses to claim it until Flyt's 2PE.1 lands and the gate is removed.

## Decisions that shaped the structure

- **No done history.** Flyt's M8 to M10 are complete; porting twelve done tasks with Flyt PR numbers would read as Riffle PRs. Provenance is in the notes instead (`1CC.1` was Flyt `10IC.5`).
- **Fresh numbering.** IDs restart at M1 rather than inheriting Flyt's M8 to M10, which encode Flyt's milestone scheme.
- **`2PH` not `2PE`.** Flyt's `2PE.1` to `2PE.3` name different tasks (its data-model design, its selection UI); reusing the IDs here would confuse every message between the two repos.
- **No cross-repo edges.** The roadmap never depends on a Flyt task ID. The one real cross-repo dependency (M2 on Flyt's 2PE.1 and 1ES.1) is an external gate, which names the outside condition without naming a Flyt task.

## External blockers (flag early)

- **Flyt 2PE.1 and 1ES.1** gate all of M2 through `GFLYTPHRASE`. The placeholders exist so the work is visible; their scope is undefined until Flyt's design lands.
- **Flyt dropping M8 to M10.** Flyt's stack (#29, #30, #32) has merged; Flyt drops its own copies of these tasks once this roadmap is on `main`.
- **Vocabulary guard paths.** The guard watches `src/lib/` in three places in `.github/workflows/engine-vocabulary.yml` (two triggers and the diff command). `1CC.1` puts the CLI in `src/cli/`, so all three must widen, or the compiler escapes the check that task promises.
