/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class", "[data-theme='dark']"],
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        dark: "#343232",
        light: "#e5e4d1",
        "r-red": "#e22f2e",
        "r-orange": "#dc6d2c",
        "r-yellow": "#ddb631",
      },
      fontFamily: {
        krypton: ["Krypton", "ui-monospace", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};
