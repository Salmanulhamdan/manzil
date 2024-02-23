/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'spin-and-blur': 'spin-and-blur 3s linear infinite',
      },
      keyframes: {
        'spin-and-blur': {
          '0%': {
            transform: 'rotate(0)',
            backdropFilter: 'blur(0)',
          },
          '100%': {
            transform: 'rotate(360deg)',
            backdropFilter: 'blur(20px)',
          },
        },
      },
    },
  },
  plugins: [],
}
