import { groupByField } from '$lib/utils';

type MapType = 'control' | 'hybrid' | 'escort' | 'deathmatch' | 'push';

export type OverwatchMap = {
	slug: string;
	type: MapType;
	name: string;
	image: null;
}

export const maps = {
	'antarctic-peninsula': {
		'slug': 'antarctic-peninsula',
		'name': 'Antarctic Peninsula',
		'type': 'control',
		'image': null
	},
	'blizzard-world': {
		'slug': 'blizzard-world',
		'name': 'Blizzard World',
		'type': 'hybrid',
		'image': null
	},
	'busan': {
		'slug': 'busan',
		'name': 'Busan',
		'type': 'control',
		'image': null
	},
	'chateau-guillard': {
		'slug': 'chateau-guillard',
		'name': 'Château Guillard',
		'type': 'deathmatch',
		'image': null
	},
	'circuit-royal': {
		'slug': 'circuit-royal',
		'name': 'Circuit Royal',
		'type': 'escort',
		'image': null
	},
	'colosseo': {
		'slug': 'colosseo',
		'name': 'Colosseo',
		'type': 'push',
		'image': null
	},
	'dorado': {
		'slug': 'dorado',
		'name': 'Dorado',
		'type': 'escort',
		'image': null
	},
	'eichenwalde': {
		'slug': 'eichenwalde',
		'name': 'Eichenwalde',
		'type': 'hybrid',
		'image': null
	},
	'esperanca': {
		'slug': 'esperanca',
		'name': 'Esperança',
		'type': 'push',
		'image': null
	},
	'havana': {
		'slug': 'havana',
		'name': 'Havana',
		'type': 'escort',
		'image': null
	},
	'hollywood': {
		'slug': 'hollywood',
		'name': 'Hollywood',
		'type': 'hybrid',
		'image': null
	},
	'ilios': {
		'slug': 'ilios',
		'name': 'Ilios',
		'type': 'control',
		'image': null
	},
	'junkertown': {
		'slug': 'junkertown',
		'name': 'Junkertown',
		'type': 'escort',
		'image': null
	},
	'kanezaka': {
		'slug': 'kanezaka',
		'name': 'Kanezaka',
		'type': 'deathmatch',
		'image': null
	},
	'kings-row': {
		'slug': 'kings-row',
		'name': 'King\'s Row',
		'type': 'hybrid',
		'image': null
	},
	'lijiang-tower': {
		'slug': 'lijiang-tower',
		'name': 'Lijiang Tower',
		'type': 'control',
		'image': null
	},
	'malevento': {
		'slug': 'malevento',
		'name': 'Malevento',
		'type': 'deathmatch',
		'image': null
	},
	'midtown': {
		'slug': 'midtown',
		'name': 'Midtown',
		'type': 'hybrid',
		'image': null
	},
	'nepal': {
		'slug': 'nepal',
		'name': 'Nepal',
		'type': 'control',
		'image': null
	},
	'new-queen-street': {
		'slug': 'new-queen-street',
		'name': 'New Queen Street',
		'type': 'push',
		'image': null
	},
	'numbani': {
		'slug': 'numbani',
		'name': 'Numbani',
		'type': 'hybrid',
		'image': null
	},
	'oasis': {
		'slug': 'oasis',
		'name': 'Oasis',
		'type': 'control',
		'image': null
	},
	'paraiso': {
		'slug': 'paraiso',
		'name': 'Paraíso',
		'type': 'hybrid',
		'image': null
	},
	'petra': {
		'slug': 'petra',
		'name': 'Petra',
		'type': 'deathmatch',
		'image': null
	},
	'rialto': {
		'slug': 'rialto',
		'name': 'Rialto',
		'type': 'escort',
		'image': null
	},
	'route-66': {
		'slug': 'route-66',
		'name': 'Route 66',
		'type': 'escort',
		'image': null
	},
	'shambali-monastery': {
		'slug': 'shambali-monastery',
		'name': 'Shambali Monastery',
		'type': 'escort',
		'image': null
	},
	'watchpoint-gibraltar': {
		'slug': 'watchpoint-gibraltar',
		'name': 'Watchpoint: Gibraltar',
		'type': 'escort',
		'image': null
	}
} satisfies Record<string, OverwatchMap>;

export type OverwatchMapSlug = keyof typeof maps;

export const allMaps = Object.values(maps) as OverwatchMap[];

export const allMapSlugs = Object.keys(maps) as OverwatchMapSlug[];
export const mapsByType = groupByField(allMaps, 'type');
