require('dotenv').config();
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
	template: __dirname + '/src/index.html',
	filename: 'index.html',
	inject: 'body'
});
const CreateFileWebpack = require('create-file-webpack');

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
			path: __dirname + '/build',
			filename: 'electron.js'
		},
		plugins: [
			new CreateFileWebpack({
				path: './build',
				fileName: 'main.js',
				content: `'use strict'; const bytenode = require('bytenode'); const fs = require('fs'); const v8 = require('v8'); const path = require('path'); v8.setFlagsFromString('--no-lazy'); if (fs.existsSync(path.join(__dirname, './electron.js'))) bytenode.compileFile(path.join(__dirname, './electron.js'), path.join(__dirname, './electron.jsc')); require('./electron.jsc');`
			})
		]
	},
	{
		mode: 'development',
		entry: './src/index.tsx',
		target: 'electron-renderer',
		output: {
			path: __dirname + '/build/react',
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