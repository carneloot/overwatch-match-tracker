import { join } from 'path';

import skeleton from '@skeletonlabs/skeleton/tailwind/skeleton.cjs';
import ranked from './src/lib/tailwind/ranked.cjs';

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {

	},
	plugins: [
		require('@tailwindcss/forms'),
		ranked,
		...skeleton(),
	]
};
