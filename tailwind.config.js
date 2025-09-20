/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./App.{js,jsx,ts,tsx}",
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}"
    ],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {colors: {
                primary: "#3A3A3C",
                green: "#5B8E7D",
                bluegrey: "#94A3B8",
                secondary: "#FBFCFD",
                grayLight: "#F0F0F0",
            },},
    },
    plugins: [],
};
