class Sound {
  constructor(src, maxInstances = 5) {
    this.maxInstances = maxInstances;
    this.sounds = [];

    for (let i = 0; i < this.maxInstances; i++) {
      this.sounds.push(new Audio(src));
    }
  }
x
  play() {
    for (let i = 0; i < this.maxInstances; i++) {
      if (this.sounds[i].paused || this.sounds[i].ended) this.sounds[i].play();
      break;
    }
  }
}

// cspell: disable
const SOUNDS = {
  death: new Sound("./audio/death.wav"),
  explood: new Sound("./audio/explod.wav"),
  invmov: new Sound("./audio/invmov.wav"),
  saucer: new Sound("./audio/saucer.wav"),
  shoot: new Sound("./audio/shoot.wav"),
};
