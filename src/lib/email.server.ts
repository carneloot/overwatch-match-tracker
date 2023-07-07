import { EMAIL_VERIFIER_AUTH } from '$env/static/private';

type VerifierResult =
	| { status: true; email: string; domain: string }
	| { status: false; error: { code: number; message: string } }

export async function verifyEmail(emailAddress: string) {
	const verifierUrl = new URL(
		`https://verifier.meetchopra.com/verify/${emailAddress}`
	);
	verifierUrl.searchParams.append('token', EMAIL_VERIFIER_AUTH);
	const response = await fetch(verifierUrl.toString());
	return await response.json() as VerifierResult;
}
