const DEFAULT_FREQUENCY = 300;
const DEFAULT_DURATION = 0.5;

const SOUND_TYPES = {
  ball_fall: { type: "sawtooth", frequency: 280, duration: 0.11 },
  ball_h_walls: { type: "square", frequency: 900, duration: 0.11 },
  ball_v_walls: { type: "square", frequency: 900, duration: 0.11 },
  ball_paddle: { type: "square", frequency: 590, duration: 0.12 },
  ball_bricks: { type: "square", frequency: 280, duration: 0.12 },
};

class Audio {
  constructor() {
    this.audioContext = new window.AudioContext();
  }

  playSound({
    type = "sine",
    frequency = DEFAULT_FREQUENCY,
    duration = DEFAULT_DURATION,
  } = {}) {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(
      frequency,
      this.audioContext.currentTime
    );

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(
      0.00001,
      this.audioContext.currentTime + duration
    );
    oscillator.stop(this.audioContext.currentTime + duration);
  }
}

const audio = new Audio();
