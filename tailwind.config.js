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
      }),
      animation: {
        'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1)',
      },   
      keyframes: {
        ping: {
          '75%, 100%': {
            transform: scale(2),
            opacity: 0
          },
        }
      }
    },
  },
  plugins: [],
}

