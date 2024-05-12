/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#DC84F3",
        secondary: "#1678F3",
        secondaryContent: "#4DBAE9",
        gray: {
          DEFAULT: "#7D7D7D",
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      "light",
      {
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
        },
      },
    ],
  },
};
