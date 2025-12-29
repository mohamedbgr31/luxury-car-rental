/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			// Enhanced responsive breakpoints for large screens
			screens: {
				'xs': '475px',
				'hd': '1366px', // For HD displays (1366x768)
				'fhd': '1920px', // For FHD displays
				'2k': '2560px', // For 2K displays
				'4k': '3840px', // For 4K displays
			},
			// Container max-widths for different screen sizes
			maxWidth: {
				'screen-xs': '475px',
				'screen-sm': '640px',
				'screen-md': '768px',
				'screen-lg': '1024px',
				'screen-xl': '1280px',
				'screen-2xl': '1536px',
				'screen-hd': '1366px',
				'screen-fhd': '1920px',
				'screen-2k': '2560px',
				'screen-4k': '3840px',
				'container-sm': '640px',
				'container-md': '768px',
				'container-lg': '1024px',
				'container-xl': '1200px',
				'container-2xl': '1400px',
				'container-hd': '1200px',
				'container-fhd': '1400px',
				'container-2k': '1600px',
				'container-4k': '2000px',
			},
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				},
				gold: {
					DEFAULT: '#D4AF37',
					light: '#F4DF87',
					dark: '#AA8C2C',
					50: '#FCFAF4',
					100: '#F9F4E6',
					200: '#F2E6C6',
					300: '#EBD8A6',
					400: '#E4CA86',
					500: '#D4AF37',
					600: '#AA8C2C',
					700: '#806921',
					800: '#554616',
					900: '#2B230B',
				}
			},
			fontFamily: {
				bruno: [
					'Bruno Ace',
					'cursive'
				],
				playfair: [
					'Playfair Display',
					'serif'
				]
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
};
