/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0b0f14',
        'bg-secondary': '#111821',
        'bg-tertiary': '#1c2733',
        'bg-elevated': '#243040',
        border: '#2a3845',
        accent: '#ff4655',
        'accent-hi': '#ff5e6c',
        'text-primary': '#ece8e1',
        'text-secondary': '#8b978f',
        'text-muted': '#5a6670',
        win: '#1fc879',
        loss: '#ff4655',
        draw: '#f2a23a'
      },
      fontFamily: {
        display: ['Anton', '"DM Sans"', 'system-ui', 'sans-serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace']
      },
      letterSpacing: {
        brutal: '0.18em'
      }
    }
  },
  plugins: []
};
