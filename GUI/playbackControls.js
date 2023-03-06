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