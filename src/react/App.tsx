import { hot } from 'react-hot-loader/root';
import React from 'react';

const App: React.FC = () => {
	return (
		<div>
			This is React running in Electron App
		</div>
	)
}

export default hot(App);