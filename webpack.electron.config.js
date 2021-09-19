const path = require('path');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { production } = require('./webpack.values');

module.exports = {
	mode: production ? 'production' : 'development',
	...(!production && { devtool: 'source-map' }),
	entry: './src/electron/electron.ts',
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
				scripts: ['IF not exist build mkdir build', ...production ? [`echo 'use strict'; const bytenode = require('bytenode'); const fs = require('fs'); const v8 = require('v8'); const path = require('path'); v8.setFlagsFromString('--no-lazy'); if (fs.existsSync(path.join(__dirname, './electron.js'))) { bytenode.compileFile(path.join(__dirname, './electron.js'), path.join(__dirname, './electron.jsc')); fs.unlinkSync(path.join(__dirname, './electron.js')); } process.exit(); > build/compile.js`, `electron build/compile.js && del build\\compile.js`, `echo require('bytenode'); require('./electron.jsc'); > build/main.js`] : [`echo require('./electron.js'); > build/main.js`]],
				blocking: true,
				parallel: false
			}
		}),
		new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ['**/*', '!electron.js', ...(production ? [] : ['!electron.js.map'])] }),
	],
	...(production && { optimization: require('./webpack.values').optimization })
};