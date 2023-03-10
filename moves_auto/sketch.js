let a = 0;
let b = 0;
let m = -1;
let y;
let facing = -1;
let to = 1;
let bspeed = 1;
let target;

let targets = ['A', 'START', 'END'];
let relationship = ['MEET', 'STOP SHORT', 'JUST PAST', 'A DISTANCE FROM', 'A DISTANCE PAST'];
let velocities = ['CRAWL TO', 'RECEDE FROM', 'RUSH TO', 'VANISH', 'APPROACH', 'BACK AWAY', 'STAY'];


const CRAWL = 1;
const WALK = 2;
const TELEPORT = 100;

let move;

/*
This does not account for relative relationships.
When I want to be further back than I was.
Or closer than I was.
Nor does it allow for overlapping moves (e.g. following)
And what happens when we run out of canvas?
*/

let moves = [{
    target: 'A',
    relationship: 'MEET',
    velocity: 'APPROACH'
  },
  {
    target: 'A',
    relationship: 'JUST PAST',
    velocity: 'APPROACH'
  },
  {
    velocity: 'STAY'
  },
  {
    target: 'A',
    relationship: 'A DISTANCE FROM',
    velocity: 'BACK AWAY'
  },
  {
    target: 'A',
    relationship: 'A DISTANCE FROM',
    velocity: 'CRAWL TO'
  },
  {
    target: 'A',
    relationship: 'A DISTANCE FROM',
    velocity: 'CRAWL TO'
  },
  {
    target: 'A',
    relationship: 'A DISTANCE FROM',
    velocity: 'BACK AWAY'
  },
];




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

  let hasMoved = false;

  switch (keyCode) {
    case RIGHT_ARROW:
      facing = 1;
      break;
    case LEFT_ARROW:
      facing = -1;
      break;
    case UP_ARROW:
      console.log("UP");
      a+=10;
      hasMoved = true;
      break;
    case DOWN_ARROW:
      a-=10;
      hasMoved = true;
      break;
    case ENTER:
      fullscreen(true);
      break;
    case ESCAPE:
      fullscreen(false);
      break;
    case SHIFT:
      location.reload();
      break;
  }

  if(hasMoved) {
    a = constrain(a, 0, width);
    if(move && move.target == 'A') target = a;
    console.log('A', a, 'Target', target);
  }


  switch (key) {
    case 'm':
      m++;
      m %= moves.length;

      move = moves[m];
      console.log("MOVE: ", move.velocity, move.relationship, move.target);

      // Calculate direction is 'TO'
      // Was I going right or left? (+/-)
      if (b == a) to = -bspeed / abs(bspeed);
      // Go right to A or left to A
      else to = b < a ? 1 : -1;

      // +to is towards A
      // -to is away from A

      switch (move.velocity) {
        case 'CRAWL TO':
          bspeed = CRAWL * to;
          break;
        case 'RECEDE FROM':
          bspeed = CRAWL * -to;
          break;
        case 'RUSH TO':
          bspeed = TELEPORT * to;
          break;
        case 'VANISH':
          bspeed = TELEPORT * -to;
          break;
        case 'APPROACH':
          bspeed = WALK * to;
          break;
        case 'BACK AWAY':
          bspeed = WALK * -to;
          break;
        case 'STAY':
          bspeed = 0;
          move.target = 'B';
          move.relationship = 'MEET';
          break;
      }
      console.log("TO", a, b, bspeed, target);
      updateTarget(move.relationship, move.target);

      //console.log('MOVE: ', m, move.velocity + ' ' + move.target, to, bspeed);
      break;
  }




}

function mousePressed() {
  a = mouseX;
}

function draw() {
  background(255);

  // Get next distance


  // Move the boundary, IF we've started
  if (m >= 0) {
    if (hasNotArrived()) {
      //console.log("MOVING!");
      b += bspeed;
    }
    // Arrive at target!
    else b = target;
  }
  //console.log("X", x);

  // Draw everything
  noStroke();
  fill(220);
  rect(0, 0, b, height);

  fill(0);
  ellipse(a, y, 10, 10);
  stroke(0);
  line(a, y, a + facing * 10, y);

}

function hasNotArrived() {

  // Has arrived
  if (target == b) return false;
  // Approaching from either right or left
  else return abs(target - b) > abs(bspeed);
}

function updateTarget(r, t) {
  switch (t) {
    case 'A':
      target = a;
      break;
    case 'B':
      target = b;
      break;
    case 'END':
      bspeed < 0 ? 0 : width;
      break;
  }
  console.log('B', b, 'TARGET', target, 'A', a);
  // Am I stopping to the left or right of the target?
  let side = b < target ? 1 : -1;

  switch (r) {
    case 'MEET':
      c = 0;
      break;
    case 'STOP SHORT':
      c = 5 * -side;
      break;
    case 'JUST PAST':
      c = 5 * side;
      break;
    case 'A DISTANCE FROM':
      c = width * 0.2 * -side;
      break;
    case 'A DISTANCE PAST':
      c = width * 0.2 * side;
      break;
  }


  console.log("TARGET", target);
  target += c;
  console.log("TARGET + C", target);

}
