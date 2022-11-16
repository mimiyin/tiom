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


function preload() {
  loadJSON('../distances-27119.599999904633.json', calcDistances);
}

// This is where your code goes
function calcDistances(data) {
  distances = data;
}

function setup() {
  pixelDensity(1);
  createCanvas(windowWidth, windowHeight);
  record = createGraphics(width, distances.length * FRAMERATE * INTERVAL);
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
    d %= distances.length;
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

function keyPressed() {
  if(keyCode == ENTER) {
    saveCanvas(record, 'cs-' + millis(), 'jpg');
  }
}

// Helper function to setup next move
function calcOff() {
  off = distances[d] * width;
  target = (mouseX) - off;
  xspeed = (target - x) / INTERVAL;

  console.log(off, target, xspeed);
}
