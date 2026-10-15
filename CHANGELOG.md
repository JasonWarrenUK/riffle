<!-- doc-changelog: generated 2026-10-15. Delete this line once you hand-edit this file. -->
# Changelog

All notable changes to this project are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

## [1.1.0] - 2026-10-15

### Added

- `zone-graph`: generic ring-based arena mechanism (`Zone`, `ZoneMap`, `buildZoneMap`, `getZone`, `getAdjacent`, `areAdjacent`), promoted from Flyt once its helpers stopped reading the contest's own zones. `buildZoneMap` throws on a duplicate zone ID rather than letting the last one win.

## [1.0.0] - 2026-10-15

### Changed

- Declares the public API stable: from here, breaking changes bump the major version. The exports are the same as 0.1.0.
- `CHANGELOG.md` now ships in the npm package, so release history is available from the installed package.

## [0.1.0] - 2026-10-15

### Added

- Published to npm as `@jasonwarrenuk/riffle`, a Svelte 5 reactive wrapper that turns compiled DendryNexus game data into live game state. The bare name `riffle` belongs to an unrelated library, hence the scope.
- Compiled `dist/` output with a `svelte` export condition and types; Svelte 5 is a peer dependency.
- MIT licence.
- Smoke tests covering load success and failure, rendering, gated choices, on-arrival commands and restart.
- README with install instructions and the package import path.

### Changed

- Engine source moved to `src/lib/`; the engine code itself is unchanged.

[Unreleased]: https://github.com/JasonWarrenUK/riffle/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/JasonWarrenUK/riffle/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/JasonWarrenUK/riffle/compare/v0.1.0...v1.0.0
[0.1.0]: https://github.com/JasonWarrenUK/riffle/releases/tag/v0.1.0
