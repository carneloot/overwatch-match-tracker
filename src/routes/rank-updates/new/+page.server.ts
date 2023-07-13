import { redirect, type Actions, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { v4 as uuid } from 'uuid';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import type { PageServerLoad } from './$types';

import { handleLoginRedirect } from '$lib/utils';
import { getSelectedAccountByUser } from '$lib/account.server';
import { SeasonalUpdate, SkillTier, heroesMatchesTable, matchesTable, rankUpdatesTable } from '$lib/database/schema';
import { HeroRole, heroes } from '$lib/data/heroes';
import { db } from '$lib/database/db';
import { currentSeason } from '$lib/data/seasons';

const getMatch = async (matchId: string) => {
	const [match] = await db
		.select({
			time: matchesTable.time,
			modality: matchesTable.modality,
			hero: heroesMatchesTable.hero,
		})
		.from(matchesTable)
		.innerJoin(heroesMatchesTable, eq(heroesMatchesTable.matchId, matchesTable.id))
		.where(eq(matchesTable.id, matchId))
		.limit(1)
		.all();

	return match;
}

export const load = (async (event) => {
	if (!event.locals.user) {
		throw redirect(302, handleLoginRedirect(event));
	}

	const activeAccount = await getSelectedAccountByUser(event.locals.user.id);

	const matchId = event.url.searchParams.get('matchId');
	const match = matchId ? await getMatch(matchId) : undefined;
	const role = match
		? match.modality === 'role-queue'
			? heroes[match.hero].role
			: undefined
		: undefined;

	const initialValues = {
		accountId: activeAccount.id,
		matchId: matchId ?? undefined,
		time: match?.time ?? new Date(),
		modality: match?.modality ?? undefined,
		role,
	} satisfies Partial<NewRankUpdate>;

	const form = await superValidate(initialValues, newRankUpdateSchema);

	return { form };
}) satisfies PageServerLoad;

const newRankUpdateSchema = z.object({
	accountId: z.string().uuid(),
	matchId: z.string().uuid().optional(),
	seasonalUpdate: SeasonalUpdate.optional(),
	modality: z.string(),
	role: HeroRole.optional(),
	time: z.coerce.date(),
	tier: SkillTier,
	division: z.number().int().min(1).max(500),
	percentage: z.number().int().min(1).max(100).optional(),
})
	.superRefine(({ matchId, seasonalUpdate, tier, division, percentage }, ctx) => {
		if (!matchId && !seasonalUpdate) {
			ctx.addIssue({
				code: 'custom',
				message: 'Seasonal update is required',
				path: ['seasonalUpdate']
			});
		}

		if (tier !== 'top500') {
			if (division > 5) {
				ctx.addIssue({
					code: 'custom',
					message: 'Division must be less than 5',
					path: ['division']
				});
			}

			if (!percentage) {
				ctx.addIssue({
					code: 'custom',
					message: 'Percentage is required',
					path: ['percentage']
				});
			}
		}
	});
type NewRankUpdate = z.infer<typeof newRankUpdateSchema>;

async function createRankUpdate(data: NewRankUpdate) {
	await db
		.insert(rankUpdatesTable)
		.values({
			id: uuid(),
			...data,
			season: currentSeason.slug,
		})
		.run();
}


export const actions = {
	default: async (event) => {
		if (!event.locals.user) {
			throw redirect(302, handleLoginRedirect(event));
		}

		const form = await superValidate(event, newRankUpdateSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		await createRankUpdate(form.data);

		const redirectTo = event.url.searchParams.get('redirectTo') ?? '/matches';

		throw redirect(302, `/${redirectTo.slice(1)}`);
	}
} satisfies Actions;
