/**
 * Initalizes the dropdown menu event listeners
 */
function initDropdown() {
  let navButton = document.querySelector(".menuToggle");
  let nav = document.querySelector(".navigation");
  navButton.addEventListener("click", () => {
    nav.classList.toggle("active");
  });
}

document.getElementById('menu-music').addEventListener('click', () => {
  window.main.loadPage('music.html');
});

document.getElementById('menu-weather').addEventListener('click', () => {
  window.main.loadPage('index.html');
});

document.getElementById('menu-time-zone').addEventListener('click', () => {
  window.main.loadPage('time-zone.html');
});

document.getElementById('menu-help').addEventListener('click', () => {
  window.main.loadPage('help.html');
});

initDropdown();
