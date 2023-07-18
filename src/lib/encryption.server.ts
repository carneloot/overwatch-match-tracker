import * as crypto from 'crypto';

import { AUTH_SECRET } from '$env/static/private';

const IV_LENGTH = 12;
const HEX = 'hex';
const UTF8 = 'utf8';

const algorithm = 'aes-256-gcm';

export function encrypt(value: string): string {
	const iv = crypto.randomBytes(IV_LENGTH);
	const cipher = crypto.createCipheriv(algorithm, AUTH_SECRET, iv);
	let encrypted = cipher.update(value, UTF8, HEX);
	encrypted += cipher.final(HEX);
	const authTag = cipher.getAuthTag();

	return [iv.toString(HEX), authTag.toString(HEX), encrypted].join(':');
}

export function decrypt(text: string) {
	const [ivPart, authTagPart, encryptedText] = text.split(':');
	if (!ivPart || !authTagPart || !encryptedText) {
		throw new Error('Invalid text.');
	}

	const iv = Buffer.from(ivPart, HEX);
	const authTag = Buffer.from(authTagPart, HEX);
	const decipher = crypto.createDecipheriv(algorithm, AUTH_SECRET, iv);
	decipher.setAuthTag(authTag);
	let decrypted = decipher.update(encryptedText, HEX, UTF8);
	decrypted += decipher.final(UTF8);
	return decrypted;
}
