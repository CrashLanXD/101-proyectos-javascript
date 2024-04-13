let lastSoundTime = 0;
let soundCooldown = 200;

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(frequency, duration) {

  const currentTime = performance.now()

  if (currentTime - lastSoundTime > soundCooldown) {
    const oscillator = audioContext.createOscillator();
    oscillator.frequency.value = frequency;
    oscillator.connect(audioContext.destination);
    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
    }, duration);

    lastSoundTime = currentTime;
  }
}
