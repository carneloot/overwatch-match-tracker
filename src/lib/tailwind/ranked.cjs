import plugin from 'tailwindcss/plugin';

const settings = {
	colorNames: ['bronze', 'silver', 'gold', 'platinum', 'diamond', 'master', 'grandmaster', 'top500'],
	colorShades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
	colorPairings: [
		// forward:
		{ light: 50, dark: 900 },
		{ light: 100, dark: 800 },
		{ light: 200, dark: 700 },
		{ light: 300, dark: 600 },
		{ light: 400, dark: 500 },
		// backwards
		{ light: 900, dark: 50 },
		{ light: 800, dark: 100 },
		{ light: 700, dark: 200 },
		{ light: 600, dark: 300 },
		{ light: 500, dark: 400 }
	]
};

const backdropAlpha = 0.7;
const hoverAlpha = 0.1;

const getBackgrounds = () => {
	const classes = {};
	settings.colorNames.forEach((n) => {
		// Backdrops
		// Example: .bg-primary-backdrop-token
		classes[`.bg-${n}-backdrop-token`] = { 'background-color': `rgb(var(--color-${n}-400) / ${backdropAlpha})` };
		classes[`.dark .bg-${n}-backdrop-token`] = { 'background-color': `rgb(var(--color-${n}-900) / ${backdropAlpha})` };

		// Hover
		// Example: .bg-primary-hover-token
		classes[`.bg-${n}-hover-token:hover`] = { 'background-color': `rgb(var(--color-${n}-500) / ${hoverAlpha})` };
		classes[`.dark .bg-${n}-hover-token:hover`] = { 'background-color': `rgb(var(--color-${n}-200) / ${hoverAlpha})` };

		// Active
		// Example: .bg-primary-active-token
		classes[`.bg-${n}-active-token`] = {
			'background-color': `rgb(var(--color-${n}-500)) !important`,
			color: `rgb(var(--on-${n}))`,
			fill: `rgb(var(--on-${n}))`
		};

		// Color Pairings
		// Example: .bg-primary-50-900-token | .bg-primary-900-50-token
		settings.colorPairings.forEach((p) => {
			classes[`.bg-${n}-${p.light}-${p.dark}-token`] = { 'background-color': `rgb(var(--color-${n}-${p.light}))` };
			classes[`.dark .bg-${n}-${p.light}-${p.dark}-token`] = { 'background-color': `rgb(var(--color-${n}-${p.dark}))` };
		});
	});
	return classes;
};

const getRings = () => {
	const classes = {};
	settings.colorNames.forEach((n) => {
		// Color Pairings
		// Example: .ring-primary-50-900-token | .ring-primary-900-50-token
		settings.colorPairings.forEach((p) => {
			classes[`.ring-${n}-${p.light}-${p.dark}-token`] = {
				'--tw-ring-color': `rgb(var(--color-${n}-${p.light}) / 1)`
			};
			classes[`.dark .ring-${n}-${p.light}-${p.dark}-token`] = {
				'--tw-ring-color': `rgb(var(--color-${n}-${p.dark}) / 1)`
			};
		});
	});
	return classes;
}

const getTexts = () => {
	const classes = {};
	settings.colorNames.forEach(n => {
		// On-X Text Colors
		classes[`.text-on-${n}-token`] = { color: `rgb(var(--on-${n}))` };

		// Color Pairings
		settings.colorPairings.forEach((p) => {
			classes[`.text-${n}-${p.light}-${p.dark}-token`] = { color: `rgb(var(--color-${n}-${p.light}))` };
			classes[`.dark .text-${n}-${p.light}-${p.dark}-token`] = { color: `rgb(var(--color-${n}-${p.dark}))` };
		});
	});
	return classes;
}

const getBorders = () => {
	const classes = {};
	settings.colorNames.forEach((n) => {
		// Color Pairings
		settings.colorPairings.forEach((p) => {
			classes[`.border-${n}-${p.light}-${p.dark}-token`] = { 'border-color': `rgb(var(--color-${n}-${p.light}))` };
			classes[`.dark .border-${n}-${p.light}-${p.dark}-token`] = { 'border-color': `rgb(var(--color-${n}-${p.dark}))` };
		});
	});
	return classes;
};

const getFills = () => {
	const classes = {};
	settings.colorNames.forEach((n) => {
		// On-X Fill Colors
		classes[`.fill-on-${n}-token`] = { fill: `rgb(var(--on-${n}))` };
	});
	return classes;
};

module.exports = plugin(
	({ addUtilities }) => {
		addUtilities({
			...getBackgrounds(),
			...getTexts(),
			...getRings(),
			...getBorders(),
			...getFills(),
		})
	},
	{
		theme: {
			extend: {
				colors: {
					bronze: {
						50: '#eee6e0',
						100: '#e8ded6',
						200: '#e2d6cb',
						300: '#d1bdac',
						400: '#af8c6e',
						500: '#8C5B30',
						600: '#7e522b',
						700: '#694424',
						800: '#54371d',
						900: '#452d18',
					},
					silver: {
						50: '#e9e9e9',
						100: '#e2e2e2',
						200: '#dadada',
						300: '#c4c4c4',
						400: '#989898',
						500: '#6C6C6C',
						600: '#616161',
						700: '#515151',
						800: '#414141',
						900: '#353535',
					},
					gold: {
						50: '#f9f3e8',
						100: '#f7efe0',
						200: '#f5ebd8',
						300: '#efdfc1',
						400: '#e4c893',
						500: '#d8b064',
						600: '#c29e5a',
						700: '#a2844b',
						800: '#826a3c',
						900: '#6a5631',
					},
					platinum: {
						50: '#f5f6f7',
						100: '#f1f4f4',
						200: '#eef1f2',
						300: '#e3e8ea',
						400: '#ced7da',
						500: '#b9c6ca',
						600: '#a7b2b6',
						700: '#8b9598',
						800: '#6f7779',
						900: '#5b6163',
					},
					diamond: {
						50: '#e8eefc',
						100: '#e0e8fb',
						200: '#d8e3fa',
						300: '#c1d1f6',
						400: '#92aff0',
						500: '#638de9',
						600: '#597fd2',
						700: '#4a6aaf',
						800: '#3b558c',
						900: '#314572',
					},
					master: {
						50: '#fff2db',
						100: '#ffeecf',
						200: '#ffeac3',
						300: '#ffdd9f',
						400: '#ffc457',
						500: '#ffab0f',
						600: '#e69a0e',
						700: '#bf800b',
						800: '#996709',
						900: '#7d5407',
					},
					grandmaster: {
						50: '#e6f6fe',
						100: '#def3fe',
						200: '#d6f1fe',
						300: '#bde8fd',
						400: '#8cd6fc',
						500: '#5bc5fb',
						600: '#52b1e2',
						700: '#4494bc',
						800: '#377697',
						900: '#2d617b',
					},
					top500: {
						50: '#fefae9',
						100: '#fdf8e1',
						200: '#fdf7da',
						300: '#fbf1c3',
						400: '#f8e796',
						500: '#f5dd69',
						600: '#ddc75f',
						700: '#b8a64f',
						800: '#93853f',
						900: '#786c33',
					},
				}
			}
		}
	}
);
