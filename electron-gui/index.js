const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { SpotifyManager } = require('./spotify')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      sandbox: false, // so preload.js can access other files
    },
  });
  win.maximize();

  win.webContents.openDevTools();

  const spotifyManager = new SpotifyManager();
  spotifyManager.authorize();
  
  ipcMain.handle('playback', (_event, control) => {
    switch (control) {
      case 'prev':
        spotifyManager.request('POST', 'https://api.spotify.com/v1/me/player/previous');
        break;
      case 'play':
        spotifyManager.request('PUT', 'https://api.spotify.com/v1/me/player/play');
        break;
      case 'pause':
        spotifyManager.request('PUT', 'https://api.spotify.com/v1/me/player/pause');
        break;
      case 'next':
        spotifyManager.request('POST', 'https://api.spotify.com/v1/me/player/next');
        break;
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
});