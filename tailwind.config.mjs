/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class", "[data-theme='dark']"],
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        dark: "var(--r-black, #000)",
        light: "var(--r-white, #fff)",
        "r-red": "var(--r-red, #e22f2e)",
        "r-orange": "var(--r-orange, #dc6d2c)",
        "r-yellow": "var(--r-yellow, #ddb631)",
      },
      fontFamily: {
        krypton: ["Krypton", "ui-monospace", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};
