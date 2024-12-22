import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  darkMode: "class", // Activer le mode sombre via une classe
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      boxShadow: {
        light: "0 5px 15px rgba(0, 0, 0, 0.40)", // Ombres pour le thème clair
        dark: "0 5px 15px rgba(255, 255, 255, 0.40)", // Ombres pour le thème sombre
      },
    },
  },

  plugins: [],
} satisfies Config;
