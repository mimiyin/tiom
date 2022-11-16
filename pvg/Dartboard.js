class Dartboard {
  constructor(numZones, mult) {
    this.zones = [];
    this.mult = mult;
    this.max = 0;
    console.log("MAX: " + this.max);
  }

  isReady() {
    return this.zones.length > 0;
  }

  update(z, offset) {
    this.zones[z] = offset;
    this.max = 0;
    for(let zone of this.zones) {
      this.max += zone;
    }
    this.max *= this.mult;

    //console.log("ZONES", this.zones);
  }

  // Fire at the dartboard
  fire() {
    let dart = random(0, this.max);
    for (var z = 0; z < this.zones.length; z++) {
      if (dart <= this.zones[z]) {
        return z;
      }
    }
    return -1;
  }
}
