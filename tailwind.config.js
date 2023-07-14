import { join } from 'path';

import skeleton from '@skeletonlabs/skeleton/tailwind/skeleton.cjs';

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		extend: {
			colors: {
				bronze: "#8C5B30",
				silver: "#6C6C6C",
				gold: "#d8b064",
				platinum: "#b9c6ca",
				diamond: "#638de9",
				master: "#ffab0f",
				grandmaster: "#5bc5fb",
				top500: "#f5dd69",
			}
		}
	},
	plugins: [
		require('@tailwindcss/forms'),
		...skeleton()
	]
};
