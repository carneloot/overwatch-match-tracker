import { EMAIL_VERIFIER_AUTH } from '$env/static/private';
import type { User } from '$lib/database/schema';

type VerifierResult =
	| { status: true; email: string; domain: string }
	| { status: false; error: { code: number; message: string } };

export async function verifyEmail(emailAddress: string) {
	const verifierUrl = new URL(`https://verifier.meetchopra.com/verify/${emailAddress}`);
	verifierUrl.searchParams.append('token', EMAIL_VERIFIER_AUTH);
	const response = await fetch(verifierUrl.toString());
	return (await response.json()) as VerifierResult;
}

type EmailMessage = {
	to: string;
	from: string;
	subject: string;
	text: string;
	html?: string | null;
};

type SendMagicLinkEmail = {
	user: User | null;
	domainUrl: string;
	email: string;
	magicLink: string;
};

export async function sendMail(data: EmailMessage) {
	// TODO
	// if (!html) {
	// 	html = text;
	// }
	// const transport = nodemailer.createTransport({
	// 	host: NODEMAILER_HOST,
	// 	port: Number(NODEMAILER_PORT),
	// 	auth: {
	// 		user: NODEMAILER_USER,
	// 		pass: NODEMAILER_PASS
	// 	}
	// });
	// const info = await transport.sendMail({
	// 	to,
	// 	from,
	// 	subject,
	// 	text,
	// 	html
	// });
}

export async function sendMagicLinkEmail({
	domainUrl,
	email,
	magicLink,
	user
}: SendMagicLinkEmail) {
	const sender = 'match-tracker@carneloot.com';
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

	await sendMail({
		to: email,
		subject: `Here's your sign-in link for 🎮 Overwatch Match Tracker`,
		from: sender,
		text
	});
}
