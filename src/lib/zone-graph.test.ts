import { describe, expect, it } from 'vitest';
import { areAdjacent, buildZoneMap, getAdjacent, getZone, type Zone, type ZoneMap } from './zone-graph.js';

// A two-ring arena with ring names no particular game uses, so the tests
// prove the helpers carry no assumption about rings or ID spelling.
type TestRing = 'hub' | 'rim';
const hub: Zone<TestRing> = { id: 'core', ring: 'hub', index: 1, label: 'Core', adjacent: ['north', 'south'] };
const north: Zone<TestRing> = { id: 'north', ring: 'rim', index: 1, label: 'North', adjacent: ['core', 'south'] };
const south: Zone<TestRing> = { id: 'south', ring: 'rim', index: 2, label: 'South', adjacent: ['core', 'north', 'ghost'] };
const arena: ZoneMap<TestRing> = buildZoneMap([hub], [north, south]);

describe('buildZoneMap', () => {
	it('keys every zone from every group by its ID', () => {
		expect(Object.keys(arena).sort()).toEqual(['core', 'north', 'south']);
		expect(arena.north).toBe(north);
	});

	it('refuses a duplicate zone ID instead of letting the last one win', () => {
		const again: Zone<TestRing> = { ...north, label: 'Other North' };
		expect(() => buildZoneMap([hub, north], [again])).toThrow('Duplicate zone ID "north"');
	});

	it('treats IDs that match Object.prototype members as ordinary zones', () => {
		const ctor: Zone<TestRing> = { id: 'constructor', ring: 'hub', index: 1, label: 'Ctor', adjacent: ['toString'] };
		const map = buildZoneMap([ctor]);
		expect(Object.keys(map)).toEqual(['constructor']);
		expect(getAdjacent(map, 'constructor')).toEqual([]);
		expect(getAdjacent(map, 'toString')).toEqual([]);
		expect(areAdjacent(map, 'toString', 'constructor')).toBe(false);
	});
});

describe('getZone', () => {
	it('finds a zone by ring and index without relying on ID prefixes', () => {
		expect(getZone(arena, 'rim', 2)).toBe(south);
		expect(getZone(arena, 'hub', 1)).toBe(hub);
	});

	it('returns undefined for an index the ring does not have', () => {
		expect(getZone(arena, 'hub', 2)).toBeUndefined();
	});
});

describe('getAdjacent', () => {
	it('resolves adjacent IDs to zones', () => {
		expect(getAdjacent(arena, 'core')).toEqual([north, south]);
	});

	it('drops adjacent IDs that are not in the map', () => {
		expect(getAdjacent(arena, 'south')).toEqual([hub, north]);
	});

	it('returns an empty list for an unknown zone', () => {
		expect(getAdjacent(arena, 'nowhere')).toEqual([]);
	});
});

describe('areAdjacent', () => {
	it('reads adjacency from the first zone\'s list', () => {
		expect(areAdjacent(arena, 'core', 'north')).toBe(true);
		expect(areAdjacent(arena, 'north', 'ghost')).toBe(false);
	});

	it('is false when the first zone is unknown', () => {
		expect(areAdjacent(arena, 'nowhere', 'core')).toBe(false);
	});
});
