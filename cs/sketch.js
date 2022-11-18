let distances = [];
let off;
let d = 0;
let x = 0;
let xspeed = 1;
let target = 0;
const INTERVAL = 120;
const STARTFRAME = 10;
const FRAMERATE = 30;

// Visualization
let record;
let y = 0;

let cnv;

function preload() {
  loadJSON('../yg.json', calcDistances);
}

// This is where your code goes
function calcDistances(data) {
  distances = data;
}

function setup() {
  pixelDensity(1);
  createCanvas(windowWidth, windowHeight);
  record = createGraphics(width, distances.length * INTERVAL);
  record.background(255);
  calcOff();
  noStroke();
  frameRate(FRAMERATE);
}

function draw() {
  background(255);

  // Get next distance
  if (frameCount % INTERVAL == STARTFRAME) {
    d++;
    if(d >= distances.length-1) saveSequence();
    //d %= distances.length;
    calcOff();
  }

  // Move the boundary
  x += xspeed;
  //console.log("X", x);

  // Draw everything
  fill(128);
  rect(0, 0, x, height);
  fill(0);
  ellipse(mouseX, mouseY, 5, 5);

  record.stroke(128);
  record.line(0, y, x, y);
  record.stroke(0);
  record.point(mouseX, y);
  y++;
}

function saveSequence() {
//  if(keyCode == ENTER) {
    console.log(record.width, record.height);
    let cnv = createCanvas(record.width, record.height);
    background('red');
    image(record, 0, 0);
    saveCanvas(cnv, 'cs-' + millis(), 'jpg');
    noLoop();

    // setTimeout(function(){
    // }, 100);
//  }
}

// Helper function to setup next move
function calcOff() {
  off = distances[d] * width;
  target = (mouseX) - off;
  xspeed = (target - x) / INTERVAL;

  console.log(off, target, xspeed);
}
