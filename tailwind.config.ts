import type { Config } from 'tailwindcss';

const config: Config = {
 darkMode: ['class', '[data-theme="dark"]'],
 content: [
   './app/**/*.{ts,tsx}',
   './components/**/*.{ts,tsx}',
   './lib/**/*.{ts,tsx}',
 ],
 theme: {
   extend: {
     colors: {
       bg: 'var(--bg-void)',
       surface: 'var(--bg-surface)',
       raised: 'var(--bg-raised)',
       text: 'var(--text-primary)',
       muted: 'var(--text-muted)',
       accent: 'var(--accent-ice)',
       hairline: 'var(--border-hairline)',
     },
     fontFamily: {
       sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'sans-serif'],
       serif: ['var(--font-serif)', 'Georgia', 'serif'],
       mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
     },
     borderRadius: {
       'r10': 'var(--radius-10)',
       'r16': 'var(--radius-16)',
       'r24': 'var(--radius-24)',
       'r36': 'var(--radius-36)',
     },
     transitionTimingFunction: {
       'expo-out': 'var(--ease-expo-out)',
       'soft-in-out': 'var(--ease-soft-in-out)',
     },
     transitionDuration: {
       'micro': 'var(--dur-micro)',
       'ui': 'var(--dur-ui)',
       'scene': 'var(--dur-scene)',
     },
     spacing: {
       '18': '4.5rem',
       '22': '5.5rem',
       '30': '7.5rem',
     },
   },
 },
 plugins: [],
};

export default config;
