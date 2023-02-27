/*
 * Initializes Spotify API and sends requests.
 */

/**
 * Main entry point for Spotify code.
 */
async function main() {
  // authorize if not already, then get tokens
  let { accessToken } = await getSpotifyTokens();
  if (!accessToken) {
    window.location.href = '/auth'; // should redirect automatically
    return; // unnecessary but might as well
  }

  let testRes = await fetch(
    'https://api.spotify.com/v1/me',
    {
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json',
      }
    }
  );

  console.log(await testRes.json());
}

/**
 * Gets Spotify API token data from backend.
 * 
 * @returns {object} { accessToken, refreshToken, tokenExpiresIn }
 */
async function getSpotifyTokens() {
  let tokenRes = await fetch('/spotifyToken', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (tokenRes.status != 200) {
    return {};
  }

  let tokenData = await tokenRes.json();
  return {
    accessToken: tokenData['access_token'],
    refreshToken: tokenData['refresh_token'],
    tokenExpiresIn: tokenData['expires_in'],
  };
}

// execute main code
main();