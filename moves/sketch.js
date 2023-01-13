
let a = 0;
let b = 0;
let m = -1;
let y;
let facing = -1;
let to = 1;
let bspeed = 1;
let target;

let targets = ['A', 'END'];
let relationship = ['MEET', 'STOP SHORT', 'JUST PAST', 'A DISTANCE FROM', 'A DISTANCE PAST'];
let velocities = ['CRAWL TO', 'RECEDE FROM', 'RUSH TO', 'VANISH', 'APPROACH', 'BACK AWAY', 'STAY'];


const CRAWL = 1;
const WALK = 2;
const TELEPORT = 100;

let moves = [{
  target: 'A',
  relationship: 'MEET',
  velocity: 'CRAWL TO'
},
{
  target: 'END',
  relationship: 'STOP SHORT',
  velocity: 'RECEDE FROM'
},
{
  target: 'A',
  relationship: 'A DISTANCE FROM',
  velocity: 'APPROACH'
}
];




// function preload() {
//   loadJSON('../yg.json', calcDistances);
// }

function setup() {
  pixelDensity(1);
  createCanvas(windowWidth, windowHeight);
  noStroke();

  y = height/2;
}

function keyPressed() {
  console.log("POSITIONS", a, b);

  switch (keyCode) {
    case RIGHT_ARROW:
      facing = 1;
      break;
    case LEFT_ARROW:
      facing = -1;
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


  switch (key) {
    case 'm':
      m++;
      m%=moves.length;

      let move = moves[m];
      console.log("MOVE: ", move.velocity, move.relationship, move.target);

      // Calculate direction is 'TO'
      if (b == a) to = -bspeed/abs(bspeed);
      else to = b < a ? 1 : -1;


      switch (move.velocity) {
        case 'CRAWL TO':
          bspeed = CRAWL * to;
          break;
        case 'RECEDE FROM':
          bspeed = CRAWL * to;
          break;
        case 'RUSH TO':
          bspeed = TELEPORT * to;
          break;
        case 'VANISH':
          bspeed = TELEPORT * to;
          break;
        case 'APPROACH':
          bspeed = WALK * to;
          break;
        case 'BACK AWAY':
          bspeed = WALK * to;
          break;
      }
      updateTarget(move.relationship, move. target);
      console.log("TO", a, b, bspeed, target);

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
    if(hasNotArrived()){
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
  line(a, y, a + facing*10, y);

}

function hasNotArrived() {
  //console.log("TESTING", a - b, c + bspeed);
  // Am I widening or closing the gap
  // 100 - 100 ? 10 - 5
  // 0, 1, 2, 3, 4,
  // Approaching from the right
  if(target == b) return false;
  else if(to < 0) return target - b < bspeed;
  // Approaching from the left
  else return target - b > bspeed;
}

function updateTarget(r, t) {


  switch (t) {
    case 'A':
      target = a;
      break;
    case 'END':
      target = to > 0 ? width : 0;
      break;
  }

  let side = b  > target ? 1 : -1;

  switch (r) {
    case 'MEET':
      c = 0;
      break;
    case 'STOP SHORT':
      c = 5 * side;
      break;
    case 'JUST PAST':
      c = 5 * side;
      break;
    case 'A DISTANCE FROM':
      c = width * 0.2 * side;
      break;
    case 'A DISTANCE PAST':
      c = width * 0.2 * side;
      break;
  }


  console.log("TARGET", target);
  target+=c;
  console.log("TARGET + C", target);

}
