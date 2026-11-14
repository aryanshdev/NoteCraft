/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Familjen Grotesk"', "ui-sans-serif", "system-ui", "sans-serif"],
        hand: ['"Kalam"', "cursive"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      colors: {
        ink: {
          950: "#0e1012",
          900: "#14171a",
          800: "#1b1f23",
          700: "#252a30",
          600: "#343a42",
          400: "#7d8590",
          300: "#a9b0b8",
          100: "#ecebe6",
        },
        marker: "#ffd43b",
      },
    },
  },
  plugins: [],
};
