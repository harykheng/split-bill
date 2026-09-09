/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F7F2E4',
        'paper-dark': '#EFE8D4',
        ink: '#2A241C',
        'ink-soft': '#6B6152',
        line: '#C9BFA5',
        brand: {
          DEFAULT: '#0E4C4C',
          light: '#1B6666',
          dark: '#083636',
        },
        owe: {
          DEFAULT: '#9A3324',
          bg: '#F3E1DA',
        },
        receive: {
          DEFAULT: '#256D3B',
          bg: '#DEEBE0',
        },
      },
      fontFamily: {
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Consolas',
          'Liberation Mono',
          'monospace',
        ],
      },
    },
  },
  plugins: [],
}
