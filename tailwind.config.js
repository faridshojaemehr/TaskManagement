/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {},
    colors: {
      main: "#274E61",
      task_board: "#EAEEF0",
      toolbar: "#768490",
    },
  },
  plugins: [require("daisyui")],
};
// require('tailwindcss')
