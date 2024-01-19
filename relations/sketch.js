const FRAMERATE = 10;

let STEPS = {
  STAY: 0,
  A_STEP: 10,
  A_FEW_STEPS: 50,
  A_DISTANCE: 200,
  AT: 0
}

let A = {
  label: 'A',
  pos: undefined,
  dest: undefined,
  speed: STEPS.A_STEP,
  dir: -1,
  face: -1,
  y: undefined,
  arrived: function() {
    return this.pos - this.dest == 0;
  }
}

let B = {
  label: 'B',
  pos: undefined,
  dest: undefined,
  speed: STEPS.A_STEP,
  dir: 1,
  facing: 1,
  go: true,
  faceTo: function(other, facing) {
    return ((other.pos - this.pos) / abs(other.pos - this.pos)) * facing;
  },
  distTo: function(other) {
    return abs(other.pos - this.pos)
  },
  dirTo: function(other, dir) {
    return dirToOther = ((other.pos - this.pos) / abs(other.pos - this.pos)) * dir;
  },
  at: function(other) {
    return other.pos == this.pos;
  },
  arrived: function() {
    return this.pos - this.dest == 0;
  }
}

// Directory of movers
let movers = {
  'A': A,
  'B': B
}

//const TRAJECTORIES = ['STAY', 'MAINTAIN', 'APPROACH', 'DEPART', 'RETREAT', 'BACK INTO', 'PASS', 'BACK PAST'];
const TRAJECTORIES = ['APPROACH', 'RETREAT', 'BACK INTO'];

const EXTENTS = {
  STAY: {
    label: 'STAY',
    relTo: 'B'
  },
  ABS: [{
    label: 'A_STEP',
    relTo: 'B'
  }, {
    label: 'A_FEW_STEPS',
    relTo: 'B'
  }],
  REL_TO_A: [{
    label: 'A_DISTANCE',
    relTo: 'A'
  }, {
    label: 'A_FEW_STEPS',
    relTo: 'A'
  }, {
    label: 'A_STEP',
    relTo: 'A'
  }, {
    label: 'AT',
    relTo: 'A'
  }],
  REL_TO_EDGE: [{
    label: 'A_DISTANCE',
    relTo: 'EDGE'
  }, {
    label: 'A_FEW_STEPS',
    relTo: 'EDGE'
  }, {
    label: 'A_STEP',
    relTo: 'EDGE'
  }, {
    label: 'AT',
    relTo: 'EDGE'
  }],
  shrink: function(dist) {
    let arr = this.REL_TO_A.slice(0);
    if (dist > STEPS.A_FEW_STEPS) return arr.slice(1)
    else if (dist > STEPS.A_STEP) return arr.slice(2)
    else if (dist == STEPS.A_STEP) return arr.slice(3)
    else return []
  },
  expand: function(dist) {
    let arr = this.REL_TO_A.slice(0).reverse(); // AT, A_STEP, A_FEW_STEPS, A_DISTANCE
    if (dist >= STEPS.A_FEW_STEPS) return arr.slice(3) // Go to A_DISTANCE
    else if (dist >= STEPS.A_STEP) return arr.slice(2) // Go to A_FEW_STEPS or A_DISTANCE
    else if (dist >= 0) return arr.slice(1) //
    else return []

  }
}

// Helper function
function snap(pos) {
  return round(pos / 10) * 10;
}

// RETREAT - Facing A, Haven't passed A, Going back into your territory
// Last move was on same side
// TUrn to face A

// RETURN is the opposite - Back to A, Just passed A, Returning to A

// Select TRAHECTORY
// Select FACING
function choose() {

  // Which way am I headed?
  let trajectory = random(TRAJECTORIES);
  let side = 1; // Which side of A or B should I end up?
  let extent;
  let possibilities = [];
  let B2A = B.distTo(A);

  switch (trajectory) {
    case 'STAY': // Stand still
      extent = EXTENTS.STAY;
      break;
    case 'TURN': // Stand still
      B.face = -B.face;
      extent = EXTENTS.STAY;
      break;
    case 'MAINTAIN': // Mirror A
      B.speed = A.speed;
      B.dir = A.dir;
      facing = B.face;
      break;
    case 'APPROACH':
      // Can not approach any more, already arrived
      if (B.at(A)) {
        choose();
        return;
      }
      B.face = B.faceTo(A, 1);
      B.dir = B.dirTo(A, 1);
      //If too close...
      if (B2A < STEPS.A_DISTANCE) possibilities = EXTENTS.shrink(B2A)
      else possibilities = EXTENTS.REL_TO_A.concat(EXTENTS.ABS);
      extent = random(possibilities);
      side = -B.dir;
      break;
    case 'DEPART':
      let pick = random([1, -1]); // Pick a random facing
      B.face = B.faceTo(A, 1) || pick;
      B.dir = B.dirTo(A, -1) || pick; // Go the same way you're facing
      // If too close
      if (B2A < STEPS.A_DISTANCE) possibilities = EXTENTS.expand(B2A) // Need to reverse slice
      else possibilities = EXTENTS.ABS;
      extent = random(possibilities);
      side = B.dir;
      break;
    case 'RETREAT':
      B.face = B.faceTo(A, 1) || B.face; // Stay the same facing
      B.dir = B.dirTo(A, -1) || -B.face; // Go backwards
      if (B2A < STEPS.A_DISTANCE) possibilities = EXTENTS.expand(B2A) // Need to reverse slice
      else possibilities = EXTENTS.ABS;
      extent = random(possibilities);
      side = B.dir;
      break;
    case 'BACK INTO':
      // Can not approach any more, already arrived
      if (B.at(A)) {
        choose();
        return;
      }
      B.face = B.faceTo(A, -1);
      B.dir = B.dirTo(A, 1);
      if (B2A < STEPS.A_DISTANCE) possibilities = EXTENTS.shrink(B2A)
      else possibilities = EXTENTS.ABS.concat(EXTENTS.REL_TO_A);
      extent = random(possibilities);
      side = -B.dir;
      // Next choice?
      break;
    case 'PASS':
      B.face = B.faceTo(A, 1) || B.face // Stay the same facing
      B.dir = B.dirTo(A, 1) || B.face; // Go forward
      possibilities = EXTENTS.REL_TO_A;
      extent = random(possibilities);
      side = B.dir;
      break;
    case 'BACK PAST':
      B.face = B.faceTo(A, -1) || B.face; // Stay the same facing
      B.dir = B.dirTo(A, 1) || B.dir; // Stay the course if @A;
      possibilities = EXTENTS.REL_TO_A;
      extent = random(possibilities);
      side = B.dir;
      break;
    default:
      // Manually trigger next move
      // Deal with Edge for ALL CASES

  }

  if (extent) {
    // Calculate destination
    let target = movers[extent.relTo];
    let dist = STEPS[extent.label];
    side = target.label == 'B' ? B.dir : side;
    B.dest = target.pos + (dist * side);
    B.dest = snap(B.dest);
    console.log(trajectory, target.label, extent.label, 'rel to', extent.relTo, 'from', B.pos, 'to', B.dest,
      'rel', target.pos, 'change', dist, 'side', side);
  } else {
    console.log(trajectory);
  }

}

function setup() {
  pixelDensity(1);
  createCanvas(windowWidth, windowHeight);
  noStroke();

  // Position stuff relative to window
  A.pos = snap(width / 2);
  A.y = height / 2;
  B.pos = snap(width / 4);
  STEPS.A_DISTANCE = floor(width / 3);

  console.log('A: ', A.pos, 'B: ', B.pos);

  // Walk every half second
  frameRate(FRAMERATE);

}


function keyPressed() {
  // Set destination of A
  // Set facing of A
  // Set speed of A
  if (keyCode == '32') {
    choose();
    return;
  }
  switch (key) {
    case 'a':
      A.dest = snap(mouseX);
      A.dir = (A.dest - A.pos) / abs(A.dest - A.pos);
      break;
    case 'f':
      A.face *= -1;
      break;
  }
}

function draw() {
  background(255);

  // Move B
  if (!B.arrived()) B.pos += B.speed * B.dir
  else {
    B.pos = snap(B.pos);
    console.log("B.POS: ", B.pos, "B.DEST: ", B.dest)
  }

  // Display B
  push();
  noStroke();
  fill(220);
  if (B.face < 0) rect(B.pos, 0, width - B.pos, height);
  else rect(0, 0, B.pos, height);
  pop();



  // Move A
  if (!A.arrived()) {
    A.pos += A.speed * A.dir;
    // Update B's choices
    // What are my possibilities?
    // Is my original choice still an option?
    // Yes? Should I stay the course? Or change?
  }
  //else console.log("A arrived!");

  // Display A
  fill(0);
  stroke(0);
  ellipse(A.pos, A.y, 10, 10);
  line(A.pos, A.y, A.pos + A.face * 10, A.y);

  // A position feedback
  stroke('red');
  line(mouseX, 0, mouseX, height);

}
