require('dotenv').config();
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
	template: __dirname + '/src/index.html',
	filename: 'index.html',
	inject: 'body'
});

const optimization = {
	minimize: true,
	minimizer: [
		new TerserPlugin({
			extractComments: false,
		}),
	],
}

const production = process.env.NODE_ENV == 'production';
const compile = `'use strict'; const bytenode = require('bytenode'); const fs = require('fs'); const v8 = require('v8'); const path = require('path'); v8.setFlagsFromString('--no-lazy'); if (fs.existsSync(path.join(__dirname, './electron.js'))) { bytenode.compileFile(path.join(__dirname, './electron.js'), path.join(__dirname, './electron.jsc'));${production && ` fs.unlinkSync(path.join(__dirname, './electron.js'));`} }`

module.exports = [
	{
		mode: production ? 'production' : 'development',
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
			new WebpackShellPluginNext({
				onBuildEnd: {
					scripts: ['IF not exist build mkdir build', ...production ? [`echo ${compile} process.exit(); > build/compile.js`, `electron build/compile.js && del build\\compile.js`, `echo require('bytenode'); require('./electron.jsc'); > build/main.js`] : [`echo ${compile} require('./electron.jsc'); > build/main.js`]],
					blocking: true,
					parallel: false
				}
			}),
			new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ['**/*', '!electron.js'] }),
		],
		optimization
	},
	{
		mode: production ? 'production' : 'development',
		...(!production && { devtool: 'source-map' }),
		entry: './src/index.tsx',
		target: 'electron-renderer',
		output: {
			path: path.join(__dirname, '/build/react'),
			filename: 'bundle.js'
		},
		plugins: [HTMLWebpackPluginConfig],
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
		},
		optimization
	}
];