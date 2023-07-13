export type OverwatchSeasonSlug = string;

export type OverwatchSeason = {
	name: string;
	slug: OverwatchSeasonSlug;
	modalities: Record<string, string>;
	startTime: Date;
	endTime: Date;
}

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
	}
} as Record<OverwatchSeasonSlug, OverwatchSeason>;

export const currentSeason = seasons['season-5'];
