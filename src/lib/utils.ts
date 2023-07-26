import type { RequestEvent } from '@sveltejs/kit';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function groupByField<Type, Key extends keyof Type>(
	arr: Type[],
	key: Key
): Array<{ name: Type[Key]; values: Type[] }> {
	const map = new Map<Type[Key], Type[]>();

	for (const value of arr) {
		if (map.has(value[key])) {
			const innerArr = map.get(value[key]);
			innerArr?.push(value);
		} else {
			map.set(value[key], [value]);
		}
	}

	return [...map.entries()].reduce(
		(acc, curr) => acc.concat({ name: curr[0], values: curr[1] }),
		[] as Array<{ name: Type[Key]; values: Type[] }>
	);
}

export function jsonParse<T = unknown>(value: string) {
	return JSON.parse(value) as T;
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getDomainUrl({ request }: RequestEvent) {
	const host = request.headers.get('X-Forwarded-Host') ?? request.headers.get('host');
	if (!host) {
		throw new Error('Could not determine domain URL.');
	}

	const protocol = host.includes('localhost') ? 'http' : 'https';
	return `${protocol}://${host}`;
}

export const DATETIME_LOCAL_FORMAT = "yyyy-MM-dd'T'HH:mm";
