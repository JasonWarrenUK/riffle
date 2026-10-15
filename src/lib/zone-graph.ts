/**
 * Zone graph: a ring-based arena made of zones with an adjacency list.
 *
 * Mechanism only. The ring names, zone IDs and labels all come from the
 * game that builds the map; nothing here assumes any particular arena.
 * Promoted from Flyt's contest arena once its helpers no longer read the
 * contest's own zones (Flyt ADR 0001, task 10IC.4).
 */

/**
 * A zone in a ring-based arena. `R` is the set of ring names a given
 * arena uses; the mechanism never assumes which names those are.
 */
export interface Zone<R extends string = string> {
	/** Unique zone ID, e.g. "m3" */
	id: string;
	/** Which ring this zone belongs to */
	ring: R;
	/** Numeric index within its ring */
	index: number;
	/** Human-readable label */
	label: string;
	/** IDs of all zones sharing an edge with this one */
	adjacent: string[];
}

/** Every zone in an arena, keyed by zone ID */
export type ZoneMap<R extends string = string> = Record<string, Zone<R>>;

/**
 * Build a zone map from one or more zone lists.
 * @throws if two zones share an ID: a silent last-wins merge would surface
 *   later as a confusing adjacency bug rather than at build time
 */
export function buildZoneMap<R extends string>(...groups: Zone<R>[][]): ZoneMap<R> {
	// no prototype, so IDs such as "constructor" or "toString" are ordinary keys
	const zones: ZoneMap<R> = Object.create(null);
	for (const zone of groups.flat()) {
		if (zone.id in zones) throw new Error(`Duplicate zone ID "${zone.id}"`);
		zones[zone.id] = zone;
	}
	return zones;
}

/** Get a zone by its ring and index (e.g. ring='middle', index=3 → the third middle zone) */
export function getZone<R extends string>(zones: ZoneMap<R>, ring: R, index: number): Zone<R> | undefined {
	return Object.values(zones).find(z => z.ring === ring && z.index === index);
}

/** Get all zones adjacent to a given zone ID; unknown IDs in the adjacency list are skipped */
export function getAdjacent<R extends string>(zones: ZoneMap<R>, zoneId: string): Zone<R>[] {
	const zone = zones[zoneId];
	if (!zone) return [];
	return zone.adjacent.map(id => zones[id]).filter((z): z is Zone<R> => z !== undefined);
}

/** Check whether two zone IDs share an edge, as listed from the first zone's side */
export function areAdjacent<R extends string>(zones: ZoneMap<R>, a: string, b: string): boolean {
	const zone = zones[a];
	return zone ? zone.adjacent.includes(b) : false;
}
