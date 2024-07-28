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
        "great": ["'Great Vibes'","cursive"],
        "prompt": ["'Prompt'"],
        "playwrite": ["'Playwrite AR'","cursive"],
        "noto": ["'Noto Sans JP'","sans-serif"],
        "playfair": ["'Playfair Display'","serif"]

      },
      animation: {
        'pingonce': 'ping 1s cubic-bezier(0, 0, 0.2, 1)',
        'bounceonce': 'bounce 1s',
      },
      backgroundImage: theme => ({
        "phone": "url('/public/Phone.png')",
        "PC": "url('/public/PC.png')"
      })
    },
  },
  plugins: [],
}

