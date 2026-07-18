import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sepia: {
          50: "#fafafa",
          100: "#e4e4e7",
          200: "#d4d4d8",
          300: "#a1a1aa",
          400: "#71717a",
          500: "#52525b",
          900: "#18181b",
        },
        ink: {
          900: "#1c1c1f",
          800: "#27272a",
          700: "#323236",
        },
      },
      fontFamily: {
        vazir: ["Vazirmatn", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;