const { app, BrowserWindow } = require('electron');
const path = require('path');
const { SpotifyManager } = require('./spotify')

async function main() {
  const spotifyManager = new SpotifyManager();
  await spotifyManager.authorize();
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      sandbox: false, // so preload.js can access other files
    },
  });

  win.loadFile('index.html');
}

app.whenReady().then(async () => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  main();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
});