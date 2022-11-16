class Wave {
  constructor() {}

  init(t, f, a, o) {
    this.t = t;
    this.f = f;
    this.a = a;
    this.o = o;
    this.v = 0;
  }

  run() {
    this.update();
    return this.wave();
  }

  setT(t) {
    this.t = t;
  }

  update() {
    this.t += this.f;
  }
}

class Sine extends Wave {
  constructor() {
    super();
  }

  wave() {
    return Math.sin(this.t) * this.a + this.o;
  }
}


class Cosine extends Wave {
  constructor() {
    super();
  }


  wave() {
    return Math.cos(this.t) * this.a + this.o;
  }

}

class Tan extends Wave {
  constructor() {
    super();
  }

  wave() {
    return Math.abs(Math.tan(this.t) * this.a);
  }
}

class Square extends Wave {
  constructor() {
    super();
  }
  wave() {
    return this.o + (this.t % Math.TWO_PI >= Math.PI ? 1 : -1) * this.a;
  }
}

class Sawtooth extends Wave {
  constructor() {
    super();
  }
  wave() {
    let m = (this.a + this.o) / Math.TWO_PI;
    return (this.t % Math.TWO_PI) * m;
  }
}
