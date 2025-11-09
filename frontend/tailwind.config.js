/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: '#FFF0E2',
        foreground: '#411900',
        accent: '#AE6E4E',
        secondary: '#F6D0AE',
      }
    },
  },
  plugins: [],
}
