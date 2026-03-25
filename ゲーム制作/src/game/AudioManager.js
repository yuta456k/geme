export class AudioManager {
  constructor(assetManager) {
    this.assetManager = assetManager;
    this.bgm = null;
    this.muted = false;
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

  safePlay(audio) {
    try {
      const promise = audio.play();
      if (promise?.catch) promise.catch(() => {});
    } catch {
      return;
    }
  }
}
