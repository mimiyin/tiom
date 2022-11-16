// Moving the shark
let y = 0;
let h;
let bg = 0;

// Keeping track of voices
const MAX_VOICES = 5;
const MAX_NUM_OUTPUTS = 30;
const LL = 0;
const UL = 600;
let numVoices = 0;
let voices = [];
let outputs = [];
let distances = [];


// Dartboard to control probabilities of
// adding voices and picking wave types
let db;

let cnv;

function reset() {
  db = new Dartboard(MAX_VOICES, 1);
  numVoices = 0;
  voices = [];
  background(0);
  h = height / MAX_NUM_OUTPUTS;
}

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  background(bg);
  noFill();

  // Create Dartboard
  reset();
  // Let's run the same set of random numbers every time
  //randomSeed(10);
  while (outputs.length < MAX_NUM_OUTPUTS) {
    run();
  }
  console.log("OUTPUTS", outputs);
  processOutputs();

}

function run() {
  //IF THERE ARE ACTIVE VOICES...
  if (numVoices > 0) {
    //Check each voice to see if it's dead
    for (let v = 0; v < MAX_VOICES; v++) {
      let voice = voices[v];
      if (voice == null) continue;
      if (voice.isDead()) {
        numVoices--;
        // Maybe add some voices
        addVoice(floor(random(-MAX_VOICES, MAX_VOICES)));
      } else {
        voice.run();
        let value = voice.get();
        db.update(v, value);
      }
    }
  }
  // Cue up some voices if there are none
  else {
    addVoice(floor(random(-MAX_VOICES, MAX_VOICES)));
  }


  // Pick voice
  if (db.isReady()) {
    let v = db.fire();
    if (v >= 0) {
      let value = voices[v].get();
      outputs.push(value);
    }
  }

}

function processOutputs() {

  // Move to the middle
  translate(width / 2, 0);

  for (let o = 1; o < outputs.length; o++) {
    let output = outputs[o];
    let poutput = outputs[o - 1];
    let distance = (output - poutput) / UL;
    distances.push(distance);

    // Visualize the data
    let w = distance * width / 2;
    fill('white');
    rect(0, y, w, h / 2);
    y += h;
  }

  console.log("ALL DONE!", outputs, distances);
}

function keyPressed() {
  if (keyCode == ENTER) {
    let filename = 'distances-' + millis();
    saveJSON(distances, filename + '.json');
    saveCanvas(cnv, filename, 'jpg');
  }
}

// Add a voice to any "dead" spots in the chorus
function addVoice(max) {
  let numToAdd = max - numVoices;
  console.log("ADD", numToAdd);
  if (numToAdd < 1) return;
  for (let v = 0; v < MAX_VOICES; v++) {
    if (voices[v] == null || voices[v].isDead()) {
      if (numVoices >= numToAdd) break;
      voices[v] = new Voice(v);
      numVoices++;
      console.log("NUM ACTIVE VOICES: " + numVoices);
    }
  }
}
