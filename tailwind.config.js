/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0f1923',
        'bg-secondary': '#1a2634',
        'bg-tertiary': '#243040',
        accent: '#ff4655',
        'accent-hover': '#ff6b77',
        'text-primary': '#ece8e1',
        'text-secondary': '#8b978f',
        win: '#17b36a',
        loss: '#e5484d',
        draw: '#f5a623'
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace']
      }
    }
  },
  plugins: []
};
