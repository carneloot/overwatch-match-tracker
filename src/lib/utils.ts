import type { RequestEvent } from '@sveltejs/kit';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function handleLoginRedirect(event: RequestEvent) {
	const redirectTo = event.url.pathname + event.url.search;
	return `/login?redirectTo=${redirectTo}`;
}

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

export function dateToDatetimeLocal(date: Date | null): string {
	if (!date) return '';
	const copyDate = new Date(date);
	copyDate.setMinutes(copyDate.getMinutes() - copyDate.getTimezoneOffset());
	return copyDate?.toISOString().slice(0, 16) ?? '';
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
