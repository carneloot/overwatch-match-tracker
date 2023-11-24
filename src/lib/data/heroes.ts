import { groupByField } from '$lib/utils';
import { z } from 'zod';

export const HeroRole = z.enum(['damage', 'support', 'tank']);
export type HeroRole = z.infer<typeof HeroRole>;

export type OverwatchHero = {
	slug: string;
	role: HeroRole;
	name: string;
	image: null;
};

export const heroes = {
	ana: {
		slug: 'ana',
		role: 'support',
		name: 'Ana',
		image: null
	},
	ashe: {
		slug: 'ashe',
		role: 'damage',
		name: 'Ashe',
		image: null
	},
	baptiste: {
		slug: 'baptiste',
		role: 'support',
		name: 'Baptiste',
		image: null
	},
	bastion: {
		slug: 'bastion',
		role: 'damage',
		name: 'Bastion',
		image: null
	},
	brigitte: {
		slug: 'brigitte',
		role: 'support',
		name: 'Brigitte',
		image: null
	},
	cassidy: {
		slug: 'cassidy',
		role: 'damage',
		name: 'Cassidy',
		image: null
	},
	dva: {
		slug: 'dva',
		role: 'tank',
		name: 'D.Va',
		image: null
	},
	doomfist: {
		slug: 'doomfist',
		role: 'tank',
		name: 'Doomfist',
		image: null
	},
	echo: {
		slug: 'echo',
		role: 'damage',
		name: 'Echo',
		image: null
	},
	genji: {
		slug: 'genji',
		role: 'damage',
		name: 'Genji',
		image: null
	},
	hanzo: {
		slug: 'hanzo',
		role: 'damage',
		name: 'Hanzo',
		image: null
	},
	illari: {
		slug: 'illari',
		role: 'support',
		name: 'Illari',
		image: null
	},
	'junker-queen': {
		slug: 'junker-queen',
		role: 'tank',
		name: 'Junker Queen',
		image: null
	},
	junkrat: {
		slug: 'junkrat',
		role: 'damage',
		name: 'Junkrat',
		image: null
	},
	kiriko: {
		slug: 'kiriko',
		role: 'support',
		name: 'Kiriko',
		image: null
	},
	lifeweaver: {
		slug: 'lifeweaver',
		role: 'support',
		name: 'Lifeweaver',
		image: null
	},
	lucio: {
		slug: 'lucio',
		role: 'support',
		name: 'Lúcio',
		image: null
	},
	mauga: {
		slug: 'mauga',
		role: 'tank',
		name: 'Mauga',
		image: null
	},
	mei: {
		slug: 'mei',
		role: 'damage',
		name: 'Mei',
		image: null
	},
	mercy: {
		slug: 'mercy',
		role: 'support',
		name: 'Mercy',
		image: null
	},
	moira: {
		slug: 'moira',
		role: 'support',
		name: 'Moira',
		image: null
	},
	orisa: {
		slug: 'orisa',
		role: 'tank',
		name: 'Orisa',
		image: null
	},
	pharah: {
		slug: 'pharah',
		role: 'damage',
		name: 'Pharah',
		image: null
	},
	ramattra: {
		slug: 'ramattra',
		role: 'tank',
		name: 'Ramattra',
		image: null
	},
	reaper: {
		slug: 'reaper',
		role: 'damage',
		name: 'Reaper',
		image: null
	},
	reinhardt: {
		slug: 'reinhardt',
		role: 'tank',
		name: 'Reinhardt',
		image: null
	},
	roadhog: {
		slug: 'roadhog',
		role: 'tank',
		name: 'Roadhog',
		image: null
	},
	sigma: {
		slug: 'sigma',
		role: 'tank',
		name: 'Sigma',
		image: null
	},
	sojourn: {
		slug: 'sojourn',
		role: 'damage',
		name: 'Sojourn',
		image: null
	},
	'soldier-76': {
		slug: 'soldier-76',
		role: 'damage',
		name: 'Soldier: 76',
		image: null
	},
	sombra: {
		slug: 'sombra',
		role: 'damage',
		name: 'Sombra',
		image: null
	},
	symmetra: {
		slug: 'symmetra',
		role: 'damage',
		name: 'Symmetra',
		image: null
	},
	torbjorn: {
		slug: 'torbjorn',
		role: 'damage',
		name: 'Torbjörn',
		image: null
	},
	tracer: {
		slug: 'tracer',
		role: 'damage',
		name: 'Tracer',
		image: null
	},
	widowmaker: {
		slug: 'widowmaker',
		role: 'damage',
		name: 'Widowmaker',
		image: null
	},
	winston: {
		slug: 'winston',
		role: 'tank',
		name: 'Winston',
		image: null
	},
	'wrecking-ball': {
		slug: 'wrecking-ball',
		role: 'tank',
		name: 'Wrecking Ball',
		image: null
	},
	zarya: {
		slug: 'zarya',
		role: 'tank',
		name: 'Zarya',
		image: null
	},
	zenyatta: {
		slug: 'zenyatta',
		role: 'support',
		name: 'Zenyatta',
		image: null
	}
} satisfies Record<string, OverwatchHero>;

export type OverwatchHeroSlug = keyof typeof heroes;
export const allHeroes = Object.values(heroes) as OverwatchHero[];
export const allHeroSlugs = Object.keys(heroes) as OverwatchHeroSlug[];
export const heroesByRole = groupByField(allHeroes, 'role');

const OVERWATCH_HEROES: [OverwatchHeroSlug, ...OverwatchHeroSlug[]] = [
	allHeroSlugs[0],
	...allHeroSlugs.slice(1)
];
export const OverwatchHeroEnum = z.enum(OVERWATCH_HEROES);
