let a = 0;
let b = 0;
let m = -1;
let y;
let facing = -1;
let bfacing = 1;
let to = 1;
let bspeed = 1;
let target = window.innerWidth;

const CRAWL = 1;
const WALK = 2;
const RUN = 5;
const WARP = 50;

const STEP = window.innerWidth * 0.05;
const LEAP = window.innerWidth * 0.2;

let t = ['A', 'START', 'END'];
let r = ['MEET', 'JUST SHORT', 'JUST PAST', 'A DISTANCE FROM', 'A DISTANCE PAST', 'COMPLETELY'];
let v = {
  // Differentiate when this is possible
  'APPROACH': () => { return WALK },
  'WITHDRAW': () => { return -WALK },
  'CRAWL': () => { return CRAWL },
  'RECEDE': () => { return -CRAWL },
  'RUSH': () => { return RUN },
  'RETREAT': () => { return -RUN },
  'BACK INTO': () => { return WALK },
  'PULL AWAY': () => { return -WALK },
  'ATTACK': () => { return LEAP },
  'BOLT': () => { return -LEAP },
  'STEP UP': () => { return STEP },
  'STEP BACK': () => { return -STEP },
  //
  'ENGULF': () => {
    target = bfacing > 0 ? width : 0;
    return WARP * (bfacing > 0 ? 1 : -1 );
  },
  'VANISH': () => {
    target = bfacing < 0 ? width : 0;
    return WARP * (bfacing < 0 ? 1 : -1 );
  },
  'STAY': () => {
    target = b;
    return 0 },
  'TURN AROUND': () => {
    bfacing *= -1;
    target = b;
    return 0;
  },
  'CONTINUE': (s) => {
    target = b + (LEAP * (bspeed > 0 ? 1 : -1));
    return bspeed;
  },
};

let move;

/*
This does not account for relative relationships.
When I want to be further back than I was.
Or closer than I was.
Nor does it allow for overlapping moves (e.g. following)
And what happens when we run out of canvas?
*/

let moves = [{
    v: 'ENGULF'
  },
  {
    v: 'VANISH'
  },
  {
    t: 'A',
    r: 'MEET',
    v: 'APPROACH'
  },
  {
    v: 'CONTINUE'
  },
  {
    v: 'TURN AROUND'
  },
  {
    v: 'STAY'
  },
  {
    t : 'A',
    r : 'A DISTANCE PAST',
    v : 'APPROACH'
  },
  {
    t : 'A',
    r : 'JUST SHORT',
    v: 'BACK INTO'
  },
  {
    t: 'START',
    r: 'COMPLETELY',
    v: 'WITHDRAW'
  },
];


function setup() {
  pixelDensity(1);
  createCanvas(windowWidth, windowHeight);
  noStroke();

  y = height / 2;
}

function draw() {
  background(255);

  // Get next distance


  // Move the boundary, IF we've started
  if (m >= 0) {
    if (hasNotArrived()) {
      console.log("MOVING AT: ", bspeed);
      b += bspeed;
    }
    // Arrive at target!
    else b = target;
  }
  //console.log("X", x);

  // Draw everything
  noStroke();
  fill(220);


  // Flip the facing of b
  if (bfacing > 0) rect(0, 0, b, height);
  else rect(b, 0, width - b, height);

  fill(0);
  ellipse(a, y, 10, 10);
  stroke(0);
  line(a, y, a + facing * 10, y);

}

function hasNotArrived() {

  // Has arrived
  if (target == b || b < 0 || b > width) return false;
  // Approaching from either right or left
  else return abs(target - b) >= abs(bspeed);
}

// INTERACTIVE ELEMENTS
function mousePressed() {
  a = mouseX;
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
      a += 10;
      hasMoved = true;
      break;
    case DOWN_ARROW:
      a -= 10;
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

  if (hasMoved) {
    a = constrain(a, 0, width);
    if (move && move.target == 'A') target = a;
    console.log('A', a, 'Target', target);
  }


  switch (key) {
    case 'm':
      m++;
      m %= moves.length;

      move = moves[m];
      console.log("MOVE: ", move.v, move.r, move.t);

      switch (move.t) {
        case 'A':
          target = a;
          break;
        case 'START':
          target = 0;
          break;
        case 'END':
          target = width;
          break;
      }

      console.log("REL POS", b, target);

      // Which way is towards the target?
      to = b <= target ? 1 : -1;


      // +to is towards A
      // -to is away from A
      bspeed = v[move.v]() * to;
      updateTarget();

      console.log("A", a, "B", b, "TO", to, "SPEED", bspeed, "TARGET", target);

      //console.log('MOVE: ', m, move.velocity + ' ' + move.target, to, bspeed);
      break;
  }




}

function updateTarget() {
  // Am I stopping to the left or right of the target?

  let side = b <= target ? 1 : -1;
  let c = 0;

  switch (move.r) {
    case 'JUST SHORT':
      c = STEP * -side;
      break;
    case 'JUST PAST':
      c = STEP * side;
      break;
    case 'A DISTANCE FROM':
      c = LEAP * -side;
      break;
    case 'A DISTANCE PAST':
      c = LEAP * side;
      break;
    case 'COMPLETELY':
      // going left
      console.log("TO", to);
      c = bspeed > 0 ? width - target : -target;
      break;
  }


  console.log("TARGET", target, "C", c, "SIDE", side);
  target += c;
}
