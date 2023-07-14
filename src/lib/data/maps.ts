import { groupByField } from '$lib/utils';
import { z } from 'zod';

import antarcticPeninsula from '$lib/assets/images/maps/antarctic-peninsula.webp'
import blizzardWorld from '$lib/assets/images/maps/blizzard-world.webp';
import busan from '$lib/assets/images/maps/busan.webp';
import chateauGuillard from '$lib/assets/images/maps/chateau-guillard.webp';
import circuitRoyal from '$lib/assets/images/maps/circuit-royal.webp';
import colosseo from '$lib/assets/images/maps/colosseo.webp';
import dorado from '$lib/assets/images/maps/dorado.webp';
import eichenwalde from '$lib/assets/images/maps/eichenwalde.webp';
import esperanca from '$lib/assets/images/maps/esperanca.webp';
import havana from '$lib/assets/images/maps/havana.webp';
import hollywood from '$lib/assets/images/maps/hollywood.webp';
import ilios from '$lib/assets/images/maps/ilios.webp';
import junkertown from '$lib/assets/images/maps/junkertown.webp';
import kanezaka from '$lib/assets/images/maps/kanezaka.webp';
import kingsRow from '$lib/assets/images/maps/kings-row.webp';
import lijiangTower from '$lib/assets/images/maps/lijiang-tower.webp';
import malevento from '$lib/assets/images/maps/malevento.webp';
import midtown from '$lib/assets/images/maps/midtown.webp';
import nepal from '$lib/assets/images/maps/nepal.webp';
import newQueenStreet from '$lib/assets/images/maps/new-queen-street.webp';
import numbani from '$lib/assets/images/maps/numbani.webp';
import oasis from '$lib/assets/images/maps/oasis.webp';
import paraiso from '$lib/assets/images/maps/paraiso.webp';
import petra from '$lib/assets/images/maps/petra.webp';
import rialto from '$lib/assets/images/maps/rialto.webp';
import route66 from '$lib/assets/images/maps/route-66.webp';
import shambaliMonastery from '$lib/assets/images/maps/shambali-monastery.webp';
import watchpointGibraltar from '$lib/assets/images/maps/watchpoint-gibraltar.webp';

export type MapType = 'control' | 'hybrid' | 'escort' | 'deathmatch' | 'push';

export type OverwatchMap = {
	slug: string;
	type: MapType;
	name: string;
	image: typeof busan;
}

export const maps = {
	'antarctic-peninsula': {
		'slug': 'antarctic-peninsula',
		'name': 'Antarctic Peninsula',
		'type': 'control',
		'image': antarcticPeninsula
	},
	'blizzard-world': {
		'slug': 'blizzard-world',
		'name': 'Blizzard World',
		'type': 'hybrid',
		'image': blizzardWorld
	},
	'busan': {
		'slug': 'busan',
		'name': 'Busan',
		'type': 'control',
		'image': busan,
	},
	'chateau-guillard': {
		'slug': 'chateau-guillard',
		'name': 'Château Guillard',
		'type': 'deathmatch',
		'image': chateauGuillard
	},
	'circuit-royal': {
		'slug': 'circuit-royal',
		'name': 'Circuit Royal',
		'type': 'escort',
		'image': circuitRoyal
	},
	'colosseo': {
		'slug': 'colosseo',
		'name': 'Colosseo',
		'type': 'push',
		'image': colosseo
	},
	'dorado': {
		'slug': 'dorado',
		'name': 'Dorado',
		'type': 'escort',
		'image': dorado
	},
	'eichenwalde': {
		'slug': 'eichenwalde',
		'name': 'Eichenwalde',
		'type': 'hybrid',
		'image': eichenwalde
	},
	'esperanca': {
		'slug': 'esperanca',
		'name': 'Esperança',
		'type': 'push',
		'image': esperanca
	},
	'havana': {
		'slug': 'havana',
		'name': 'Havana',
		'type': 'escort',
		'image': havana
	},
	'hollywood': {
		'slug': 'hollywood',
		'name': 'Hollywood',
		'type': 'hybrid',
		'image': hollywood
	},
	'ilios': {
		'slug': 'ilios',
		'name': 'Ilios',
		'type': 'control',
		'image': ilios
	},
	'junkertown': {
		'slug': 'junkertown',
		'name': 'Junkertown',
		'type': 'escort',
		'image': junkertown
	},
	'kanezaka': {
		'slug': 'kanezaka',
		'name': 'Kanezaka',
		'type': 'deathmatch',
		'image': kanezaka
	},
	'kings-row': {
		'slug': 'kings-row',
		'name': 'King\'s Row',
		'type': 'hybrid',
		'image': kingsRow
	},
	'lijiang-tower': {
		'slug': 'lijiang-tower',
		'name': 'Lijiang Tower',
		'type': 'control',
		'image': lijiangTower
	},
	'malevento': {
		'slug': 'malevento',
		'name': 'Malevento',
		'type': 'deathmatch',
		'image': malevento
	},
	'midtown': {
		'slug': 'midtown',
		'name': 'Midtown',
		'type': 'hybrid',
		'image': midtown
	},
	'nepal': {
		'slug': 'nepal',
		'name': 'Nepal',
		'type': 'control',
		'image': nepal
	},
	'new-queen-street': {
		'slug': 'new-queen-street',
		'name': 'New Queen Street',
		'type': 'push',
		'image': newQueenStreet
	},
	'numbani': {
		'slug': 'numbani',
		'name': 'Numbani',
		'type': 'hybrid',
		'image': numbani
	},
	'oasis': {
		'slug': 'oasis',
		'name': 'Oasis',
		'type': 'control',
		'image': oasis
	},
	'paraiso': {
		'slug': 'paraiso',
		'name': 'Paraíso',
		'type': 'hybrid',
		'image': paraiso
	},
	'petra': {
		'slug': 'petra',
		'name': 'Petra',
		'type': 'deathmatch',
		'image': petra
	},
	'rialto': {
		'slug': 'rialto',
		'name': 'Rialto',
		'type': 'escort',
		'image': rialto
	},
	'route-66': {
		'slug': 'route-66',
		'name': 'Route 66',
		'type': 'escort',
		'image': route66
	},
	'shambali-monastery': {
		'slug': 'shambali-monastery',
		'name': 'Shambali Monastery',
		'type': 'escort',
		'image': shambaliMonastery
	},
	'watchpoint-gibraltar': {
		'slug': 'watchpoint-gibraltar',
		'name': 'Watchpoint: Gibraltar',
		'type': 'escort',
		'image': watchpointGibraltar
	}
} satisfies Record<string, OverwatchMap>;

export type OverwatchMapSlug = keyof typeof maps;

export const allMaps = Object.values(maps) as OverwatchMap[];

export const allMapSlugs = Object.keys(maps) as OverwatchMapSlug[];
export const mapsByType = groupByField(allMaps, 'type');
mapsByType.sort((a, b) => a.name.localeCompare(b.name));

const OVERWATCH_MAPS: [OverwatchMapSlug, ...OverwatchMapSlug[]] = [
	allMapSlugs[0],
	...allMapSlugs.slice(1)
];

export const OverwatchMapEnum = z.enum(OVERWATCH_MAPS);
