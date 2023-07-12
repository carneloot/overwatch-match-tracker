import { and, gt, lt } from 'drizzle-orm';

import { db } from '$lib/database/db';
import { seasonsTable } from '$lib/database/schema';

export async function getActiveSeason(referenceTime: Date) {
	const [ season ] = await db
		.select()
		.from(seasonsTable)
		.where(
			and(
				lt(seasonsTable.startTime, referenceTime),
				gt(seasonsTable.finishTime, referenceTime)
			)
		)
		.all();

	return season;
}
