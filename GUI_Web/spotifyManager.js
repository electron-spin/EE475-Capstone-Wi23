"use strict"

const axios = require('axios').default; // for http requests
const spotify_credentials = require('./spotify_credentials.json');

const SCOPE = [
  'user-read-private user-read-email',
  'user-read-playback-state',
  'user-modify-playback-state'
].join(' ');
const STATE = 'demo';

class SpotifyManager {
  spotifyState = null;
  authorized = false;

  accessToken = null;
  refreshToken = null;
  expiresIn = null;

  constructor(app, port) {
    this.app = app;
    this.port = port;
    this.REDIRECT_URI = `http://localhost:${port}/callback`;

    this.CLIENT_ID = spotify_credentials.client_id;
    this.CLIENT_SECRET = spotify_credentials.client_secret;
    this.AUTH_STRING = 'Basic ' + Buffer.from(this.CLIENT_ID + ':' + this.CLIENT_SECRET).toString('base64');
  }

  async initRequestHandlers() {
    /**
     * Endpoint: /auth
     * Type: GET
     * Return format: redirect
     * Redirects to Spotify authorization URL, which will then redirect back
     * here when authorized.
     */
    this.app.get('/auth', (req, res) => {      
      const params = new URLSearchParams({
        response_type: 'code',
        client_id: this.CLIENT_ID,
        scope: SCOPE,
        redirect_uri: this.REDIRECT_URI,
        state: STATE,
      });
      
      // your application requests authorization
      res.redirect('https://accounts.spotify.com/authorize?' + params);
    });

    /**
     * Endpoint: /callback
     * Type: GET
     * Return format: redirect
     * Invoked by Spotify authorization. Access and refresh tokens are returned
     * through URL params.
     * Make sure http://localhost:{port}/callback is entered as valid
     * on the developer account.
     */
    this.app.get('/callback', async (req, res) => {
      
      // your application requests refresh and access tokens
      // after checking the state parameter
      const code = req.query.code || null;
      const reqState = req.query.state || null;
      
      if (code === null || reqState !== STATE) {
        res.redirect('/#' +
          (new URLSearchParams({
            error: 'state_mismatch'
          })
        ));
        return;
      }
      
      // ask for tokens
      const authData = {
        code: code,
        redirect_uri: this.REDIRECT_URI,
        grant_type: 'authorization_code'
      };
      const authConfig = {
        headers: {
          'Authorization': this.AUTH_STRING,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        json: true
      };
      
      let tokenRes;
      try {
        tokenRes = await axios.post('https://accounts.spotify.com/api/token', authData, authConfig);
      } catch (error) {
        res.status(tokenRes.status).send(tokenRes);
        return;
      }
      const tokenData = tokenRes.data;

      this.authorized = true;
      this.accessToken = tokenData.access_token,
      this.refreshToken = tokenData.refresh_token,
      this.expiresIn = tokenData.expires_in,
      
      res.redirect('/');
    });

    /**
     * Endpoint: /spotifyToken
     * Type: GET
     * Return format: json
     * Returns valid Spotify token data, or an error.
     */
    this.app.get('/spotifyToken', async (req, res) => {
      if (!this.authorized) {
        // not yet authorized
        res.status(401).send("User is not yet authorized. Send GET request to /auth.");
        return;
      }

      // test token validity
      try {
        await axios.get(
          'https://api.spotify.com/v1/me',
          {
            headers: {
              'Authorization': 'Bearer ' + access_token,
              'Content-Type': 'application/json',
            }
          }
        );
      } catch (error) {
        // invalid token, get a new one
        await this.newToken();
      }

      res.status(200).send({
        'access_token': this.accessToken,
        'refresh_token': this.refreshToken,
        'expires_in': this.expiresIn,
      });
    });
  }

  /**
   * Uses the current refresh token to get a new access token (and maybe a new
   * refresh token). Will throw error if token refresh failed.
   */
  async newToken() {
    const data = {
      refresh_token: this.refreshToken,
      grant_type: 'refresh_token',
    };
    const config = {
      headers: {
        'Authorization': this.AUTH_STRING,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      json: true
    };
    
    const refreshData = (await axios.post('https://accounts.spotify.com/api/token', data, config)).data;

    this.accessToken = refreshData.access_token;
    this.refreshToken = refreshData.refresh_token || this.refreshToken;
    this.expiresIn = refreshData.expires_in;
  }
}

module.exports = { SpotifyManager };