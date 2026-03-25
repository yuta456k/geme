export class AssetManager {
  constructor(catalog) {
    this.catalog = catalog;
    this.images = new Map();
    this.audio = new Map();
  }

  async loadAll() {
    const imageEntries = Object.entries(this.catalog.images);
    const audioEntries = Object.entries(this.catalog.audio);
    await Promise.all([
      ...imageEntries.map(([key, src]) => this.loadImage(key, src)),
      ...audioEntries.map(([key, src]) => this.loadAudio(key, src))
    ]);
  }

  loadImage(key, src) {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => {
        this.images.set(key, image);
        resolve();
      };
      image.onerror = () => resolve();
      image.src = src;
    });
  }

  loadAudio(key, src) {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.preload = "auto";
      const finish = () => {
        this.audio.set(key, audio);
        resolve();
      };
      audio.addEventListener("canplaythrough", finish, { once: true });
      audio.addEventListener("error", () => resolve(), { once: true });
      audio.src = src;
      audio.load();
      setTimeout(resolve, 120);
    });
  }

  getImage(key) {
    return this.images.get(key) || null;
  }

  getAudio(key) {
    return this.audio.get(key) || null;
  }
}
