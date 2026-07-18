/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0F2647",
        alertRed: "#E24B4A",
        alertOrange: "#EF9F27",
        alertGreen: "#639922",
      },
    },
  },
  plugins: [],
};
