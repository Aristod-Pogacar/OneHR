/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        museo: ['MuseoModerno_400Regular'],
        museoBold: ['MuseoModerno_700Bold'],
      },
    },
  },
  plugins: [],
}