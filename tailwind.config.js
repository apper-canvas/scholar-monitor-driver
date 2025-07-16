/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#E6F3FF",
          100: "#B3DAFE",
          500: "#2C5282",
          600: "#1A365D",
          700: "#1A202C"
        },
        secondary: {
          50: "#E6FFFA",
          100: "#B2F5EA",
          500: "#38B2AC",
          600: "#319795",
          700: "#2C7A7B"
        },
        accent: {
          50: "#FFFAF0",
          100: "#FEEBC8",
          500: "#F6AD55",
          600: "#ED8936",
          700: "#C05621"
        },
        success: "#48BB78",
        warning: "#F6AD55",
        error: "#E53E3E",
        info: "#3182CE"
      },
      fontFamily: {
        display: ["Plus Jakarta Sans", "sans-serif"],
        body: ["Inter", "sans-serif"]
      }
    },
  },
  plugins: [],
}