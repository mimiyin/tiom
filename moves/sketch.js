let a = 0;
let b = 100;
let m = -1;
let y;
let facing = -1;
let to = 1;
let bspeed = -1;
let bdir = 1;

let go = false;

const CRAWL = 1;
const WALK = 5;
const RUN = 20;

// function preload() {
//   loadJSON('../yg.json', calcDistances);
// }

function setup() {
  pixelDensity(1);
  createCanvas(windowWidth, windowHeight);
  noStroke();

  y = height / 2;
}

function keyPressed() {
  console.log("POSITIONS", a, b);

  switch (keyCode) {
    case RETURN:
      facing *= -1;
    case 32:
      go = !go;
      console.log("GO!");
      break;
  }
  console.log(key);

  switch (key) {
    case '`':
      bdir *= -1;
      break;
    case '1':
      pbspeed = bspeed;
      bspeed = CRAWL;
      toggle();
      break;
    case '2':
      pbspeed = bspeed;
      bspeed = WALK;
      toggle();
      break;
    case '3':
      pbspeed = bspeed;
      bspeed = RUN;
      toggle();
      break;
    case '4':
      b = a;
      go = false;
      break;
  }

}

function toggle() {
  if(bspeed == pbspeed || !go) go = !go;
}

function mousePressed() {
  a = mouseX;
}

function draw() {
  background(255);
  if (go) b += bspeed * bdir;

  if(keyIsPressed) {
    switch (keyCode) {
      case UP_ARROW:
        a+=CRAWL;
        break;
      case DOWN_ARROW:
        a-=CRAWL;
        break;
      case RIGHT_ARROW:
        a+=WALK;
        break;
      case LEFT_ARROW:
        a-=WALK;
        break;
      case SHIFT:
        a+=RUN;
        break;
      case '/':
        a-=RUN;
        break;
      }
  }

  // Draw everything
  noStroke();
  fill(220);
  rect(0, 0, b, height);

  stroke('red');
  line(mouseX, 0, mouseX, height);

  // fill(0);
  // ellipse(a, y, 10, 10);
  // stroke(0);
  // line(a, y, a + facing * 10, y);

}
