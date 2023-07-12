import type { HeroRole } from '$lib/data/heroes';
import type { MatchResult, SkillTier } from '$lib/database/schema';
import type { MapType } from '$lib/data/maps';

export const heroRole = {
	damage: 'Damage',
	support: 'Support',
	tank: 'Tank'
} satisfies Record<HeroRole, string>;

export const matchResult = {
	win: 'Win',
	draw: 'Draw',
	lose: 'Loss'
} satisfies Record<MatchResult, string>;

export const mapType = {
	hybrid: 'Hybrid',
	control: 'Control',
	deathmatch: 'Deathmatch',
	escort: 'Escort',
	push: 'Push'
} satisfies Record<MapType, string>;

export const skillTier = {
	bronze: 'Bronze',
	silver: 'Silver',
	gold: 'Gold',
	platinum: 'Platinum',
	diamond: 'Diamond',
	master: 'Master',
	grandmaster: 'Grandmaster',
	top500: 'Top 500'
} satisfies Record<SkillTier, string>;
