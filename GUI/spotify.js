const { BrowserWindow } = require('electron');
const http = require('http');
const spotify_credentials = require('./spotify_credentials.json');

// Spotify request constants

const SCOPE = [
  'user-read-private user-read-email',
  'user-read-playback-state',
  'user-modify-playback-state'
].join(' ');
const STATE = 'demo'; // any string, just to verify auth response is correct
const REDIRECT_URI = 'http://localhost:8000/callback';
const CLIENT_AUTH_STRING = 'Basic '
  + Buffer.from(
    spotify_credentials.client_id + ':' + spotify_credentials.client_secret
  ).toString('base64');

/**
 * Keeps track of Spotify authorization data and has wrappers for
 * Spotify API requests. Wait for `authorize()` to complete before
 * making any requests.
 */
class SpotifyManager {
  accessToken = null;
  refreshToken = null;
  expiresIn = null;
  isAuthorized = false;

  constructor() {}

  /**
   * Open new window for Spotify authorization and close when authorized.
   */
  authorize = async () => {
    let authWindow = new BrowserWindow({
      width: 800,
      height: 600,
      show: false,
      'node-integration': false,
      'web-security': false
    });
  
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: spotify_credentials.client_id,
      scope: SCOPE,
      redirect_uri: REDIRECT_URI,
      state: STATE,
    });
  
    // Spotify url that redirects to REDIRECT_URI with auth code in the url
    let authUrl = 'https://accounts.spotify.com/authorize?' + params;
  
    // so we don't repeat requests, which happens maybe?
    let gotRequest = false;
    let server = http.createServer();
    // await this promise to get tokens
    const authPromise = new Promise((resolve, reject) => {
      server.on('request', async (req, res) => {
        if (!gotRequest && req.url.includes('/callback')) {
          let q = new URLSearchParams(req.url.split('?')[1]);
          gotRequest = true;
          try {
            let tokenData = await getTokenData(q.get('code'));
            resolve(tokenData);
          } catch {
            console.error('error getting tokens');
            reject();
          }
        }
        res.writeHead(200).end();
      })
    })
  
    // start server to catch Spotify redirect
    server.listen(8000, 'localhost');
  
    authWindow.show();
    // loading screen
    await authWindow.loadFile('./renderer/loading.html');
    // don't await this because the redirect messes it up, just await
    // authPromise
    authWindow.loadURL(authUrl);
  
    // wait for token data from authorization flow
    const tokenData = await authPromise;

    // clean up when done
    authWindow.close();
    server.closeAllConnections();

    this.accessToken = tokenData.access_token;
    this.refreshToken = tokenData.refresh_token;
    this.expiresIn = tokenData.expires_in;
    this.isAuthorized = true;
  }

  /**
   * Sends a request to the Spotify API and returns data.
   * @param {'GET' | 'PUT' | 'POST'} method HTTP request method.
   * @param {string} url request url.
   * @param {any} body optional: data for request.
   * @returns data from request, or null if error.
   */
  request = async (method, url, body = undefined) => {
    if (!this.isAuthorized) {
      console.error('Not authorized yet.');
      return null;
    }

    for (let attempted = false; !attempted; attempted = true) {
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': 'Bearer ' + this.accessToken,
          'Content-Type': 'application/json'
        },
        body: body && new URLSearchParams(body),
      });

      // if expired token, refresh and try once more
      if (response.status === 401 && !attempted) {
        if (await this.refresh())
          continue;
      }
  
      if (response.status !== 200)
        return null;

      return await response.json();
    }
  }

  /**
   * Uses current refresh token to request a new access token. Updates
   * accessToken and sometimes refreshToken fields.
   * @returns true iff token was successfully refreshed.
   */
  refresh = async () => {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': CLIENT_AUTH_STRING,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: this.refreshToken
      })
    });

    if (response.status !== 200)
      return false;

    const { access_token, refresh_token } = response;
    this.accessToken = access_token;
    if (refresh_token)
      this.refreshToken = refresh_token;
    return true;
  }
}

/**
 * Helper function for authorization. Sends request for tokens.
 * @param {string} code Authorization code returned from Spotify redirect.
 * @returns access token, refresh token, and expiration in seconds.
 */
async function getTokenData(code) {    
  const tokenRes = await fetch(
    'https://accounts.spotify.com/api/token',
    {
      method: 'POST',
      headers: {
        'Authorization': CLIENT_AUTH_STRING,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code: code,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code'
      })
    }
  );
  if (tokenRes.status != 200) {
    throw new Error(`Failed to get tokens - received status ${tokenRes.status}`);
  }
  const tokenData = await tokenRes.json();
  return tokenData;
}

module.exports = { SpotifyManager };
