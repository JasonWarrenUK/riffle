import { afterEach, describe, expect, it, vi } from 'vitest';
import { RiffleEngine } from './index.js';
import type { CompiledGame } from './index.js';

/** A three-scene game: a start with two choices, one gated, one that changes a quality. */
const game: CompiledGame = {
	title: 'Test Game',
	firstScene: 'start',
	tagLookup: {},
	qualities: {
		gold: { id: 'gold', name: 'Gold', initial: 1, type: 'integer' }
	},
	scenes: {
		start: {
			id: 'start',
			title: 'The Start',
			content: 'You have [+ gold +] gold.',
			options: [
				{ id: 'market', title: 'Go to the market' },
				{ id: 'vault', title: 'Open the vault', chooseIf: 'gold >= 5' }
			]
		},
		market: {
			id: 'market',
			title: 'The Market',
			content: 'Coins change hands.',
			onArrival: ['gold = gold + 10'],
			options: [{ id: 'start', title: 'Back' }]
		},
		vault: { id: 'vault', title: 'The Vault', content: 'Riches.' }
	}
};

function stubFetch(response: { ok: boolean; statusText?: string; body?: unknown }) {
	vi.stubGlobal(
		'fetch',
		vi.fn(async () => ({
			ok: response.ok,
			statusText: response.statusText ?? '',
			json: async () => response.body
		}))
	);
}

async function loadedEngine(): Promise<RiffleEngine> {
	stubFetch({ ok: true, body: game });
	const engine = new RiffleEngine();
	await engine.load('/test-game.json');
	return engine;
}

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('RiffleEngine.load', () => {
	it('starts on the first scene with qualities at their initial values', async () => {
		const engine = await loadedEngine();
		expect(engine.loading).toBe(false);
		expect(engine.error).toBeNull();
		expect(engine.state.currentSceneId).toBe('start');
		expect(engine.state.qualities.gold).toBe(1);
	});

	it('records an error and leaves no game when the request fails', async () => {
		stubFetch({ ok: false, statusText: 'Not Found' });
		const engine = new RiffleEngine();
		await engine.load('/missing.json');
		expect(engine.error).toBe('Failed to load game data: Not Found');
		expect(engine.game).toBeNull();
		expect(engine.loading).toBe(false);
	});
});

describe('RiffleEngine.display', () => {
	it('renders title, interpolated body and the available choices', async () => {
		const engine = await loadedEngine();
		expect(engine.display?.title).toBe('The Start');
		expect(engine.display?.body).toContain('You have 1 gold.');
		expect(engine.display?.choices.map(c => c.id)).toContain('market');
	});

	it('shows a choice whose condition fails as disabled rather than hiding it', async () => {
		const engine = await loadedEngine();
		const vault = engine.display?.choices.find(c => c.id === 'vault');
		expect(vault).toBeDefined();
		expect(vault?.enabled).toBe(false);
	});
});

describe('RiffleEngine.choose', () => {
	it('navigates and runs on-arrival commands', async () => {
		const engine = await loadedEngine();
		engine.choose('market');
		expect(engine.state.currentSceneId).toBe('market');
		expect(engine.state.qualities.gold).toBe(11);
		expect(engine.state.history).toEqual(['start', 'market']);
	});

	it('unlocks a gated choice once its condition holds', async () => {
		const engine = await loadedEngine();
		engine.choose('market');
		engine.choose('start');
		const vault = engine.display?.choices.find(c => c.id === 'vault');
		expect(vault?.enabled).toBe(true);
	});
});

describe('RiffleEngine.restart', () => {
	it('returns to the first scene and the initial quality values', async () => {
		const engine = await loadedEngine();
		engine.choose('market');
		engine.restart();
		expect(engine.state.currentSceneId).toBe('start');
		expect(engine.state.qualities.gold).toBe(1);
		expect(engine.state.history).toEqual(['start']);
	});
});
