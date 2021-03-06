import { app, BrowserWindow } from 'electron';
import isDev from 'electron-is-dev';
import dotenv from 'dotenv';

dotenv.config();

const createWindow = () => {
	let win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		}
	});
	win.on('closed', () => app.quit());
	win.loadURL(isDev ? `http://localhost:${process.env.PORT || 3000}` : `file://${__dirname}/react/index.html`);
}

app.on('ready', createWindow);
