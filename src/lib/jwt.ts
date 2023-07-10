import { SignJWT, jwtVerify } from 'jose';
import { z } from 'zod';

import { JWT_SECRET } from '$env/static/private';
import { error } from '@sveltejs/kit';

const JWTPayloadSchema = z.object({
	id: z.string().uuid()
});

type JWTPayload = z.infer<typeof JWTPayloadSchema>;

export const createAuthJWT = async (data: JWTPayload) => {
	return await new SignJWT(data)
		.setProtectedHeader({ alg: 'HS256' })
		.sign(new TextEncoder().encode(JWT_SECRET));
};

export const verifyJwt = async (token: string) => {
	try {
		const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
		return JWTPayloadSchema.parse(payload);
	} catch {
		throw error(401, 'Invalid or missing JWT');
	}
};
