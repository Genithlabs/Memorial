/** @type {import('tailwindcss').Config} */
module.exports = {
  important: '#__next',
  content: [
      "./{app,components,libs,pages,hooks}/**/*.{html,js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",

  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

