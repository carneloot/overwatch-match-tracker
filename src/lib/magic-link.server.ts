import { add, isAfter } from 'date-fns';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import * as constants from '$lib/constants';

import { decrypt, encrypt } from '$lib/encryption.server';
import { db } from '$lib/database/db';
import { usersTable } from '$lib/database/schema';
import { sendMagicLinkEmail } from '$lib/email.server';
import { jsonParse } from '$lib/utils';

type SendMagicLink = {
	email: string;
	domainUrl: string;
};

type GetMagicLink = {
	email: string;
	domainUrl: string;
};

const MagicLinkPayload = z.object({
	email: z.string().email(),
	expires: z.string().datetime()
});
type MagicLinkPayload = z.infer<typeof MagicLinkPayload>;

export function getMagicLink({ email, domainUrl }: GetMagicLink) {
	const payload: MagicLinkPayload = {
		email,
		expires: add(new Date(), constants.auth.magicLinkExpirationTime).toISOString()
	};

	const payloadAsString = JSON.stringify(payload);
	const encryptedString = encrypt(payloadAsString);

	const url = new URL(domainUrl);
	url.pathname = 'magic';
	url.searchParams.set(constants.auth.magicLinkSearchParam, encryptedString);
	return url.toString();
}

export async function sendMagicLink({ email, domainUrl }: SendMagicLink) {
	const magicLink = getMagicLink({ email, domainUrl });

	const user = db.select().from(usersTable).where(eq(usersTable.email, email)).get() ?? null;

	await sendMagicLinkEmail({
		email,
		domainUrl,
		magicLink,
		user
	});

	return magicLink;
}

function getMagicLinkCode(link: string) {
	try {
		const url = new URL(link);
		return url.searchParams.get(constants.auth.magicLinkSearchParam) ?? '';
	} catch {
		return '';
	}
}

export async function validateMagicLink(link: string) {
	const linkCode = getMagicLinkCode(link);

	let email: string, expires: Date;
	try {
		const decryptedString = decrypt(linkCode);
		const payload = MagicLinkPayload.parse(jsonParse(decryptedString));
		email = payload.email;
		expires = new Date(payload.expires);
	} catch (error: unknown) {
		console.error(error);
		throw new Error('Sign in link invalid. Please request a new one.');
	}

	if (isAfter(new Date(), expires)) {
		throw new Error('Magic link expired. Please request a new one.');
	}

	return email;
}
