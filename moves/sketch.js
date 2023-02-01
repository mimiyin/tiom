let a = 0;
let b = 0;
let m = -1;
let y;
let facing = -1;
let to = 1;
let bspeed = 1;
let bdir = 1;

let go = false;

const SPEEDS = [1, 10, 100];




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
      bspeed = 1;
      break;
    case '2':
      bspeed = 10;
      break;
    case '3':
      bspeed = 100;
      break;

  }

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
        a+=2;
        break;
      case DOWN_ARROW:
        a-=2;
        break;
      case RIGHT_ARROW:
        a++;
        break;
      case LEFT_ARROW:
        a--;
        break;
      }
  }

  // Draw everything
  noStroke();
  fill(220);
  rect(0, 0, b, height);

  fill(0);
  ellipse(a, y, 10, 10);
  stroke(0);
  line(a, y, a + facing * 10, y);

}
