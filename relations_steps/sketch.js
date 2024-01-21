const FRAMERATE = 60;
let PPS = 10;
const TOTAL_STEPS = 16;
const DURATION = 120;

const STEPS = {
  AT: 0,
  A_STEP: 1,
  A_FEW_STEPS: 3,
  A_DISTANCE: 5,
  HALFWAY: 8
}

const STEPS_TO_A = ['A_STEP', 'A_FEW_STEPS', 'A_DISTANCE'];
const STEPS_TO_EDGE = ['A_STEP', 'A_FEW_STEPS', 'A_DISTANCE', 'HALFWAY'];
const STEPS_ABS = ['A_STEP', 'A_FEW_STEPS', 'A_DISTANCE'];

let EDGES = {
  START: {
    type: 'edge',
    label: "START",
    pos: 0
  },
  END: {
    type: 'edge',
    label: "END",
    pos: TOTAL_STEPS
  }
}

let A = {
  type: 'mover',
  label: 'A',
  pos: STEPS.HALFWAY,
  dest: STEPS.HALFWAY,
  speed: STEPS.A_STEP,
  dir: 1,
  face: -1,
  y: undefined,
  arrived: function() {
    return this.pos - this.dest == 0;
  }
}

let B = {
  type: 'mover',
  label: 'B',
  pos: STEPS.A_STEP,
  dest: undefined,
  speed: STEPS.A_STEP,
  dir: 1,
  facing: 1,
  alpha: 0,
  go: function() {
    if (this.landed) {
      this.alpha = 0;
      this.landed = false;
      this.pos += this.speed * this.dir;
    } else {
      this.alpha++
      if (this.alpha > DURATION) this.landed = true;
    }
  },
  isAt: function(other) {
    return other.pos == this.pos;
  },
  isBefore: function(other) {
    return other.pos > this.pos;
  },
  isFacing: function(other) {
    return ((other.pos - this.pos) / abs(other.pos - this.pos)) == this.facing;
  },
  faceTo: function(other, facing) {
    return ((other.pos - this.pos) / abs(other.pos - this.pos)) * facing;
  },
  distTo: function(other) {
    return abs(other.pos - this.pos)
  },
  dirTo: function(other, dir) {
    return dirToOther = ((other.pos - this.pos) / abs(other.pos - this.pos)) * dir;
  },
  arrived: function() {
    return this.landed && this.pos - this.dest == 0;
  },
  edge: function() {
    return this.dir > 0 ? EDGES.END : EDGES.START;
  }
}

// Directory of movers
const ACTORS = {
  A: A,
  B: B,
  START: EDGES.START,
  END: EDGES.END
}

//const TRAJECTORIES = ['STAY', 'TURN', 'MAINTAIN', 'APPROACH', 'DEPART', 'RETREAT', 'BACK INTO', 'PASS', 'BACK PAST'];
const TRAJECTORIES = ['APPROACH', 'DEPART'];

// Helper function
function snap(pos) {
  return round(pos / PPS);
}

// RETREAT - Facing A, Haven't passed A, Going back into your territory
// Last move was on same side
// TUrn to face A

// RETURN is the opposite - Back to A, Just passed A, Returning to A


// Select TRAHECTORY
// Select FACING
function build(from, to) {

  let field = {
    START: 0,
    B: B.pos,
    A: A.pos,
    END: EDGES.END.pos
  }

  let isBeforeA = B.isBefore(A);
  let sides = {
    BEFORE: isBeforeA ? -1 : 1,
    AFTER: isBeforeA ? 1 : -1
  }

  // Always okay
  for (let step of STEPS_ABS) {
    let smult = B.dir;
    let dest = B.pos + (STEPS[step] * smult);
    let label = step;
    field[label] = dest;
  }

  // If target is A, then only before A
  // If target is edge and A is between B and edge, then target is before/after A
  for (let step of STEPS_TO_A) {
    for (let side in sides) {
      let smult = sides[side];
      let dest = A.pos + (STEPS[step] * smult);
      // Stay on the field
      if (dest >= 0 || dest <= TOTAL_STEPS) {
        let label = step + '_' + side + '_A';
        field[label] = dest;
      }
    }
  }

  // If target is edge
  if (to.type == "edge") {
    let edgePos = to.pos;
    let smult = to.label == 'START' ? 1 : -1;
    for (let step of STEPS_TO_EDGE) {
      let dest = edgePos + (STEPS[step] * smult);
      let label = step + '_TO_' + to.label;
      field[label] = dest;
    }
  }


  // Turn into array to sort
  let arr = [];
  Object.entries(field).forEach(([k, v]) => {
    arr.push({
      label: k,
      pos: v
    });
  });

  // Sort by position in the direction B is moving
  arr = arr.sort((a, b) => B.dir > 0 ? (a.pos - b.pos) : (b.pos - a.pos));
  console.log("SORTED", B.dir, arr);

  let sliced = [];
  let f, t;

  // Go backwards
  for(let idx = arr.length-1; idx >= 0; idx--) {
    let dest = arr[idx];
    if (dest.pos == to.pos) t = idx + 1 || undefined;
    else if(dest.pos == from.pos) f = idx + 1;
  }

  arr = arr.slice(f, t);
  console.log("SLICED", f, t, arr);
  return arr;
}

function choose() {

  // Which way am I headed?
  let trajectory = random(TRAJECTORIES);
  let side = 1; // Which side of A or B should I end up?
  let edges = 1; // include edges?
  let field = [];
  let dest, from, to, move;

  switch (trajectory) {
    case 'STAY': // Stand still
      dest = B.pos;
      break;
    case 'TURN': // Stand still
      B.face = -B.face;
      dest = B.pos;
      break;
    case 'MAINTAIN': // Mirror A
      B.speed = A.speed;
      B.dir = A.dir;
      B.face = B.face;
      // When do I change?
      break;
    case 'APPROACH':
      // Can not approach any more, already arrived
      if (B.isAt(A)) {
        choose();
        return;
      }
      B.face = B.faceTo(A, 1);
      B.dir = B.dirTo(A, 1);
      from = B;
      to = A;
      break;
    case 'DEPART':
      let pick = random([1, -1]); // Pick a random facing
      B.face = B.faceTo(A, 1) || pick;
      B.dir = B.dirTo(A, -1) || pick; // Go the same way you're facing
      from = B;
      to = B.edge();
      if (B.isAt(to)) {
        choose();
        return;
      }
      break;
    case 'RETREAT':
      B.face = B.faceTo(A, 1) || B.face; // Stay the same facing
      B.dir = B.dirTo(A, -1) || -B.face; // Go backwards
      from = B;
      to = B.edge();
      if (B.isAt(to)) {
        choose();
        return;
      }
      break;
    case 'BACK INTO':
      // Can not approach any more, already arrived
      if (B.isAt(A)) {
        choose();
        return;
      }
      B.face = B.faceTo(A, -1);
      B.dir = B.dirTo(A, 1);
      from = B;
      to = A;
      // Next choice?
      break;
    case 'PASS':
      B.face = B.faceTo(A, 1) || B.face // Stay the same facing
      B.dir = B.dirTo(A, 1) || B.face; // Go forward
      from = A;
      to = B.edge();
      break;
    case 'BACK PAST':
      B.face = B.faceTo(A, -1) || B.face; // Stay the same facing
      B.dir = B.dirTo(A, 1) || B.dir; // Stay the course if @A;
      from = A;
      to = B.edge();
      break;
    default:
      // Manually trigger next move
      // Deal with Edge for ALL CASES

  }
  if (from, to) {
    try {
      field = build(from, to); // Range of movement
      move = random(field);
      dest = move.pos;
    }
    catch(e) {
      console.log('No moves.', move);
    }
  }
  B.dest = dest;

  // What's the move?
  if (move) console.log(trajectory, 'from', B.pos, 'to', B.dest, 'to', move.label)
  else console.log(trajectory);

}

function setup() {
  pixelDensity(1);
  createCanvas(windowWidth, windowHeight);
  noStroke();

  // Position stuff relative to window
  PPS = round(width / TOTAL_STEPS) * 10 / 10;
  A.y = height / 2;
  console.log('A: ', A.pos, 'B: ', B.pos, PPS, width);

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
      A.dest = snap(mouseX) + 1;
      A.dir = (A.dest - A.pos) / abs(A.dest - A.pos);
      break;
    case 'f':
      A.face *= -1;
      break;
  }
}

function draw() {
  background(255);

  // Highlight step
  stroke(220);
  for (let st = 1; st <= TOTAL_STEPS; st++) {
    let x = st * PPS;
    if (snap(mouseX) == st) fill('red');
    else fill('white');
    rect(x, 0, PPS, height);
  }


  // Move B
  if (!B.arrived()) {
    B.go();
  } else {
    console.log("ARRIVED AT", B.dest)
  }

  // Display B
  push();
  noStroke();
  fill(0, B.alpha);
  let bx = B.pos * PPS;
  if (B.face < 0) rect(bx, 0, width - bx, height);
  else rect(0, 0, bx, height);
  pop();


  // Move A
  if (!A.arrived()) {
    if (frameCount % DURATION == 0) A.pos += A.speed * A.dir;
    console.log("A", A.pos, A.speed);
    // Update B's choices
    // What are my possibilities?
    // Is my original choice still an option?
    // Yes? Should I stay the course? Or change?
  }
  //else console.log("A arrived!");

  // Display A
  fill(0);
  stroke(0);
  let ax = (A.pos * PPS) - PPS / 2;
  ellipse(ax, A.y, 10, 10);
  line(ax, A.y, ax + A.face * 10, A.y);
}
