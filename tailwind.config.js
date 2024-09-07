/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {},
    colors: {
      main: "#274E61",
      task_board: "#EAEEF0",
    },
  },
  plugins: [require("daisyui")],
};
// require('tailwindcss')
