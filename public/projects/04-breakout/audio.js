let lastSoundTime = 0;
let soundCooldown = 190;

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(frequency, duration) {
  const CURRENT_TIME = performance.now();
  if (CURRENT_TIME - lastSoundTime > soundCooldown) {
    const oscillator = audioContext.createOscillator();
    oscillator.type = "square";
    oscillator.frequency.value = frequency;
    oscillator.connect(audioContext.destination);
    oscillator.start();

    setTimeout(() => {
      oscillator.stop();
    }, duration);

    lastSoundTime = CURRENT_TIME;
  }
}
