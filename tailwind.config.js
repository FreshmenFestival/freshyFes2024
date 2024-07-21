/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "noto-sans": ["var(--font-sans)"],
        "alex": ["'Alex Brush'", "cursive"],
        "alice": ["'Alice'", "serif"],
      },
      backgroundImage: theme => ({
        "phone": "url('/public/Phone.png')",
        "PC": "url('/public/PC.png')"
      })
    },
  },
  plugins: [],
}

