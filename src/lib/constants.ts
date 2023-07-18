import type { Duration } from 'date-fns';

export const cookies = {
	matchKeepValue: 'matchKeepValue'
} as const;

export const auth = {
	magicLinkExpirationTime: { minutes: 30 } satisfies Duration,
	magicLinkSearchParam: 'owzinKey',
	sessionExpirationTime: 1000 * 60 * 60 * 24 * 7
} as const;
