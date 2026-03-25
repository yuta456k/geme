export const GAME_CONFIG = {
  viewport: { width: 1280, height: 720 },
  world: {
    width: 1500,
    height: 4200,
    wallThickness: 80,
    safeBorder: 110
  },
  player: {
    radius: 22,
    maxHp: 100,
    moveSpeed: 300,
    pickupRadius: 120,
    contactInvuln: 0.45
  },
  score: {
    enemyMultiplier: 10,
    secondMultiplier: 2
  },
  performance: {
    maxEnemies: 220,
    maxProjectiles: 240,
    maxZones: 64,
    maxEffects: 180,
    maxTexts: 40,
    maxPickups: 280
  },
  cola: {
    healAmount: 22,
    dropChance: 0.045
  },
  spawn: {
    baseInterval: 0.85,
    minInterval: 0.13,
    waveScalePerSecond: 0.006
  },
  colors: {
    player: "#8ee8ff",
    star: "#ffe27a",
    bubble: "#8be9ff",
    molotov: "#ff8a47",
    poop: "#a26a3d",
    penlight: "#8dfffd",
    broom: "#ffd38c",
    cat: "#f7c9ff",
    xp: "#6af4c8",
    cola: "#ff647c"
  }
};

export const GAME_MODES = {
  TITLE: "title",
  PLAYING: "playing",
  PAUSED: "paused",
  LEVEL_UP: "levelup",
  GAME_OVER: "gameover"
};

export const WEAPON_ORDER = ["star", "bubble", "molotov", "poop", "penlight", "broom", "cat"];
export const PASSIVE_KEYS = ["moveSpeed", "maxHp", "pickupRadius", "colaBoost"];
