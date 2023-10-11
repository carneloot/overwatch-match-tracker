import { addDays } from 'date-fns';

export type OverwatchSeasonSlug = string;

export type OverwatchSeason = {
	name: string;
	slug: OverwatchSeasonSlug;
	modalities: Record<string, string>;
	startTime: Date;
	endTime: Date;
};

export const seasons = {
	'season-5': {
		name: 'Season 5',
		slug: 'season-5',
		modalities: {
			'role-queue': 'Role Queue',
			'open-queue': 'Open Queue',
			mystery: 'Mystery Heroes',
			'team-queue': 'Team Queue'
		},
		startTime: new Date('2023-06-13T18:00:00.000Z'),
		endTime: new Date('2023-08-10T18:00:00.000Z')
	},
	'season-6': {
		name: 'Season 6',
		slug: 'season-6',
		modalities: {
			'role-queue': 'Role Queue',
			'open-queue': 'Open Queue',
			mystery: 'Mystery Heroes'
		},
		startTime: new Date('2023-08-10T18:00:00.000Z'),
		endTime: new Date('2023-10-10T18:00:00.000Z')
	},
	'season-7': {
		name: 'Season 7',
		slug: 'season-7',
		modalities: {
			'role-queue': 'Role Queue',
			'open-queue': 'Open Queue'
		},
		startTime: new Date('2023-10-10T18:00:00.000Z'),
		endTime: addDays(new Date('2023-10-10T18:00:00.000Z'), 56)
	}
} as Record<OverwatchSeasonSlug, OverwatchSeason>;

export const currentSeason = seasons['season-7'];
