require('dotenv').config();
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
	template: __dirname + '/src/index.html',
	filename: 'index.html',
	inject: 'body'
});

module.exports = [
	{
		mode: 'development',
		entry: './src/electron.ts',
		target: 'electron-main',
		resolve: {
			alias: {
				['@']: path.resolve(__dirname, 'src')
			},
			extensions: ['.tsx', '.ts', '.js'],
		},
		module: {
			rules: [{
				test: /\.ts$/,
				include: /src/,
				use: [{ loader: 'ts-loader' }]
			}]
		},
		output: {
			path: __dirname + '/dist',
			filename: 'main.js'
		}
	},
	{
		mode: 'development',
		entry: './src/index.tsx',
		target: 'electron-renderer',
		output: {
			path: __dirname + '/dist/react',
			filename: 'bundle.js'
		},
		plugins: [HTMLWebpackPluginConfig],
		devtool: 'source-map',
		devServer: {
			static: {
				directory: path.join(__dirname, 'dist/react'),
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
		}
	}
];