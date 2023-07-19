import { Resend } from 'resend';

import { env } from '$env/dynamic/private';
import type { User } from '$lib/database/schema';

type VerifierResult =
	| { status: true; email: string; domain: string }
	| { status: false; error: { code: number; message: string } };

export async function verifyEmail(emailAddress: string) {
	const verifierUrl = new URL(`https://verifier.meetchopra.com/verify/${emailAddress}`);
	verifierUrl.searchParams.append('token', env.EMAIL_VERIFIER_AUTH);
	const response = await fetch(verifierUrl.toString());
	return (await response.json()) as VerifierResult;
}

type SendMagicLinkEmail = {
	user: User | null;
	domainUrl: string;
	email: string;
	magicLink: string;
};

const resend = new Resend(env.RESEND_API_KEY);

export async function sendMagicLinkEmail({
	domainUrl,
	email,
	magicLink,
	user
}: SendMagicLinkEmail) {
	const sender = 'Match Tracker Team <match-tracker@carneloot.com>';
	const { hostname } = new URL(domainUrl);
	const userExists = Boolean(user);

	const text = `
Here's your sign-in link for ${hostname}:

${magicLink}

${
	userExists
		? `Welcome back ${email}`
		: `Clicking the link above will create a new account on ${hostname} with the email ${email}. Welcome!`
}

Thanks for joining in and happy tracking!

- carneloot

PS: If you did now request this email, you can safely ignore it.
	`.trim();

	await resend.sendEmail({
		to: email,
		subject: `Here's your sign-in link for 🎮 Overwatch Match Tracker`,
		from: sender,
		text
	});
}
