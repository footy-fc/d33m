/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'xxs': '0.625rem', // Add a custom size
      },
      colors: {
        deepPink: '#BD195D',
        purplePanel: '#010513',
        darkPurple: '#181424',
        limeGreen: '#32CD32', //'#A2E634', // defifa '#32CD32', #8cc929
        limeGreenOpacity: 'rgba(162, 230, 52, 0.7)',
        lightPurple: '#C0B2F0',
        fontRed: '#EC017C',
        notWhite: '#FEA282',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}