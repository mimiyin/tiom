class Voice {

    constructor() {

      //Which Curve?
      // Create weighted probabilities for num of voices to add and picking wave types
      this.w = new Dartboard(5).fire();

      switch(this.w) {
      default:
        this.wave = new Sine();
        break;
      case 1:
        this.wave = new Cosine();
        break;
      case 2:
        this.wave = new Tan();
        break;
      case 3:
        this.wave = new Square();
        break;
      case 4:
        this.wave = new Sawtooth();
        break;
      }


      //////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////
      //////////////////////PLAY WITH THESE NUMBERS/////////////////////
      //////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////
      // Assign random frequencies and amplitudes
      let freq = random(0.01, 0.1);
      let amp = random(LL, UL);
      let off = 0;
      this.wave.init(0, freq, amp, amp);

      //Set lifespan of voice
      this.lifespan = parseInt(random(LL, UL));
      this.age = 0;
      this.value = 0;

      //console.log("LIFESPAN: " + this.lifespan + "\tWAVE TYPE: ", this.wave, "\tFREQ: " + freq + "\tAMP: " + amp);

    }

    run() {
      this.age++;   // Keep track of how long the voice has been going for
      this.value = this.wave.run();
    }

    get() {
      return this.value;
    }

    // Check for dead
    isDead() {
      return this.age > this.lifespan;
    }

}
