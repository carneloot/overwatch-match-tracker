import { redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';
import { handleLoginRedirect } from '$lib/utils';
import { getSelectedAccountByUser } from '$lib/account.server';
import { countMatchesForDisplay, getMatchesForDisplay } from '$lib/match.server';
import { currentSeason } from '$lib/data/seasons';

export const load = (async (event) => {
	if (!event.locals.user) {
		throw redirect(301, handleLoginRedirect(event));
	}

	const selectedAccount = await getSelectedAccountByUser(event.locals.user.id);

	const limit = Number(event.url.searchParams.get('limit') ?? 10);
	const skip = Number(event.url.searchParams.get('skip') ?? 0);

	return {
		matches: getMatchesForDisplay({
			accountId: selectedAccount.id,
			season: currentSeason.slug,
			limit,
			skip
		}),
		total: countMatchesForDisplay({
			accountId: selectedAccount.id,
			season: currentSeason.slug
		})
	};
}) satisfies PageServerLoad;
