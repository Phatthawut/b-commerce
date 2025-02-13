/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: "#3498db",
				secondary: "#2ecc71",
				accent: "#e74c3c",
			},
			fontFamily: {
				thai: ["Noto Sans Thai", "sans-serif"],
				playfair: ["Playfair Display", "serif"],
			},
		},
	},
	plugins: [require("daisyui")],
};
