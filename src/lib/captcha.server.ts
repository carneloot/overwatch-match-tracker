import { HCAPTCHA_SECRET, HCAPTCHA_VERIFY_SITE } from '$env/static/private';

type CaptchaErrorCode =
	| 'missing-input-secret'
	| 'invalid-input-secret'
	| 'missing-input-response'
	| 'invalid-input-response'
	| 'bad-request'
	| 'invalid-or-already-seen-response'
	| 'not-using-dummy-passcode'
	| 'sitekey-secret-mismatch';

type CaptchaResponse = {
	success: boolean;
	challenge_ts: string;
	hostname: string;
	'error-codes': CaptchaErrorCode[];
};

export async function verifyCaptcha(captcha: string) {
	const body = new URLSearchParams({
		response: captcha,
		secret: HCAPTCHA_SECRET
	});

	const res = await fetch(HCAPTCHA_VERIFY_SITE, {
		method: 'POST',
		body
	});

	const result = (await res.json()) as CaptchaResponse;

	if (!result.success) {
		return {
			success: false,
			messages: result['error-codes'].join(', ')
		};
	}

	return {
		success: true
	};
}
