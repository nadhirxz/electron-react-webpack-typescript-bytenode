require('dotenv').config();
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { production } = require('./webpack.values');

module.exports = {
	mode: production ? 'production' : 'development',
	...(!production && { devtool: 'source-map' }),
	entry: './src/react/index.tsx',
	target: 'electron-renderer',
	output: {
		path: path.join(__dirname, '/build/react'),
		filename: 'bundle.js'
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: __dirname + '/src/react/index.html',
			filename: 'index.html',
			inject: 'body'
		})
	],
	devServer: {
		static: {
			directory: path.join(__dirname, 'build/react'),
		},
		compress: true,
		port: process.env.PORT
	},
	resolve: {
		alias: {
			['@']: path.resolve(__dirname, 'src')
		},
		extensions: ['.tsx', '.ts', '.js'],
	},
	module: {
		rules: [
			{
				test: /\.ts(x?)$/,
				include: /src/,
				use: [{ loader: 'ts-loader' }]
			}
		]
	},
	...(production && { optimization: require('./webpack.values').optimization })
};