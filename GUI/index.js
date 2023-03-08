const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { SpotifyManager } = require('./spotify')
const fs = require('fs');

const createWindow = async () => {
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

  const spotifyManager = new SpotifyManager();
  await spotifyManager.authorize();

  // transfer playback to jetson
  const devicesResponse = await spotifyManager.request(
    'GET', 'https://api.spotify.com/v1/me/player/devices'
  );
  const jetsonDevice = devicesResponse
    && devicesResponse.devices.find(d => d.name === 'jetson_spotifyd');
  if (jetsonDevice) {
    await spotifyManager.request(
      'PUT', 'https://api.spotify.com/v1/me/player',
      {
        device_ids: [ jetsonDevice.id ]
      }
    );
  }
  
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

  ipcMain.handle('loadPage', async (_event, pagePath) => {
    await win.loadFile('renderer/' + pagePath);
  });

  ipcMain.handle('readFile', () => {
    return fs.readFileSync("../SharedMem.txt", "utf8");
  })

  ipcMain.handle('spotifyRequest', async (_e, method, url, body) => {
    return await spotifyManager.request(method, url, body);
  })

  win.loadFile('renderer/index.html');
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
