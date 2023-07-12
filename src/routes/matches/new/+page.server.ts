import { fail, redirect } from '@sveltejs/kit';

import { superValidate } from 'sveltekit-superforms/server';

import type { Actions, PageServerLoad } from './$types';

import * as constants from '$lib/constants';

import { getActiveSeason } from '$lib/season.server';
import { getAccountsByUser, getSelectedAccountByUser } from '$lib/account.server';
import { groupByField, handleLoginRedirect } from '$lib/utils';
import { getEnabledHeroes } from '$lib/hero.server';
import { getEnabledMaps } from '$lib/map.server';
import { getModalities } from '$lib/modality.server';
import { createNewMatch, type NewMatch, newMatchSchema } from '$lib/match.server';

export const load = (async (event) => {
	if (!event.locals.user) {
		throw redirect(302, handleLoginRedirect(event));
	}

	const currentTime = new Date();

	const activeSeason = await getActiveSeason(currentTime);
	const userAccount = await getSelectedAccountByUser(event.locals.user.id);

	const keepValuesCookie = JSON.parse(event.cookies.get(constants.cookies.matchKeepValue) ?? 'null') as Pick<NewMatch, 'accounts' | 'modalityId'> | null;

	const initialValues = {
		seasonId: activeSeason?.id,
		time: currentTime,
		accountId: userAccount.id,
		accounts: [],
		...(keepValuesCookie ?? {})
	} satisfies Partial<NewMatch>;

	const form = await superValidate(initialValues, newMatchSchema);

	const availableAccounts = getAccountsByUser(event.locals.user.id);
	const availableHeroes = getEnabledHeroes();
	const availableMaps = getEnabledMaps();
	const availableModalities = getModalities();

	return {
		form,
		availableAccounts,
		availableModalities,
		availableHeroes: availableHeroes.then(arr => groupByField(arr, 'role')),
		availableMaps: availableMaps.then(arr => groupByField(arr, 'type'))
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, newMatchSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		await createNewMatch(form.data);

		// region Keep Values Cookie
		const keepValuesCookie = {
			accounts: form.data.accounts,
			modalityId: form.data.modalityId
		};

		event.cookies.set(constants.cookies.matchKeepValue, JSON.stringify(keepValuesCookie), {
			path: '/matches/new'
		});
		// endregion

		throw redirect(301, '/matches');
	}
} satisfies Actions;
