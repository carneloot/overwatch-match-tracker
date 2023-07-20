import { OAuth2Client } from 'google-auth-library';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';
import type { RequestEvent } from '@sveltejs/kit';
import { getDomainUrl } from '$lib/utils';

let __client: OAuth2Client;

function getGoogleOAuthClient(event: RequestEvent) {
	if (!__client) {
		const domain = getDomainUrl(event);
		const redirectUri = new URL(domain);
		redirectUri.pathname = '/auth/google/callback';

		__client = new OAuth2Client({
			clientId: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
			redirectUri: redirectUri.toString()
		});
	}
	return __client;
}

export { getGoogleOAuthClient };
