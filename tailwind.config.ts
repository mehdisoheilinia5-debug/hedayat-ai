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
          50: "#f7f1e3",
          100: "#ede0c8",
          200: "#dcc89a",
          300: "#c7a86b",
          400: "#a8824a",
          500: "#8a6636",
          900: "#3a2a17",
        },
        ink: {
          900: "#0d0d0d",
          800: "#161616",
          700: "#211f1c",
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
