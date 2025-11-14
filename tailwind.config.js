/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        white: '#ffffff',
        bluePetnet: '#3370EB',
        yellowPetnet: '#F9EE7C',
        black: '#000000',
      },
    },
  },
  plugins: [],
}
