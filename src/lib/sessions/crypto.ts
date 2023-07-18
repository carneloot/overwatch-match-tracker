import cookieSignature from 'cookie-signature';

export type SignFunction = (value: string, secret: string) => Promise<string>;

export type UnsignFunction = (cookie: string, secret: string) => Promise<string | false>;

export const sign: SignFunction = async (value, secret) => {
	return cookieSignature.sign(value, secret);
};

export const unsign: UnsignFunction = async (signed: string, secret: string) => {
	return cookieSignature.unsign(signed, secret);
};
