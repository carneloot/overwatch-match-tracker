import { eq } from 'drizzle-orm';

import { db } from '$lib/database/db';
import { mapsTable } from '$lib/database/schema';

export async function getEnabledMaps() {
	return db
		.select()
		.from(mapsTable)
		.where(eq(mapsTable.enabled, true))
		.orderBy(mapsTable.type, mapsTable.name)
		.all();
}
