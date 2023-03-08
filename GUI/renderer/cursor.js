const PINCH_THRESHOLD = 25;
const HAND_POSITION_GAIN = 1.25;

let cursorState = [0, 0, false];
let lastClicked = false;
let hovered = [];

async function init() {
  /**
   * Updated every 33 milliseconds (~30fps):
   * - Hand Position
   */
  setInterval(() => {
    updateCursorPosition();
    setCursor();
    checkClick();
  }, 33);
}
window.addEventListener("load", init);

/**
 * Sets the cursor position on the web page to the current cursor position.
 * When the hand is not pinched, the cursor is a yellow circle.
 * When the hand is pinched, the cursor is a red circle.
 */
function setCursor() {
  let cursorElement = document.getElementById("cursor");
  cursorElement.style.left = cursorState[0] + "%";
  cursorElement.style.top = cursorState[1] + "%";

  if (cursorState[2]) {
    cursorElement.classList.add("pinched");
    cursorElement.classList.remove("unpinched");
  } else {
    cursorElement.classList.add("unpinched");
    cursorElement.classList.remove("pinched");
  }
}

/**
 * Updates the cursor position state according to values in a text file.
 * Also updated the pinched state.
 */
async function updateCursorPosition() {
  let fileContents = await window.main.readFile();
  try {
    cursorState = processFileContents(fileContents);
  } catch (err) {
    console.error("Error: " + err);
  }
}

/**
 * Checks if the cursor is over a clickable element and pinched at the same time.
 * If so, it will click it.
 */
function checkClick() {
  let cursorElement = document.getElementById("cursor");
  let coords = cursorElement.getBoundingClientRect();
  let [x, y] = [coords.x, coords.y];

  let elements = document.elementsFromPoint(x, y);

  // remove all hovers
  hovered.forEach(element => element.classList.remove("hover"));
  hovered = [];

  elements.forEach(element => {
    hovered.push(element);
  });

  // add hover to all elements
  hovered.forEach(element => element.classList.add("hover"));

  if (!lastClicked && cursorState[2]) {
    elements.forEach(element => {
      element.click();
    });
    lastClicked = true;
  } else if (lastClicked && !cursorState[2]) {
    lastClicked = false;
  }
  // the position of toggling menu
  // if (x >= 10 && x <= 50 && y >= 0 && y <= 45) {
  //   if (cursorState[2]) {
  //     // send a click to the menu button
  //     document.querySelector(".menuToggle").click();
  //   }
  // }
}

/**
 * Processes the contents of the file and returns the cursor position
 * which is the average position between the thumb and index finger.
 * @param {string} fileContents The contents of the file
 * @returns {Array} An array of 3 values representing the x and y position and the pinch state
 */
function processFileContents(fileContents) {
  let cursorPositions = [0, 0, false];
  let lines = fileContents.split("\n");
  let thumbs = lines[1].split(" ");
  let thumbX = thumbs[0].split("\t")[2].substring(2);
  let thumbY = thumbs[1].substring(2);

  let indexes = lines[2].split(" ");
  let indexX = indexes[0].split("\t")[2].substring(2);
  let indexY = indexes[1].substring(2);

  cursorPositions[0] = (parseInt(thumbX) + parseInt(indexX)) / 2;
  cursorPositions[1] = (parseInt(thumbY) + parseInt(indexY)) / 2;

  // check if the hand is pinched, distance must be
  let pinched =
    Math.sqrt((thumbX - indexX) ** 2 + (thumbY - indexY) ** 2) <
    PINCH_THRESHOLD;

  // convert cursor position to a percentage of the screen
  // cursor position is 690 x 350
  const [winWidth, winHeight] = [window.innerWidth, window.innerHeight];
  cursorPositions = [
    Math.round((cursorPositions[0] * 100) / 690),
    Math.round((cursorPositions[1] * 100) / 350),
    pinched
  ];

  cursorPositions[0] = (cursorPositions[0] - 50) * HAND_POSITION_GAIN + 50;
  cursorPositions[1] = (cursorPositions[1] - 50) * HAND_POSITION_GAIN + 50;

  return cursorPositions;
}
