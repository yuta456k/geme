export class AudioManager {
  constructor(assetManager) {
    this.assetManager = assetManager;
    this.bgm = null;
    this.muted = false;
    this.audioContext = null;
    this.lastXpTickAt = 0;
  }

  playBgm(key) {
    const track = this.assetManager.getAudio(key);
    if (!track || this.bgm === track) return;
    this.stopBgm();
    this.bgm = track;
    this.bgm.loop = true;
    this.bgm.volume = 0.28;
    this.safePlay(this.bgm);
  }

  stopBgm() {
    if (!this.bgm) return;
    this.bgm.pause();
    this.bgm.currentTime = 0;
    this.bgm = null;
  }

  playSe(key, volume = 0.35) {
    if (this.muted) return;
    const source = this.assetManager.getAudio(key);
    if (!source) return;
    try {
      const sound = source.cloneNode();
      sound.volume = volume;
      this.safePlay(sound);
    } catch {
      this.safePlay(source);
    }
  }

  playXpTick() {
    if (this.muted) return;
    const nowMs = performance.now();
    if (nowMs - this.lastXpTickAt < 45) return;
    this.lastXpTickAt = nowMs;
    try {
      const context = this.getAudioContext();
      if (!context) return;
      const now = context.currentTime;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const filter = context.createBiquadFilter();
      oscillator.type = "square";
      oscillator.frequency.setValueAtTime(1760, now);
      oscillator.frequency.exponentialRampToValueAtTime(1320, now + 0.018);
      filter.type = "highpass";
      filter.frequency.setValueAtTime(1100, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.06, now + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);
      oscillator.connect(filter);
      filter.connect(gain);
      gain.connect(context.destination);
      oscillator.start(now);
      oscillator.stop(now + 0.04);
    } catch {
      return;
    }
  }

  getAudioContext() {
    if (this.audioContext) return this.audioContext;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    this.audioContext = new Ctx();
    return this.audioContext;
  }

  safePlay(audio) {
    try {
      const promise = audio.play();
      if (promise?.catch) promise.catch(() => {});
    } catch {
      return;
    }
  }
}
