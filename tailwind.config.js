/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {},
    colors: {
      main: "#274E61",
      task_board: "#EAEEF0",
      task_title: "#707070",
      toolbar: "#768490",
      white: "#ffffff",
      task_deatils: "#ABABAB",
      task_process: "#E1E1E1",
      red: "red",
    },
  },
  plugins: [require("daisyui")],
};
// require('tailwindcss')
