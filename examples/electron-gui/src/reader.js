// this script should be "defer"ed

const remote = require('@electron/remote')
const fs = require('fs');

const [WINDOW_WIDTH, WINDOW_HEIGHT] = remote.getCurrentWindow().getSize();
const [CAM_WIDTH, CAM_HEIGHT] = [640, 480];

console.log(WINDOW_WIDTH, WINDOW_HEIGHT);

const TICK_RATE_HZ = 30;
window.setInterval(readData, 1000 / TICK_RATE_HZ);

let cursorElt = document.createElement("div");
cursorElt.id = "cursor";
document.body.appendChild(cursorElt);

let outputElt = document.getElementById("output");

function readData() {
    let data = fs.readFileSync('../../test.txt', 'utf8').trim();
    if (!data) return;

    pointMap = new Map();
    
    output = ""
    for (let point of data.matchAll(/\[(.*?)\]/g)) {
        let items = point[1].split(',').map(s => s.trim());
        let [landmark, x, y] = items.map(s => parseInt(s));
        
        pointMap[landmark] = { x, y };

        output += `Landmark: ${landmark}`  + '<br />';
        output += `x: ${x}`  + '<br />';
        output += `y: ${y}`  + '<br />';
        output += '<br />';
    }

    let {x, y} = pointMap[8]; // tip of index finger

    cursorElt.style.left = `${WINDOW_WIDTH * (x / CAM_WIDTH)}px`;
    cursorElt.style.top = `${WINDOW_HEIGHT * (y / CAM_HEIGHT)}px`;

    outputElt.innerHTML = output;
}