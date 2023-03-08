document.getElementById('playback-prev').addEventListener('click', () => {
  window.main.playback('prev');
});

document.getElementById('playback-play').addEventListener('click', () => {
  window.main.playback('play');
});

document.getElementById('playback-pause').addEventListener('click', () => {
  window.main.playback('pause');
});

document.getElementById('playback-next').addEventListener('click', () => {
  window.main.playback('next');
});

const updatePlaybackInfo = async () => {
  const res = await window.main.spotifyRequest(
    'GET',
    'https://api.spotify.com/v1/me/player'
  );
  
  const { progress_ms, item } = res;

  document.getElementById('playback-title').textContent = item.name;
  document.getElementById('playback-artist').textContent = item.artists[0].name;
  document.getElementById('playback-album').textContent = item.album.name;
  document.getElementById('playback-progress').textContent = 
    `${Math.round(progress_ms / 1000)} s / ${Math.round(item.duration_ms / 1000)} s`;
}
updatePlaybackInfo();

// periodically update playback info
window.setInterval(updatePlaybackInfo, 2000);