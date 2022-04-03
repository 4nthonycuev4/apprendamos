/** @format */

module.exports = {
	future: {
		removeDeprecatedGapUtilities: true,
		purgeLayersByDefault: true,
	},
	content: ["./pages/**/*.{js, jsx}", "./components/**/*.{js,jsx}"],
	theme: {
		fontFamily: {
			sans: ["Inter", "sans-serif"],
			serif: ["Merriweather", "serif"],
		},
		extend: {},
	},
	variants: {},
	plugins: [],
};
