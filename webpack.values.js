const TerserPlugin = require('terser-webpack-plugin');

const optimization = {
	minimize: true,
	minimizer: [
		new TerserPlugin({
			parallel: true,
			extractComments: false,
			terserOptions: {
				output: { comments: false }
			}
		}),
	],
}

const production = process.env.NODE_ENV == 'production';

module.exports = { optimization, production };