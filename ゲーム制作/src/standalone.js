(function () {
// FILE: src\data\constants.js
const GAME_CONFIG = {
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

const GAME_MODES = {
  TITLE: "title",
  PLAYING: "playing",
  PAUSED: "paused",
  LEVEL_UP: "levelup",
  GAME_OVER: "gameover"
};

const WEAPON_ORDER = ["star", "bubble", "molotov", "poop", "penlight", "broom", "cat"];
const PASSIVE_KEYS = ["moveSpeed", "maxHp", "pickupRadius", "colaBoost"];


// FILE: src\data\assets.js
const ASSET_CATALOG = {
  images: {
    "player.core": "assets/images/player/player.png",
    "player.sheet": "assets/images/player/player_sheet.png.png",
    "enemy.slime": "assets/images/enemies/img_shirasu.png",
    "enemy.bat": "assets/images/enemies/img_shirasu.png",
    "enemy.brute": "assets/images/enemies/img_shirasu.png",
    "enemy.witch": "assets/images/enemies/img_shirasu.png",
    "weapon.star": "assets/images/weapons/star.png",
    "weapon.bubble": "assets/images/weapons/bubble.png",
    "weapon.molotov": "assets/images/weapons/molotov.png",
    "weapon.poop": "assets/images/weapons/unti.png",
    "weapon.penlight": "assets/images/weapons/penraito.png",
    "weapon.broom": "assets/images/weapons/broom.png",
    "weapon.cat": "assets/images/weapons/cat.png",
    "item.xp": "assets/images/items/xp_gem.png",
    "item.cola": "assets/images/items/cola.png",
    "effect.fire": "assets/images/effects/fire.png",
    "effect.hit": "assets/images/effects/hit.png",
    "ui.logo": "assets/images/ui/logo.png",
    "stage.floor": "assets/images/stage/floor.png",
    "stage.wall": "assets/images/stage/wall.png"
  },
  audio: {
    "bgm.title": "assets/audio/bgm/タイトル.mp3",
    "bgm.stage": "assets/audio/bgm/ステージ.m4a",
    "se.hit": "assets/audio/se/hit.wav",
    "se.levelup": "assets/audio/se/levelup.wav",
    "se.heal": "assets/audio/se/heal.wav",
    "se.gameover": "assets/audio/se/gameover.wav"
  }
};

const SPRITE_LAYOUTS = {
  "player.sheet": {
    columns: 4,
    rows: 1,
    idleFrame: 1,
    runFrames: [0, 1, 2, 1],
    fps: 8,
    scale: 0.21,
    anchorX: 0.5,
    anchorY: 0.88
  },
  "weapon.molotov": {
    columns: 4,
    rows: 1,
    throwFrames: [0, 1, 2],
    landedFrame: 3,
    scale: 0.17,
    anchorX: 0.5,
    anchorY: 0.58
  },
  "weapon.poop": {
    columns: 4,
    rows: 1,
    frames: [0, 1, 2, 3],
    scale: 0.24,
    anchorX: 0.5,
    anchorY: 0.55
  },
  "weapon.cat": {
    columns: 4,
    rows: 1,
    idleFrame: 1,
    runFrames: [0, 1, 2, 3],
    fps: 9,
    scale: 0.16,
    anchorX: 0.5,
    anchorY: 0.78
  },
  "weapon.bubble": {
    scale: 1,
    anchorX: 0.5,
    anchorY: 0.5
  },
  "weapon.broom": {
    scale: 0.12,
    anchorX: 0.5,
    anchorY: 0.5
  },
  "weapon.penlight": {
    columns: 2,
    rows: 1,
    normalFrame: 0,
    lv5Frame: 1,
    scale: 0.42,
    anchorX: 0.5,
    anchorY: 0.88
  }
};


// FILE: src\data\enemies.js
const ENEMY_DEFS = {
  slime: {
    key: "slime",
    name: "Slime",
    asset: "enemy.slime",
    color: "#8effb0",
    radius: 18,
    hp: 34,
    speed: 70,
    damagePerSecond: 9,
    xp: 5
  },
  bat: {
    key: "bat",
    name: "Bat",
    asset: "enemy.bat",
    color: "#ff95c0",
    radius: 15,
    hp: 24,
    speed: 110,
    damagePerSecond: 7,
    xp: 6
  },
  brute: {
    key: "brute",
    name: "Brute",
    asset: "enemy.brute",
    color: "#ffaf66",
    radius: 28,
    hp: 88,
    speed: 58,
    damagePerSecond: 14,
    xp: 12
  },
  witch: {
    key: "witch",
    name: "Witch",
    asset: "enemy.witch",
    color: "#b18cff",
    radius: 20,
    hp: 60,
    speed: 88,
    damagePerSecond: 12,
    xp: 10
  }
};


// FILE: src\data\weapons.js

const c = GAME_CONFIG.colors;

const WEAPON_DEFS = {
  star: {
    key: "star",
    name: "スター",
    asset: "weapon.star",
    iconColor: c.star,
    maxLevel: 5,
    startsOwned: true,
    description: "最寄りの敵を狙う追尾寄りの投射武器。",
    levels: [
      { shots: 1, damage: 18, cooldown: 0.62, speed: 560, size: 13, turnRate: 7 },
      { shots: 2, damage: 18, cooldown: 0.62, speed: 570, size: 13, turnRate: 7.5 },
      { shots: 3, damage: 18, cooldown: 0.6, speed: 580, size: 14, turnRate: 8 },
      { shots: 4, damage: 18, cooldown: 0.58, speed: 590, size: 14, turnRate: 8.5 },
      { shots: 4, damage: 27, cooldown: 0.29, speed: 620, size: 16, turnRate: 10 }
    ]
  },
  bubble: {
    key: "bubble",
    name: "シャボン玉",
    asset: "weapon.bubble",
    iconColor: c.bubble,
    maxLevel: 5,
    description: "プレイヤー周囲を包む継続ダメージの泡。",
    levels: [
      { radius: 84, damage: 9, tick: 0.28, alpha: 0.2 },
      { radius: 100, damage: 9, tick: 0.28, alpha: 0.22 },
      { radius: 118, damage: 10, tick: 0.27, alpha: 0.24 },
      { radius: 136, damage: 11, tick: 0.27, alpha: 0.26 },
      { radius: 144, damage: 16, tick: 0.24, alpha: 0.28 }
    ]
  },
  molotov: {
    key: "molotov",
    name: "火炎瓶",
    asset: "weapon.molotov",
    iconColor: c.molotov,
    maxLevel: 5,
    description: "投げた地点に炎エリアを残す設置武器。",
    levels: [
      { shots: 1, cooldown: 2.2, throwRange: 240, damage: 13, radius: 58, duration: 4.6, tick: 0.25, maxZones: 4 },
      { shots: 2, cooldown: 2.0, throwRange: 250, damage: 13, radius: 58, duration: 4.8, tick: 0.25, maxZones: 5 },
      { shots: 3, cooldown: 1.85, throwRange: 260, damage: 14, radius: 60, duration: 4.9, tick: 0.25, maxZones: 6 },
      { shots: 4, cooldown: 1.7, throwRange: 270, damage: 15, radius: 62, duration: 5.2, tick: 0.24, maxZones: 7 },
      { shots: 4, cooldown: 0.22, throwRange: 275, damage: 15, radius: 64, duration: 3.2, tick: 0.2, maxZones: 8 }
    ]
  },
  poop: {
    key: "poop",
    name: "ウンチ",
    asset: "weapon.poop",
    iconColor: c.poop,
    maxLevel: 5,
    description: "予兆の後に落下して爆発する範囲攻撃。",
    levels: [
      { shots: 1, cooldown: 2.4, radius: 70, damage: 34, delay: 0.72 },
      { shots: 2, cooldown: 2.2, radius: 70, damage: 34, delay: 0.7 },
      { shots: 3, cooldown: 2.0, radius: 72, damage: 36, delay: 0.68 },
      { shots: 4, cooldown: 1.8, radius: 74, damage: 38, delay: 0.66 },
      { shots: 4, cooldown: 1.65, radius: 76, damage: 54, delay: 0.62 }
    ]
  },
  penlight: {
    key: "penlight",
    name: "ペンライト",
    asset: "weapon.penlight",
    iconColor: c.penlight,
    maxLevel: 5,
    description: "自分の周囲を大きく一回転する近中距離攻撃。",
    levels: [
      { cooldown: 3.0, width: 80, height: 280, damage: 36 },
      { cooldown: 2.9, width: 92, height: 320, damage: 36 },
      { cooldown: 2.75, width: 108, height: 360, damage: 38 },
      { cooldown: 2.6, width: 122, height: 405, damage: 40 },
      { cooldown: 1.0, width: 122, height: 405, damage: 52 }
    ]
  },
  broom: {
    key: "broom",
    name: "箒",
    asset: "weapon.broom",
    iconColor: c.broom,
    maxLevel: 5,
    description: "移動方向へ飛ぶ貫通タイプの飛翔武器。",
    levels: [
      { cooldown: 1.25, damage: 24, speed: 620, width: 74, height: 18, range: 520 },
      { cooldown: 1.05, damage: 24, speed: 630, width: 74, height: 18, range: 530 },
      { cooldown: 0.88, damage: 26, speed: 640, width: 76, height: 18, range: 540 },
      { cooldown: 0.7, damage: 28, speed: 660, width: 78, height: 18, range: 560 },
      { cooldown: 0.7, damage: 28, speed: 660, width: 117, height: 27, range: 580 }
    ]
  },
  cat: {
    key: "cat",
    name: "猫",
    asset: "weapon.cat",
    iconColor: c.cat,
    maxLevel: 5,
    description: "敵を追い回して連続攻撃する召喚猫。",
    levels: [
      { hitsPerCombo: 1, speed: 180, damage: 18, cooldown: 1.0, leash: 150 },
      { hitsPerCombo: 2, speed: 190, damage: 18, cooldown: 1.0, leash: 160 },
      { hitsPerCombo: 3, speed: 200, damage: 19, cooldown: 0.95, leash: 165 },
      { hitsPerCombo: 4, speed: 210, damage: 20, cooldown: 0.9, leash: 170 },
      { hitsPerCombo: 4, speed: 420, damage: 30, cooldown: 0.78, leash: 180 }
    ]
  }
};

const PASSIVE_UPGRADES = {
  moveSpeed: {
    key: "moveSpeed",
    name: "ダッシュ脚",
    maxLevel: 5,
    description: "移動速度 +8%",
    apply(game) {
      game.passives.moveSpeed += 1;
      game.player.moveSpeedMultiplier = 1 + game.passives.moveSpeed * 0.08;
    }
  },
  maxHp: {
    key: "maxHp",
    name: "スタミナ増強",
    maxLevel: 5,
    description: "最大HP +18、即時8回復",
    apply(game) {
      game.passives.maxHp += 1;
      game.player.maxHp += 18;
      game.player.hp = Math.min(game.player.maxHp, game.player.hp + 8);
    }
  },
  pickupRadius: {
    key: "pickupRadius",
    name: "磁力リング",
    maxLevel: 5,
    description: "取得範囲 +18%",
    apply(game) {
      game.passives.pickupRadius += 1;
      game.player.pickupRadiusMultiplier = 1 + game.passives.pickupRadius * 0.18;
    }
  },
  colaBoost: {
    key: "colaBoost",
    name: "炭酸マニア",
    maxLevel: 5,
    description: "コーラ回復量 +35%",
    apply(game) {
      game.passives.colaBoost += 1;
    }
  }
};


// FILE: src\utils\math.js
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const lerp = (a, b, t) => a + (b - a) * t;
const rand = (min, max) => min + Math.random() * (max - min);
const randInt = (min, max) => Math.floor(rand(min, max + 1));
const distanceSq = (ax, ay, bx, by) => {
  const dx = bx - ax;
  const dy = by - ay;
  return dx * dx + dy * dy;
};
const distance = (ax, ay, bx, by) => Math.sqrt(distanceSq(ax, ay, bx, by));
const length = (x, y) => Math.sqrt(x * x + y * y);
const normalize = (x, y) => {
  const len = length(x, y) || 1;
  return { x: x / len, y: y / len };
};
const angleToVector = (angle) => ({ x: Math.cos(angle), y: Math.sin(angle) });
const vectorToAngle = (x, y) => Math.atan2(y, x);
const rotateTowards = (currentAngle, targetAngle, maxStep) => {
  let diff = ((targetAngle - currentAngle + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
  diff = clamp(diff, -maxStep, maxStep);
  return currentAngle + diff;
};
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${secs}`;
};


// FILE: src\entities\Player.js

function createPlayer(config, world) {
  return {
    x: world.width * 0.5,
    y: world.height * 0.5,
    radius: config.radius,
    hp: config.maxHp,
    maxHp: config.maxHp,
    baseMoveSpeed: config.moveSpeed,
    moveSpeedMultiplier: 1,
    pickupRadiusBase: config.pickupRadius,
    pickupRadiusMultiplier: 1,
    lastMoveX: 0,
    lastMoveY: -1,
    velocityX: 0,
    velocityY: 0,
    hitCooldown: 0,
    flash: 0
  };
}

function updatePlayer(player, inputVector, dt, world) {
  const move = normalize(inputVector.x, inputVector.y);
  const strength = Math.min(1, Math.hypot(inputVector.x, inputVector.y));
  const speed = player.baseMoveSpeed * player.moveSpeedMultiplier * strength;
  player.velocityX = move.x * speed;
  player.velocityY = move.y * speed;
  player.x += player.velocityX * dt;
  player.y += player.velocityY * dt;
  if (strength > 0.1) {
    player.lastMoveX = move.x;
    player.lastMoveY = move.y;
  }
  player.x = clamp(player.x, world.wallThickness + player.radius, world.width - world.wallThickness - player.radius);
  player.y = clamp(player.y, player.radius + 20, world.height - player.radius - 20);
  player.hitCooldown = Math.max(0, player.hitCooldown - dt);
  player.flash = Math.max(0, player.flash - dt);
}

function getPickupRadius(player) {
  return player.pickupRadiusBase * player.pickupRadiusMultiplier;
}


// FILE: src\entities\Enemy.js

let nextEnemyId = 1;

function createEnemy(def, x, y, intensity = 1) {
  return {
    id: nextEnemyId++,
    type: def.key,
    asset: def.asset,
    x,
    y,
    radius: def.radius * (0.96 + intensity * 0.08),
    hp: def.hp * intensity,
    maxHp: def.hp * intensity,
    speed: def.speed * (0.96 + intensity * 0.05),
    damagePerSecond: def.damagePerSecond * (0.96 + intensity * 0.08),
    xp: Math.round(def.xp * intensity),
    color: def.color,
    dead: false,
    flash: 0,
    hitCooldowns: {}
  };
}

function updateEnemy(enemy, player, dt) {
  const dir = normalize(player.x - enemy.x, player.y - enemy.y);
  enemy.x += dir.x * enemy.speed * dt;
  enemy.y += dir.y * enemy.speed * dt;
  enemy.flash = Math.max(0, enemy.flash - dt);
  for (const key of Object.keys(enemy.hitCooldowns)) {
    enemy.hitCooldowns[key] = Math.max(0, enemy.hitCooldowns[key] - dt);
  }
}


// FILE: src\entities\Pickup.js
let nextPickupId = 1;

function createXpGem(x, y, amount) {
  return {
    id: nextPickupId++,
    kind: "xp",
    x,
    y,
    amount,
    radius: 11,
    attractSpeed: 0,
    dead: false
  };
}

function createCola(x, y, amount) {
  return {
    id: nextPickupId++,
    kind: "cola",
    x,
    y,
    amount,
    radius: 16,
    attractSpeed: 0,
    dead: false
  };
}


// FILE: src\entities\CatMinion.js

let nextCatId = 1;

function createCat(player) {
  return {
    id: nextCatId++,
    x: player.x + 46,
    y: player.y + 20,
    radius: 18,
    targetId: null,
    attackCooldown: 0,
    comboTimer: 0,
    comboHitsLeft: 0,
    flash: 0
  };
}

function updateCat(cat, player, target, stats, dt) {
  const anchorX = player.x + 38;
  const anchorY = player.y + 26;
  let destinationX = anchorX;
  let destinationY = anchorY;

  if (target) {
    const dist = distance(cat.x, cat.y, target.x, target.y);
    if (dist > target.radius + 18) {
      destinationX = target.x;
      destinationY = target.y;
    }
  }

  const dir = normalize(destinationX - cat.x, destinationY - cat.y);
  cat.x += dir.x * stats.speed * dt;
  cat.y += dir.y * stats.speed * dt;

  const leashDistance = distance(cat.x, cat.y, player.x, player.y);
  if (leashDistance > stats.leash + 60) {
    cat.x += (anchorX - cat.x) * 0.1;
    cat.y += (anchorY - cat.y) * 0.1;
  }

  cat.attackCooldown = Math.max(0, cat.attackCooldown - dt);
  cat.comboTimer = Math.max(0, cat.comboTimer - dt);
  cat.flash = Math.max(0, cat.flash - dt);
}


// FILE: src\game\AssetManager.js
class AssetManager {
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


// FILE: src\game\AudioManager.js
class AudioManager {
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


// FILE: src\game\InputManager.js

class InputManager {
  constructor(canvas, joystickBase, joystickStick) {
    this.canvas = canvas;
    this.keys = new Set();
    this.pressed = new Set();
    this.touchVector = { x: 0, y: 0 };
    this.joystickBase = joystickBase;
    this.joystickStick = joystickStick;
    this.pointerId = null;
    this.baseRect = null;
    this.bind();
  }

  bind() {
    window.addEventListener("keydown", (event) => {
      const key = event.key.toLowerCase();
      this.keys.add(key);
      this.pressed.add(key);
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(key)) {
        event.preventDefault();
      }
    });

    window.addEventListener("keyup", (event) => {
      this.keys.delete(event.key.toLowerCase());
    });

    const startTouch = (event) => {
      const touch = [...event.changedTouches].find((item) => item.clientX < window.innerWidth * 0.5);
      if (!touch || this.pointerId !== null) return;
      this.pointerId = touch.identifier;
      this.baseRect = this.joystickBase.getBoundingClientRect();
      this.updateTouchVector(touch.clientX, touch.clientY);
    };

    const moveTouch = (event) => {
      if (this.pointerId === null) return;
      const touch = [...event.changedTouches].find((item) => item.identifier === this.pointerId);
      if (!touch) return;
      this.updateTouchVector(touch.clientX, touch.clientY);
    };

    const endTouch = (event) => {
      if (this.pointerId === null) return;
      const touch = [...event.changedTouches].find((item) => item.identifier === this.pointerId);
      if (!touch) return;
      this.pointerId = null;
      this.touchVector.x = 0;
      this.touchVector.y = 0;
      this.joystickStick.style.transform = "translate(0px, 0px)";
    };

    window.addEventListener("touchstart", startTouch, { passive: true });
    window.addEventListener("touchmove", moveTouch, { passive: true });
    window.addEventListener("touchend", endTouch, { passive: true });
    window.addEventListener("touchcancel", endTouch, { passive: true });
  }

  updateTouchVector(clientX, clientY) {
    const rect = this.baseRect || this.joystickBase.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const max = rect.width * 0.3;
    const magnitude = Math.hypot(dx, dy) || 1;
    const clamped = Math.min(max, magnitude);
    const nx = (dx / magnitude) * clamped;
    const ny = (dy / magnitude) * clamped;
    this.touchVector.x = clamp(nx / max, -1, 1);
    this.touchVector.y = clamp(ny / max, -1, 1);
    this.joystickStick.style.transform = `translate(${nx}px, ${ny}px)`;
  }

  consumePressed(key) {
    if (!this.pressed.has(key)) return false;
    this.pressed.delete(key);
    return true;
  }

  clearPressed() {
    this.pressed.clear();
  }

  getMoveVector() {
    let x = 0;
    let y = 0;
    if (this.keys.has("a") || this.keys.has("arrowleft")) x -= 1;
    if (this.keys.has("d") || this.keys.has("arrowright")) x += 1;
    if (this.keys.has("w") || this.keys.has("arrowup")) y -= 1;
    if (this.keys.has("s") || this.keys.has("arrowdown")) y += 1;
    x += this.touchVector.x;
    y += this.touchVector.y;
    return { x: clamp(x, -1, 1), y: clamp(y, -1, 1) };
  }
}


// FILE: src\systems\LevelSystem.js

function getXpForLevel(level) {
  return Math.floor((18 + level * 10 + level * level * 2.6) * 1.3);
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildScoreBonusChoice(game) {
  return {
    id: "bonus:score",
    kind: "bonus",
    key: "score",
    title: "スコアボーナス",
    description: `現在Lv x 200 のスコアを即時獲得 (${game.level * 200})`
  };
}

function buildLevelChoices(game) {
  const weaponChoices = [];
  for (const key of WEAPON_ORDER) {
    const def = WEAPON_DEFS[key];
    const currentLevel = game.weapons[key] ?? 0;
    if (currentLevel >= def.maxLevel) continue;
    const targetLevel = currentLevel + 1;
    const displayName = key === "penlight" && targetLevel === 5 ? "ペンライト（？）" : def.name;
    weaponChoices.push({
      id: `weapon:${key}`,
      kind: "weapon",
      key,
      iconLevel: targetLevel,
      iconColor: def.iconColor,
      title: currentLevel === 0 ? `${displayName} 解放` : `${displayName} Lv.${targetLevel}`,
      description: currentLevel === 0 ? def.description : describeWeaponUpgrade(key, currentLevel + 1)
    });
  }

  const passiveChoices = [];
  for (const key of PASSIVE_KEYS) {
    const def = PASSIVE_UPGRADES[key];
    const currentLevel = game.passives[key] ?? 0;
    if (currentLevel >= def.maxLevel) continue;
    passiveChoices.push({
      id: `passive:${key}`,
      kind: "passive",
      key,
      title: `${def.name} Lv.${currentLevel + 1}`,
      description: def.description
    });
  }

  const scoreBonusChoice = buildScoreBonusChoice(game);
  if (game.debugMode) return weaponChoices.length > 0 ? weaponChoices : [scoreBonusChoice];

  const pool = shuffle([...weaponChoices, ...passiveChoices]);
  const choices = pool.slice(0, 3);
  return choices.length > 0 ? choices : [scoreBonusChoice];
}

function applyChoice(game, choice) {
  const [kind, key] = choice.id.split(":");
  if (kind === "weapon") {
    game.weapons[key] = Math.min(WEAPON_DEFS[key].maxLevel, (game.weapons[key] ?? 0) + 1);
    if (!game.weaponTimers[key]) game.weaponTimers[key] = 0;
    if (key === "cat") game.ensureCat();
    return;
  }

  if (kind === "bonus" && key === "score") {
    game.killScore += game.level * 200;
    return;
  }

  PASSIVE_UPGRADES[key].apply(game);
}

function describeWeaponUpgrade(key, targetLevel) {
  const stats = WEAPON_DEFS[key].levels[targetLevel - 1];
  switch (key) {
    case "star":
      return `発射数 ${stats.shots} / ダメージ ${stats.damage} / クールタイム ${stats.cooldown.toFixed(2)}秒`;
    case "bubble":
      return `範囲 ${stats.radius} / 継続ダメージ ${stats.damage}`;
    case "molotov":
      return `投擲数 ${stats.shots} / 炎範囲 ${stats.radius} / クールタイム ${stats.cooldown.toFixed(2)}秒`;
    case "poop":
      return `落下数 ${stats.shots} / 爆発範囲 ${stats.radius} / ダメージ ${stats.damage}`;
    case "penlight":
      return `縦範囲 ${stats.height} / 横幅 ${stats.width} / ダメージ ${stats.damage}`;
    case "broom":
      return `クールタイム ${stats.cooldown.toFixed(2)}秒 / ダメージ ${stats.damage}`;
    case "cat":
      return `連撃数 ${stats.hitsPerCombo} / 移動速度 ${stats.speed} / ダメージ ${stats.damage}`;
    default:
      return "";
  }
}


// FILE: src\systems\WeaponSystem.js

const STAR_BURST_INTERVAL = 0.045;

function updateWeapons(game, dt) {
  processQueuedStarShots(game, dt);

  for (const key of Object.keys(game.weaponTimers)) {
    game.weaponTimers[key] = Math.max(0, game.weaponTimers[key] - dt);
  }

  if (game.weapons.star > 0) updateStar(game);
  if (game.weapons.bubble > 0) updateBubble(game, dt);
  if (game.weapons.molotov > 0) updateMolotov(game);
  if (game.weapons.poop > 0) updatePoop(game);
  if (game.weapons.penlight > 0) updatePenlight(game);
  if (game.weapons.broom > 0) updateBroom(game);
  if (game.weapons.cat > 0) updateCatWeapon(game, dt);
}

function processQueuedStarShots(game, dt) {
  const remaining = [];
  for (const shot of game.queuedStarShots) {
    shot.delay -= dt;
    if (shot.delay > 0) {
      remaining.push(shot);
      continue;
    }

    if (game.projectiles.length >= game.config.performance.maxProjectiles) {
      shot.delay = 0;
      remaining.push(shot);
      continue;
    }

    const target = game.findNearestEnemy(game.player.x, game.player.y);
    const baseAngle = Math.atan2(game.player.lastMoveY || -1, game.player.lastMoveX || 0);
    const spread = (shot.index - (shot.totalShots - 1) / 2) * 0.24;
    const angle = target ? Math.atan2(target.y - game.player.y, target.x - game.player.x) + spread : baseAngle + spread;
    const dir = angleToVector(angle);
    game.projectiles.push({
      kind: "star",
      x: game.player.x + dir.x * 18,
      y: game.player.y + dir.y * 18,
      vx: dir.x * shot.speed,
      vy: dir.y * shot.speed,
      angle,
      damage: shot.damage,
      radius: shot.size,
      life: 1.5,
      turnRate: shot.turnRate,
      targetId: target?.id ?? null,
      dead: false
    });
  }
  game.queuedStarShots = remaining;
}

function updateStar(game) {
  const stats = WEAPON_DEFS.star.levels[game.weapons.star - 1];
  if (game.weaponTimers.star > 0 || game.projectiles.length >= game.config.performance.maxProjectiles) return;
  game.weaponTimers.star = stats.cooldown + (stats.shots - 1) * STAR_BURST_INTERVAL;
  for (let i = 0; i < stats.shots; i += 1) {
    game.queuedStarShots.push({
      delay: i * STAR_BURST_INTERVAL,
      index: i,
      totalShots: stats.shots,
      damage: stats.damage,
      size: stats.size,
      speed: stats.speed,
      turnRate: stats.turnRate
    });
  }
  game.addEffect("starBurst", game.player.x, game.player.y, { color: WEAPON_DEFS.star.iconColor });
}

function updateBubble(game, dt) {
  const stats = WEAPON_DEFS.bubble.levels[game.weapons.bubble - 1];
  for (const enemy of game.enemies) {
    if (enemy.dead) continue;
    const key = "bubble";
    if (distance(enemy.x, enemy.y, game.player.x, game.player.y) > stats.radius + enemy.radius * 0.5) continue;
    if ((enemy.hitCooldowns[key] ?? 0) > 0) continue;
    enemy.hitCooldowns[key] = stats.tick;
    game.damageEnemy(enemy, stats.damage, "bubble");
  }
  game.bubblePulse = (game.bubblePulse + dt * 2.2) % (Math.PI * 2);
}

function updateMolotov(game) {
  const stats = WEAPON_DEFS.molotov.levels[game.weapons.molotov - 1];
  const currentFireZones = game.zones.filter((zone) => zone.kind === "fire").length;
  if (game.weaponTimers.molotov > 0 || currentFireZones >= stats.maxZones) return;
  game.weaponTimers.molotov = stats.cooldown;
  for (let i = 0; i < stats.shots; i += 1) {
    if (game.projectiles.length >= game.config.performance.maxProjectiles) break;
    const angle = Math.random() * Math.PI * 2;
    const dist = rand(90, stats.throwRange);
    const targetX = clamp(game.player.x + Math.cos(angle) * dist, 120, game.config.world.width - 120);
    const targetY = clamp(game.player.y + Math.sin(angle) * dist, 120, game.config.world.height - 120);
    game.projectiles.push({
      kind: "molotovBottle",
      x: game.player.x,
      y: game.player.y - 16,
      startX: game.player.x,
      startY: game.player.y - 16,
      targetX,
      targetY,
      elapsed: 0,
      duration: 0.55,
      damage: stats.damage,
      radius: stats.radius,
      tick: stats.tick,
      zoneDuration: stats.duration,
      dead: false
    });
  }
}

function updatePoop(game) {
  const stats = WEAPON_DEFS.poop.levels[game.weapons.poop - 1];
  if (game.weaponTimers.poop > 0 || game.zones.length >= game.config.performance.maxZones) return;
  game.weaponTimers.poop = stats.cooldown;
  for (let i = 0; i < stats.shots; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const dist = rand(120, 340);
    const x = clamp(game.player.x + Math.cos(angle) * dist, 120, game.config.world.width - 120);
    const y = clamp(game.player.y + Math.sin(angle) * dist, 120, game.config.world.height - 120);
    game.zones.push({ kind: "poopWarning", x, y, radius: stats.radius, damage: stats.damage, delay: stats.delay, elapsed: 0, dead: false });
  }
}

function updatePenlight(game) {
  const stats = WEAPON_DEFS.penlight.levels[game.weapons.penlight - 1];
  if (game.weaponTimers.penlight > 0) return;
  game.weaponTimers.penlight = stats.cooldown;
  const life = 0.28;
  const handleOffsetY = -28;
  const length = stats.height * 0.55;
  const thickness = Math.max(22, stats.width * 0.42);
  const startAngle = -Math.PI * 0.5;
  const endAngle = startAngle + Math.PI * 2;
  const swing = {
    kind: "penlight",
    x: game.player.x,
    y: game.player.y + handleOffsetY,
    handleOffsetY,
    length,
    thickness,
    damage: stats.damage,
    life,
    maxLife: life,
    startAngle,
    endAngle,
    dead: false
  };
  game.zones.push(swing);
  game.addEffect("penlight", game.player.x, game.player.y + handleOffsetY, { length, thickness, startAngle, endAngle });
}

function snapAngleToEightDirections(angle) {
  const step = Math.PI / 4;
  return Math.round(angle / step) * step;
}

function updateBroom(game) {
  const stats = WEAPON_DEFS.broom.levels[game.weapons.broom - 1];
  if (game.weaponTimers.broom > 0 || game.projectiles.length >= game.config.performance.maxProjectiles) return;
  game.weaponTimers.broom = stats.cooldown;
  const input = game.input.getMoveVector();
  const useInput = Math.hypot(input.x, input.y) > 0.1;
  const rawAngle = useInput
    ? Math.atan2(input.y, input.x)
    : Math.atan2(game.player.lastMoveY ?? -1, game.player.lastMoveX ?? 0);
  const angle = snapAngleToEightDirections(rawAngle);
  const dir = angleToVector(angle);
  game.projectiles.push({
    kind: "broom",
    x: game.player.x + dir.x * 18,
    y: game.player.y + dir.y * 18,
    vx: dir.x * stats.speed,
    vy: dir.y * stats.speed,
    angle,
    damage: stats.damage,
    width: stats.width,
    height: stats.height,
    traveled: 0,
    range: stats.range,
    dead: false
  });
}

function updateCatWeapon(game, dt) {
  game.ensureCat();
  const stats = WEAPON_DEFS.cat.levels[game.weapons.cat - 1];
  for (const cat of game.cats) {
    const target = game.findNearestEnemy(cat.x, cat.y, 340);
    updateCat(cat, game.player, target, stats, dt);
    if (cat.attackCooldown <= 0 && target && distance(cat.x, cat.y, target.x, target.y) < target.radius + 28) {
      cat.attackCooldown = stats.cooldown;
      cat.comboHitsLeft = stats.hitsPerCombo;
      cat.comboTimer = 0.05;
      cat.targetId = target.id;
    }
    if (cat.comboHitsLeft > 0) {
      cat.comboTimer -= dt;
      if (cat.comboTimer <= 0) {
        const comboTarget = game.enemies.find((enemy) => enemy.id === cat.targetId && !enemy.dead) || game.findNearestEnemy(cat.x, cat.y, 110);
        if (comboTarget) {
          game.damageEnemy(comboTarget, stats.damage, "cat");
          game.addEffect("catSlash", comboTarget.x, comboTarget.y, {});
          cat.flash = 0.1;
        }
        cat.comboHitsLeft -= 1;
        cat.comboTimer = 0.09;
      }
    }
  }
}

function updateProjectileState(game, dt) {
  for (const projectile of game.projectiles) {
    if (projectile.kind === "star") {
      const target = game.enemies.find((enemy) => enemy.id === projectile.targetId && !enemy.dead) || game.findNearestEnemy(projectile.x, projectile.y, 520);
      if (target) {
        const desiredAngle = Math.atan2(target.y - projectile.y, target.x - projectile.x);
        projectile.angle = rotateTowards(projectile.angle, desiredAngle, projectile.turnRate * dt);
        const vec = angleToVector(projectile.angle);
        const speed = Math.hypot(projectile.vx, projectile.vy);
        projectile.vx = vec.x * speed;
        projectile.vy = vec.y * speed;
      }
      projectile.x += projectile.vx * dt;
      projectile.y += projectile.vy * dt;
    } else if (projectile.kind === "broom") {
      projectile.x += projectile.vx * dt;
      projectile.y += projectile.vy * dt;
      projectile.traveled += Math.hypot(projectile.vx * dt, projectile.vy * dt);
      if (projectile.traveled >= projectile.range) projectile.dead = true;
    } else if (projectile.kind === "molotovBottle") {
      projectile.elapsed += dt;
      const t = Math.min(1, projectile.elapsed / projectile.duration);
      projectile.x = lerp(projectile.startX, projectile.targetX, t);
      projectile.y = lerp(projectile.startY, projectile.targetY, t) - Math.sin(t * Math.PI) * 90;
      if (t >= 1) {
        projectile.dead = true;
        game.zones.push({ kind: "fire", x: projectile.targetX, y: projectile.targetY, radius: projectile.radius, damage: projectile.damage, tick: projectile.tick, life: projectile.zoneDuration, dead: false });
        game.addEffect("fireBurst", projectile.targetX, projectile.targetY, {});
      }
    }

    projectile.life = (projectile.life ?? 99) - dt;
    if (projectile.life <= 0) projectile.dead = true;
    if (projectile.x < -200 || projectile.x > game.config.world.width + 200 || projectile.y < -200 || projectile.y > game.config.world.height + 200) {
      projectile.dead = true;
    }
  }
}

function pointSegmentDistance(px, py, ax, ay, bx, by) {
  const abx = bx - ax;
  const aby = by - ay;
  const apx = px - ax;
  const apy = py - ay;
  const abLenSq = abx * abx + aby * aby || 1;
  const t = clamp((apx * abx + apy * aby) / abLenSq, 0, 1);
  const closestX = ax + abx * t;
  const closestY = ay + aby * t;
  return distance(px, py, closestX, closestY);
}

function getPenlightSegment(zone) {
  const progress = clamp(1 - zone.life / zone.maxLife, 0, 1);
  const angle = lerp(zone.startAngle, zone.endAngle, progress);
  const tipX = zone.x + Math.cos(angle) * zone.length;
  const tipY = zone.y + Math.sin(angle) * zone.length;
  return { angle, ax: zone.x, ay: zone.y, bx: tipX, by: tipY };
}

function updateZoneState(game, dt) {
  for (const zone of game.zones) {
    if (zone.kind === "fire") {
      zone.life -= dt;
      for (const enemy of game.enemies) {
        if (enemy.dead) continue;
        if (distance(zone.x, zone.y, enemy.x, enemy.y) > zone.radius + enemy.radius) continue;
        const key = `fire-${zone.x.toFixed(0)}-${zone.y.toFixed(0)}`;
        if ((enemy.hitCooldowns[key] ?? 0) > 0) continue;
        enemy.hitCooldowns[key] = zone.tick;
        game.damageEnemy(enemy, zone.damage, "fire");
      }
      if (zone.life <= 0) zone.dead = true;
    } else if (zone.kind === "poopWarning") {
      zone.elapsed += dt;
      if (zone.elapsed >= zone.delay) {
        for (const enemy of game.enemies) {
          if (enemy.dead) continue;
          if (distance(zone.x, zone.y, enemy.x, enemy.y) <= zone.radius + enemy.radius) game.damageEnemy(enemy, zone.damage, "poop");
        }
        game.addEffect("poopBurst", zone.x, zone.y, {});
        zone.dead = true;
      }
    } else if (zone.kind === "penlight") {
      zone.life -= dt;
      const segment = getPenlightSegment(zone);
      for (const enemy of game.enemies) {
        if (enemy.dead) continue;
        const hitDistance = pointSegmentDistance(enemy.x, enemy.y, segment.ax, segment.ay, segment.bx, segment.by);
        const key = `penlight-${zone.x}-${zone.y}`;
        if (hitDistance <= zone.thickness * 0.5 + enemy.radius && (enemy.hitCooldowns[key] ?? 0) <= 0) {
          enemy.hitCooldowns[key] = 0.12;
          game.damageEnemy(enemy, zone.damage, "penlight");
        }
      }
      if (zone.life <= 0) zone.dead = true;
    }
  }
}

function resolveProjectileHits(game) {
  for (const projectile of game.projectiles) {
    if (projectile.dead || projectile.kind === "molotovBottle") continue;
    for (const enemy of game.enemies) {
      if (enemy.dead) continue;
      if (projectile.kind === "star") {
        if (distance(projectile.x, projectile.y, enemy.x, enemy.y) <= projectile.radius + enemy.radius) {
          game.damageEnemy(enemy, projectile.damage, "star");
          game.addEffect("hitSpark", enemy.x, enemy.y, {});
          projectile.dead = true;
          break;
        }
      } else if (projectile.kind === "broom") {
        const dx = enemy.x - projectile.x;
        const dy = enemy.y - projectile.y;
        const localX = Math.abs(dx * Math.cos(projectile.angle) + dy * Math.sin(projectile.angle));
        const localY = Math.abs(-dx * Math.sin(projectile.angle) + dy * Math.cos(projectile.angle));
        if (localX <= projectile.width * 0.5 + enemy.radius && localY <= projectile.height * 0.5 + enemy.radius) {
          const key = `broom-${projectile.x.toFixed(0)}-${projectile.y.toFixed(0)}-${enemy.id}`;
          if (!projectile[key]) {
            projectile[key] = true;
            game.damageEnemy(enemy, projectile.damage, "broom");
            game.addEffect("broomHit", enemy.x, enemy.y, {});
          }
        }
      }
    }
  }
}


// FILE: src\ui\dom.js

const WEAPON_ICON_SHEET = "./assets/images/ui/icon.png";
const WEAPON_ICON_FRAMES = 5;

function screenVisible(element, visible) {
  element.classList.toggle("screen--visible", visible);
}

function buildWeaponIconStyle(level, color) {
  const frameIndex = Math.max(0, Math.min(WEAPON_ICON_FRAMES - 1, level - 1));
  const offset = (frameIndex / (WEAPON_ICON_FRAMES - 1)) * 100;
  return [
    `background-color:${color}`,
    `background-image:url(${WEAPON_ICON_SHEET})`,
    "background-repeat:no-repeat",
    `background-size:${WEAPON_ICON_FRAMES * 100}% 100%`,
    `background-position:${offset}% 50%`
  ].join(";");
}

function createUiBindings() {
  return {
    hpFill: document.getElementById("hp-fill"),
    hpText: document.getElementById("hp-text"),
    xpFill: document.getElementById("xp-fill"),
    xpText: document.getElementById("xp-text"),
    levelText: document.getElementById("level-text"),
    timeText: document.getElementById("time-text"),
    scoreText: document.getElementById("score-text"),
    stateText: document.getElementById("state-text"),
    weaponsList: document.getElementById("weapons-list"),
    titleScreen: document.getElementById("title-screen"),
    levelupScreen: document.getElementById("levelup-screen"),
    levelupChoices: document.getElementById("levelup-choices"),
    gameoverScreen: document.getElementById("gameover-screen"),
    finalStats: document.getElementById("final-stats"),
    pausePill: document.getElementById("pause-pill"),
    startBtn: document.getElementById("start-btn"),
    debugBtn: document.getElementById("debug-btn"),
    retryBtn: document.getElementById("retry-btn"),
    titleBtn: document.getElementById("title-btn")
  };
}

function updateHud(ui, game) {
  const hpRatio = game.player ? game.player.hp / game.player.maxHp : 1;
  const xpRatio = game.xpNext > 0 ? game.xp / game.xpNext : 0;
  ui.hpFill.style.width = `${Math.max(0, Math.min(100, hpRatio * 100))}%`;
  ui.hpText.textContent = `${Math.ceil(game.player?.hp ?? 0)} / ${Math.ceil(game.player?.maxHp ?? 0)}`;
  ui.xpFill.style.width = `${Math.max(0, Math.min(100, xpRatio * 100))}%`;
  ui.xpText.textContent = `${Math.floor(game.xp)} / ${game.xpNext}`;
  ui.levelText.textContent = String(game.level);
  ui.timeText.textContent = formatTime(game.elapsed);
  ui.scoreText.textContent = String(Math.floor(game.score));
  ui.stateText.textContent = game.mode.toUpperCase();
  ui.pausePill.classList.toggle("is-visible", game.mode === GAME_MODES.PAUSED);

  const ownedWeapons = Object.entries(game.weapons).filter(([, level]) => level > 0);
  ui.weaponsList.innerHTML = ownedWeapons
    .map(([key, level]) => {
      const def = WEAPON_DEFS[key];
      return `
        <div class="weapon-row">
          <div class="weapon-row__icon" style="${buildWeaponIconStyle(level, def.iconColor)}"></div>
          <div class="weapon-row__meta">
            <span class="weapon-row__name">${def.name}</span>
            <span class="weapon-row__level">Lv.${level} / 5</span>
          </div>
        </div>
      `;
    })
    .join("");
}

function syncScreens(ui, game) {
  screenVisible(ui.titleScreen, game.mode === GAME_MODES.TITLE);
  screenVisible(ui.levelupScreen, game.mode === GAME_MODES.LEVEL_UP);
  screenVisible(ui.gameoverScreen, game.mode === GAME_MODES.GAME_OVER);
}

function renderLevelChoices(ui, choices, onSelect) {
  ui.levelupChoices.innerHTML = "";
  choices.forEach((choice) => {
    const card = document.createElement("div");
    card.className = "choice-card";
    const iconHtml = choice.kind === "weapon"
      ? `<div class="choice-card__icon" style="${buildWeaponIconStyle(choice.iconLevel ?? 1, choice.iconColor ?? "#7cf4ff")}"></div>`
      : "";
    card.innerHTML = `
      <div class="choice-card__header">
        ${iconHtml}
        <h3>${choice.title}</h3>
      </div>
      <p>${choice.description}</p>
      <button class="btn btn--primary">Select</button>
    `;
    card.querySelector("button").addEventListener("click", () => onSelect(choice));
    ui.levelupChoices.appendChild(card);
  });
}

function renderGameOver(ui, game) {
  ui.finalStats.textContent = `Survival ${formatTime(game.elapsed)} / Score ${Math.floor(game.score)} / Lv.${game.level}`;
}


// FILE: src\game\Renderer.js

class Renderer {
  constructor(ctx, assetManager, config) {
    this.ctx = ctx;
    this.assetManager = assetManager;
    this.config = config;
  }

  render(game) {
    const { ctx } = this;
    const { width, height } = this.config.viewport;
    ctx.clearRect(0, 0, width, height);
    this.drawStage(game);
    ctx.save();
    ctx.translate(-game.camera.x, -game.camera.y);
    this.drawZones(game);
    this.drawPickups(game);
    this.drawProjectiles(game);
    this.drawEnemies(game);
    this.drawCats(game);
    this.drawPlayer(game);
    this.drawEffects(game);
    this.drawFloatingTexts(game);
    ctx.restore();
    this.drawFrame(game);
    if (game.mode === GAME_MODES.TITLE) this.drawTitleBackdrop();
  }

  drawStage(game) {
    const { ctx } = this;
    const floorImage = this.assetManager.getImage("stage.floor");
    const { width, height } = this.config.viewport;
    const world = this.config.world;
    const top = game.camera.y;
    ctx.fillStyle = "#081523";
    ctx.fillRect(0, 0, width, height);
    if (floorImage) {
      const pattern = ctx.createPattern(floorImage, "repeat");
      if (pattern) {
        const parallaxX = game.camera.x;
        const parallaxY = game.camera.y;
        const tileWidth = floorImage.width || 512;
        const tileHeight = floorImage.height || 512;
        const offsetX = -(((parallaxX % tileWidth) + tileWidth) % tileWidth);
        const offsetY = -(((parallaxY % tileHeight) + tileHeight) % tileHeight);
        ctx.save();
        ctx.fillStyle = pattern;
        ctx.translate(offsetX, offsetY);
        ctx.fillRect(-tileWidth, -tileHeight, width + tileWidth * 2, height + tileHeight * 2);
        ctx.restore();
      }
    } else {
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, "#0c2033");
      grad.addColorStop(1, "#07111e");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
      for (let y = -((top % 80) + 80); y < height + 80; y += 80) {
        ctx.strokeStyle = "rgba(124, 244, 255, 0.05)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    const wallImage = this.assetManager.getImage("stage.wall");
    const leftWallX = -game.camera.x;
    const rightWallX = world.width - world.wallThickness - game.camera.x;
    if (wallImage) {
      ctx.drawImage(wallImage, leftWallX, 0, world.wallThickness, height);
      ctx.drawImage(wallImage, rightWallX, 0, world.wallThickness, height);
    } else {
      const wallGradient = ctx.createLinearGradient(0, 0, world.wallThickness, 0);
      wallGradient.addColorStop(0, "#17222d");
      wallGradient.addColorStop(1, "#2c4457");
      ctx.fillStyle = wallGradient;
      ctx.fillRect(leftWallX, 0, world.wallThickness, height);
      ctx.fillRect(rightWallX, 0, world.wallThickness, height);
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      ctx.fillRect(leftWallX + world.wallThickness - 8, 0, 8, height);
      ctx.fillRect(rightWallX, 0, 8, height);
    }
  }

  drawZones(game) {
    const { ctx } = this;
    const bubbleLevel = game.weapons.bubble;
    if (bubbleLevel > 0) {
      const stats = WEAPON_DEFS.bubble.levels[bubbleLevel - 1];
      const radius = stats.radius;
      const bubbleScale = 1 + Math.sin(game.bubblePulse) * 0.04;
      const shimmer = 0.84 + Math.sin(game.bubblePulse) * 0.06;
      const bubbleImage = this.assetManager.getImage("weapon.bubble");
      const bubbleLayout = SPRITE_LAYOUTS["weapon.bubble"];
      if (bubbleImage && bubbleLayout) {
        const drawSize = radius * 2 * bubbleScale;
        ctx.save();
        ctx.globalAlpha = shimmer;
        ctx.drawImage(
          bubbleImage,
          game.player.x - drawSize * bubbleLayout.anchorX,
          game.player.y - drawSize * bubbleLayout.anchorY,
          drawSize,
          drawSize
        );
        ctx.restore();
      }
    }

    for (const zone of game.zones) {
      if (zone.kind === "fire") {
        const molotovSheet = this.assetManager.getImage("weapon.molotov");
        const molotovLayout = SPRITE_LAYOUTS["weapon.molotov"];
        const grad = ctx.createRadialGradient(zone.x, zone.y, 8, zone.x, zone.y, zone.radius);
        grad.addColorStop(0, "rgba(255,240,170,0.45)");
        grad.addColorStop(0.4, "rgba(255,124,55,0.35)");
        grad.addColorStop(1, "rgba(255,50,50,0.05)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(zone.x, zone.y, zone.radius, 0, Math.PI * 2);
        ctx.fill();
        if (molotovSheet && molotovLayout) {
          const frameWidth = Math.floor(molotovSheet.width / molotovLayout.columns);
          const frameHeight = Math.floor(molotovSheet.height / molotovLayout.rows);
          const scale = (zone.radius * 2) / frameWidth;
          const drawWidth = frameWidth * scale;
          const drawHeight = frameHeight * scale;
          ctx.drawImage(
            molotovSheet,
            molotovLayout.landedFrame * frameWidth,
            0,
            frameWidth,
            frameHeight,
            zone.x - drawWidth * molotovLayout.anchorX,
            zone.y - drawHeight * molotovLayout.anchorY,
            drawWidth,
            drawHeight
          );
        }
      } else if (zone.kind === "poopWarning") {
        const lifeRatio = clamp(zone.elapsed / zone.delay, 0, 1);
        ctx.strokeStyle = `rgba(255, 193, 78, ${0.45 + lifeRatio * 0.4})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(zone.x, zone.y, zone.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "rgba(255, 193, 78, 0.12)";
        ctx.fill();
        this.drawPoopSprite(zone.x, zone.y - 165 + lifeRatio * 165, 68, lifeRatio * 0.2, lifeRatio);
      } else if (zone.kind === "penlight") {
        this.drawPenlightSlash(game, zone, 1);
      } else if (zone.kind === "penlightAfter") {
        this.drawPenlightSlash(game, zone, 0.45);
      }
    }
  }

  drawPickups(game) {
    const { ctx } = this;
    for (const pickup of game.pickups) {
      if (pickup.kind === "xp") {
        const img = this.assetManager.getImage("item.xp");
        if (img) {
          ctx.drawImage(img, pickup.x - 12, pickup.y - 12, 24, 24);
        } else {
          ctx.fillStyle = "#6af4c8";
          ctx.beginPath();
          ctx.moveTo(pickup.x, pickup.y - 10);
          ctx.lineTo(pickup.x + 10, pickup.y);
          ctx.lineTo(pickup.x, pickup.y + 10);
          ctx.lineTo(pickup.x - 10, pickup.y);
          ctx.closePath();
          ctx.fill();
        }
      } else {
        const img = this.assetManager.getImage("item.cola");
        if (img) {
          ctx.drawImage(img, pickup.x - 18, pickup.y - 18, 36, 36);
        } else {
          ctx.fillStyle = "#ff647c";
          ctx.fillRect(pickup.x - 10, pickup.y - 14, 20, 28);
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(pickup.x - 3, pickup.y - 20, 6, 8);
        }
      }
    }
  }

  drawProjectiles(game) {
    for (const projectile of game.projectiles) {
      if (projectile.kind === "star") this.drawStar(projectile);
      if (projectile.kind === "broom") this.drawBroom(projectile);
      if (projectile.kind === "molotovBottle") this.drawMolotov(projectile);
    }
  }

  drawEnemies(game) {
    const { ctx } = this;
    for (const enemy of game.enemies) {
      const image = this.assetManager.getImage(enemy.asset);
      ctx.save();
      if (enemy.flash > 0) ctx.globalAlpha = 0.8 + Math.sin(enemy.flash * 30) * 0.2;
      if (image) {
        ctx.drawImage(image, enemy.x - enemy.radius, enemy.y - enemy.radius, enemy.radius * 2, enemy.radius * 2);
      } else {
        ctx.fillStyle = enemy.color;
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      const hpRatio = clamp(enemy.hp / enemy.maxHp, 0, 1);
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.fillRect(enemy.x - enemy.radius, enemy.y - enemy.radius - 10, enemy.radius * 2, 4);
      ctx.fillStyle = "#ff7c7c";
      ctx.fillRect(enemy.x - enemy.radius, enemy.y - enemy.radius - 10, enemy.radius * 2 * hpRatio, 4);
    }
  }

  drawCats(game) {
    const { ctx } = this;
    const sheet = this.assetManager.getImage("weapon.cat");
    const layout = SPRITE_LAYOUTS["weapon.cat"];
    for (const cat of game.cats) {
      if (sheet && layout) {
        const frameWidth = Math.floor(sheet.width / layout.columns);
        const frameHeight = Math.floor(sheet.height / layout.rows);
        const moving = cat.attackCooldown > 0 || cat.comboHitsLeft > 0 || cat.flash > 0;
        const sequence = moving ? layout.runFrames : [layout.idleFrame];
        const frame = sequence[Math.floor(game.elapsed * layout.fps) % sequence.length];
        const drawWidth = frameWidth * layout.scale;
        const drawHeight = frameHeight * layout.scale;
        ctx.save();
        ctx.translate(cat.x, cat.y);
        ctx.scale((cat.facingX ?? 1) * (cat.flash > 0 ? 1.08 : 1), cat.flash > 0 ? 1.08 : 1);
        if (cat.flash > 0) ctx.globalAlpha = 0.92;
        ctx.drawImage(
          sheet,
          frame * frameWidth,
          0,
          frameWidth,
          frameHeight,
          -drawWidth * layout.anchorX,
          -drawHeight * layout.anchorY,
          drawWidth,
          drawHeight
        );
        ctx.restore();
        continue;
      }

      ctx.save();
      ctx.translate(cat.x, cat.y);
      ctx.scale(cat.flash > 0 ? 1.08 : 1, cat.flash > 0 ? 1.08 : 1);
      ctx.fillStyle = "#f7c9ff";
      ctx.beginPath();
      ctx.arc(0, 2, cat.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-12, -10);
      ctx.lineTo(-4, -26);
      ctx.lineTo(2, -10);
      ctx.moveTo(12, -10);
      ctx.lineTo(4, -26);
      ctx.lineTo(-2, -10);
      ctx.fill();
      ctx.restore();
    }
  }

  drawPlayer(game) {
    const { ctx } = this;
    const player = game.player;
    const sheet = this.assetManager.getImage("player.sheet");
    const image = this.assetManager.getImage("player.core");
    ctx.save();
    ctx.translate(player.x, player.y);
    if (player.flash > 0) ctx.globalAlpha = 0.7;

    if (sheet) {
      const layout = SPRITE_LAYOUTS["player.sheet"];
      const frameWidth = Math.floor(sheet.width / layout.columns);
      const frameHeight = Math.floor(sheet.height / layout.rows);
      const moving = Math.hypot(player.velocityX, player.velocityY) > 8;
      const sequence = moving ? layout.runFrames : [layout.idleFrame];
      const frame = sequence[Math.floor(game.elapsed * layout.fps) % sequence.length];
      const drawWidth = frameWidth * layout.scale;
      const drawHeight = frameHeight * layout.scale;
      if (player.lastMoveX < -0.1) ctx.scale(-1, 1);
      ctx.drawImage(
        sheet,
        frame * frameWidth,
        0,
        frameWidth,
        frameHeight,
        -drawWidth * layout.anchorX,
        -drawHeight * layout.anchorY,
        drawWidth,
        drawHeight
      );
      ctx.restore();
      return;
    }

    if (image) {
      ctx.drawImage(image, -player.radius, -player.radius, player.radius * 2, player.radius * 2);
    } else {
      ctx.fillStyle = "#8ee8ff";
      ctx.beginPath();
      ctx.arc(0, 0, player.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fef3c7";
      ctx.beginPath();
      ctx.arc(0, -3, player.radius * 0.44, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  drawEffects(game) {
    const { ctx } = this;
    for (const effect of game.effects) {
      const t = clamp(effect.life / effect.maxLife, 0, 1);
      if (["starBurst", "hitSpark", "broomHit", "catSlash"].includes(effect.kind)) {
        ctx.strokeStyle = `rgba(255,255,255,${t})`;
        ctx.lineWidth = 2;
        for (let i = 0; i < 4; i += 1) {
          const angle = effect.seed + i * (Math.PI / 2);
          ctx.beginPath();
          ctx.moveTo(effect.x, effect.y);
          ctx.lineTo(effect.x + Math.cos(angle) * (6 + (1 - t) * 14), effect.y + Math.sin(angle) * (6 + (1 - t) * 14));
          ctx.stroke();
        }
      } else if (effect.kind === "fireBurst") {
        ctx.fillStyle = `rgba(255, 144, 55, ${t * 0.4})`;
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, 20 + (1 - t) * 46, 0, Math.PI * 2);
        ctx.fill();
      } else if (effect.kind === "penlight") {
        ctx.strokeStyle = `rgba(141,255,253,${t * 0.35})`;
        ctx.lineWidth = Math.max(6, effect.data.thickness * 0.25);
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, effect.data.length * 0.5, effect.data.startAngle, effect.data.endAngle);
        ctx.stroke();
      } else if (effect.kind === "poopBurst") {
        ctx.fillStyle = `rgba(162, 106, 61, ${t * 0.65})`;
        this.drawPoopSprite(effect.x, effect.y, 96 + (1 - t) * 36, 0, t, 1 - t);
      } else if (["heal", "levelup"].includes(effect.kind)) {
        ctx.strokeStyle = effect.kind === "heal" ? `rgba(134, 239, 172, ${t})` : `rgba(124, 244, 255, ${t})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, 16 + (1 - t) * (effect.kind === "heal" ? 34 : 60), 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }

  drawFloatingTexts(game) {
    const { ctx } = this;
    for (const text of game.floatingTexts) {
      ctx.fillStyle = text.color;
      ctx.font = `${text.size}px ${getComputedStyle(document.body).fontFamily}`;
      ctx.textAlign = "center";
      ctx.fillText(text.text, text.x, text.y);
    }
  }

  drawFrame(game) {
    const { ctx } = this;
    const { width, height } = this.config.viewport;
    const vignette = ctx.createRadialGradient(width / 2, height / 2, height * 0.2, width / 2, height / 2, height * 0.72);
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(1, "rgba(0,0,0,0.22)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
    const progress = clamp(game.elapsed / 600, 0, 1);
    ctx.fillStyle = "rgba(124,244,255,0.12)";
    ctx.fillRect(12, height - 8, (width - 24) * progress, 4);
  }

  drawTitleBackdrop() {
    const { ctx } = this;
    const { width, height } = this.config.viewport;
    ctx.fillStyle = "rgba(5, 15, 28, 0.22)";
    ctx.fillRect(0, 0, width, height);
  }

  drawStar(projectile) {
    const { ctx } = this;
    ctx.save();
    ctx.translate(projectile.x, projectile.y);
    ctx.rotate(projectile.angle + Math.PI / 2);
    ctx.fillStyle = "#ffe27a";
    ctx.beginPath();
    for (let i = 0; i < 10; i += 1) {
      const r = i % 2 === 0 ? projectile.radius : projectile.radius * 0.48;
      const a = -Math.PI / 2 + i * (Math.PI / 5);
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawBroom(projectile) {
    const { ctx } = this;
    const image = this.assetManager.getImage("weapon.broom");
    const layout = SPRITE_LAYOUTS["weapon.broom"];
    ctx.save();
    ctx.translate(projectile.x, projectile.y);
    ctx.rotate(projectile.angle + Math.PI / 2);
    if (image && layout) {
      const drawWidth = Math.max(projectile.width * 1.1, image.width * layout.scale * 0.5);
      const drawHeight = drawWidth * (image.height / image.width);
      ctx.drawImage(
        image,
        -drawWidth * layout.anchorX,
        -drawHeight * layout.anchorY,
        drawWidth,
        drawHeight
      );
      ctx.restore();
      return;
    }
    ctx.fillStyle = "#b37f48";
    ctx.fillRect(-projectile.width * 0.45, -4, projectile.width * 0.55, 8);
    ctx.fillStyle = "#ffd38c";
    ctx.fillRect(projectile.width * 0.08, -projectile.height / 2, projectile.width * 0.4, projectile.height);
    ctx.restore();
  }

  drawMolotov(projectile) {
    const { ctx } = this;
    const image = this.assetManager.getImage("weapon.molotov");
    const layout = SPRITE_LAYOUTS["weapon.molotov"];
    ctx.save();
    ctx.translate(projectile.x, projectile.y);
    if (image && layout) {
      const frameWidth = Math.floor(image.width / layout.columns);
      const frameHeight = Math.floor(image.height / layout.rows);
      const progress = Math.max(0, Math.min(0.999, projectile.elapsed / projectile.duration));
      const sequence = layout.throwFrames;
      const frame = sequence[Math.min(sequence.length - 1, Math.floor(progress * sequence.length))];
      const drawWidth = frameWidth * layout.scale;
      const drawHeight = frameHeight * layout.scale;
      const angle = Math.atan2(projectile.targetY - projectile.startY, projectile.targetX - projectile.startX);
      ctx.rotate(angle + Math.PI / 2);
      ctx.drawImage(
        image,
        frame * frameWidth,
        0,
        frameWidth,
        frameHeight,
        -drawWidth * layout.anchorX,
        -drawHeight * layout.anchorY,
        drawWidth,
        drawHeight
      );
      ctx.restore();
      return;
    }
    ctx.fillStyle = "#8a4b2d";
    ctx.fillRect(-7, -10, 14, 20);
    ctx.fillStyle = "#ffd166";
    ctx.fillRect(-3, -15, 6, 6);
    ctx.restore();
  }
  drawPenlightSlash(game, zone, alpha) {
    const { ctx } = this;
    const image = this.assetManager.getImage("weapon.penlight");
    const layout = SPRITE_LAYOUTS["weapon.penlight"];
    const angle = zone.angle ?? (zone.startAngle + (zone.endAngle - zone.startAngle) * clamp(1 - zone.life / zone.maxLife, 0, 1));
    const drawLength = zone.length;
    if (image && layout) {
      const frameWidth = Math.floor(image.width / (layout.columns ?? 1));
      const frameHeight = Math.floor(image.height / (layout.rows ?? 1));
      const frame = game.weapons.penlight >= 5 ? (layout.lv5Frame ?? 1) : (layout.normalFrame ?? 0);
      const drawHeight = drawLength * 1.12;
      const drawWidth = Math.max(zone.thickness * 1.5, frameWidth * (drawHeight / frameHeight));
      ctx.save();
      ctx.translate(zone.x, zone.y);
      ctx.rotate(angle + Math.PI / 2);
      ctx.globalAlpha *= alpha;
      ctx.drawImage(
        image,
        frame * frameWidth,
        0,
        frameWidth,
        frameHeight,
        -drawWidth * layout.anchorX,
        -drawHeight * layout.anchorY,
        drawWidth,
        drawHeight
      );
      ctx.restore();
      return;
    }
    const tipX = zone.x + Math.cos(angle) * drawLength;
    const tipY = zone.y + Math.sin(angle) * drawLength;
    ctx.save();
    ctx.strokeStyle = `rgba(141, 255, 253, ${0.85 * alpha})`;
    ctx.lineWidth = zone.thickness;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(zone.x, zone.y);
    ctx.lineTo(tipX, tipY);
    ctx.stroke();
    ctx.restore();
  }
  drawPoopSprite(x, y, size, rotation = 0, alpha = 1, progress = 0) {
    const { ctx } = this;
    const image = this.assetManager.getImage("weapon.poop");
    const layout = SPRITE_LAYOUTS["weapon.poop"];
    if (image && layout) {
      const frameWidth = Math.floor(image.width / layout.columns);
      const frameHeight = Math.floor(image.height / layout.rows);
      const sequence = layout.frames ?? [0];
      const index = Math.min(sequence.length - 1, Math.max(0, Math.floor(progress * sequence.length)));
      const frame = sequence[index];
      const drawWidth = size;
      const drawHeight = size * (frameHeight / frameWidth);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.globalAlpha *= alpha;
      ctx.drawImage(
        image,
        frame * frameWidth,
        0,
        frameWidth,
        frameHeight,
        -drawWidth * layout.anchorX,
        -drawHeight * layout.anchorY,
        drawWidth,
        drawHeight
      );
      ctx.restore();
      return;
    }
    this.drawPoopBlob(x, y, size * 0.48);
  }

  drawPoopBlob(x, y, size) {
    const { ctx } = this;
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = "#a26a3d";
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.8);
    ctx.bezierCurveTo(size * 0.55, -size * 0.42, size * 0.58, size * 0.1, 0, size * 0.58);
    ctx.bezierCurveTo(-size * 0.58, size * 0.1, -size * 0.55, -size * 0.42, 0, -size * 0.8);
    ctx.fill();
    ctx.restore();
  }
}


// FILE: src\game\Game.js

class Game {
  constructor(canvas, input, ui) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.config = GAME_CONFIG;
    this.input = input;
    this.ui = ui;
    this.assetManager = new AssetManager(ASSET_CATALOG);
    this.audio = new AudioManager(this.assetManager);
    this.renderer = new Renderer(this.ctx, this.assetManager, this.config);
    this.lastTimestamp = 0;
    this.accumulator = 0;
    this.fixedDt = 1 / 60;
    this.hitSeCooldown = 0;
    this.bubblePulse = 0;
    this.camera = { x: 0, y: 0 };
    this.initializeState();
  }

  async init() {
    await this.assetManager.loadAll();
    this.audio.playBgm("bgm.title");
    this.render();
    this.refreshUi();
  }

  initializeState() {
    this.mode = GAME_MODES.TITLE;
    this.debugMode = false;
    this.elapsed = 0;
    this.level = 1;
    this.xp = 0;
    this.xpNext = getXpForLevel(1);
    this.score = 0;
    this.killScore = 0;
    this.spawnTimer = 0;
    this.debugXpTimer = 0;
    this.debugXpSpot = null;
    this.player = createPlayer(this.config.player, this.config.world);
    this.enemies = [];
    this.projectiles = [];
    this.queuedStarShots = [];
    this.zones = [];
    this.pickups = [];
    this.effects = [];
    this.floatingTexts = [];
    this.cats = [];
    this.levelChoices = [];
    this.passives = { moveSpeed: 0, maxHp: 0, pickupRadius: 0, colaBoost: 0 };
    this.weapons = {};
    this.weaponTimers = {};
    for (const key of WEAPON_ORDER) {
      this.weapons[key] = WEAPON_DEFS[key].startsOwned ? 1 : 0;
      this.weaponTimers[key] = 0;
    }
    this.updateCamera(true);
  }

  startRun(debugMode = false) {
    this.initializeState();
    this.debugMode = debugMode;
    this.mode = GAME_MODES.PLAYING;
    this.audio.playBgm("bgm.stage");
    if (this.debugMode) this.setupDebugMode();
    this.addEffect("levelup", this.player.x, this.player.y, {});
    this.refreshUi();
  }

  setupDebugMode() {
    const dummy = createEnemy(ENEMY_DEFS.brute, this.player.x + 210, this.player.y - 10, 1.2);
    dummy.speed = 0;
    dummy.hp = 999999;
    dummy.maxHp = 999999;
    dummy.damagePerSecond = 0;
    dummy.xp = 0;
    dummy.isDebugDummy = true;
    this.enemies.push(dummy);
    this.debugXpSpot = { x: this.player.x - 180, y: this.player.y + 30 };
    this.debugXpTimer = 0;
    for (let i = 0; i < 8; i += 1) this.spawnDebugXpGem();
  }

  spawnDebugXpGem() {
    if (!this.debugXpSpot) return;
    this.pickups.push(
      createXpGem(
        this.debugXpSpot.x + rand(-18, 18),
        this.debugXpSpot.y + rand(-18, 18),
        10
      )
    );
  }

  updateDebugMode(dt) {
    if (!this.debugMode || !this.debugXpSpot) return;
    this.debugXpTimer -= dt;
    const xpNearSpot = this.pickups.filter(
      (pickup) =>
        !pickup.dead &&
        pickup.kind === "xp" &&
        distance(pickup.x, pickup.y, this.debugXpSpot.x, this.debugXpSpot.y) < 80
    ).length;
    while (this.debugXpTimer <= 0 && xpNearSpot + this.pickups.length < this.config.performance.maxPickups) {
      this.debugXpTimer += 0.12;
      this.spawnDebugXpGem();
      if (this.pickups.length >= this.config.performance.maxPickups) break;
    }
  }

  backToTitle() {
    this.initializeState();
    this.audio.playBgm("bgm.title");
    this.refreshUi();
  }

  ensureCat() {
    if (this.weapons.cat > 0 && this.cats.length === 0) this.cats.push(createCat(this.player));
  }

  frame = (timestamp) => {
    if (!this.lastTimestamp) this.lastTimestamp = timestamp;
    const delta = Math.min(0.033, (timestamp - this.lastTimestamp) / 1000);
    this.lastTimestamp = timestamp;
    this.advance(delta);
    requestAnimationFrame(this.frame);
  };

  advance(seconds) {
    this.accumulator += seconds;
    while (this.accumulator >= this.fixedDt) {
      this.update(this.fixedDt);
      this.accumulator -= this.fixedDt;
    }
    this.render();
    this.refreshUi();
  }

  advanceTime(ms) {
    const steps = Math.max(1, Math.round(ms / (1000 / 60)));
    for (let i = 0; i < steps; i += 1) this.update(1 / 60);
    this.render();
    this.refreshUi();
  }

  update(dt) {
    this.hitSeCooldown = Math.max(0, this.hitSeCooldown - dt);
    if (this.input.consumePressed("f")) this.toggleFullscreen();
    if (this.input.consumePressed("p") || this.input.consumePressed("escape")) {
      if (this.mode === GAME_MODES.PLAYING) this.mode = GAME_MODES.PAUSED;
      else if (this.mode === GAME_MODES.PAUSED) this.mode = GAME_MODES.PLAYING;
    }
    if (this.mode !== GAME_MODES.PLAYING) return;

    this.elapsed += dt;
    updatePlayer(this.player, this.input.getMoveVector(), dt, this.config.world);
    if (this.debugMode) this.updateDebugMode(dt);
    else this.spawnEnemies(dt);
    for (const enemy of this.enemies) {
      if (!enemy.isDebugDummy) updateEnemy(enemy, this.player, dt);
      else {
        enemy.flash = Math.max(0, enemy.flash - dt);
        for (const key of Object.keys(enemy.hitCooldowns)) {
          enemy.hitCooldowns[key] = Math.max(0, enemy.hitCooldowns[key] - dt);
        }
      }
    }
    updateWeapons(this, dt);
    updateProjectileState(this, dt);
    updateZoneState(this, dt);
    resolveProjectileHits(this);
    this.updatePickups(dt);
    this.resolveEnemyContact();
    this.updateEffects(dt);
    this.cleanup();
    this.score = this.killScore + Math.floor(this.elapsed * this.config.score.secondMultiplier);
    this.updateCamera();
    this.checkLevelUp();
  }

  spawnEnemies(dt) {
    if (this.enemies.length >= this.config.performance.maxEnemies) return;
    this.spawnTimer -= dt;
    const interval = clamp(this.config.spawn.baseInterval - this.elapsed * this.config.spawn.waveScalePerSecond, this.config.spawn.minInterval, this.config.spawn.baseInterval);
    while (this.spawnTimer <= 0) {
      this.spawnTimer += interval;
      const burst = 1 + Math.floor(this.elapsed / 38);
      for (let i = 0; i < burst; i += 1) {
        if (this.enemies.length >= this.config.performance.maxEnemies) break;
        const def = this.pickEnemyDefinition();
        const pos = this.getSpawnPosition();
        const intensity = 1 + Math.min(2.4, this.elapsed * 0.01 + this.level * 0.04);
        this.enemies.push(createEnemy(def, pos.x, pos.y, intensity));
      }
    }
  }

  pickEnemyDefinition() {
    const t = this.elapsed;
    const bag = [ENEMY_DEFS.slime, ENEMY_DEFS.bat, ...(t > 35 ? [ENEMY_DEFS.brute] : []), ...(t > 80 ? [ENEMY_DEFS.witch] : [])];
    return bag[Math.floor(Math.random() * bag.length)];
  }

  getSpawnPosition() {
    const side = Math.floor(Math.random() * 4);
    if (side === 0) return { x: this.config.world.wallThickness + 140, y: clamp(this.camera.y - 80 + rand(0, this.config.viewport.height + 160), 50, this.config.world.height - 50) };
    if (side === 1) return { x: this.config.world.width - this.config.world.wallThickness - 140, y: clamp(this.camera.y - 80 + rand(0, this.config.viewport.height + 160), 50, this.config.world.height - 50) };
    if (side === 2) return { x: rand(this.config.world.wallThickness + 110, this.config.world.width - this.config.world.wallThickness - 110), y: clamp(this.camera.y - 120, 40, this.config.world.height - 40) };
    return { x: rand(this.config.world.wallThickness + 110, this.config.world.width - this.config.world.wallThickness - 110), y: clamp(this.camera.y + this.config.viewport.height + 120, 40, this.config.world.height - 40) };
  }

  updatePickups(dt) {
    const pickupRadius = getPickupRadius(this.player);
    for (const pickup of this.pickups) {
      const dist = distance(pickup.x, pickup.y, this.player.x, this.player.y);
      if (dist < pickupRadius * 1.6) {
        const speed = dist < pickupRadius ? 560 : 220;
        pickup.x += ((this.player.x - pickup.x) / (dist || 1)) * speed * dt;
        pickup.y += ((this.player.y - pickup.y) / (dist || 1)) * speed * dt;
      }
      if (dist <= pickup.radius + this.player.radius) {
        pickup.dead = true;
        if (pickup.kind === "xp") {
          this.xp += pickup.amount;
          this.addFloatingText(`+${pickup.amount} XP`, this.player.x, this.player.y - 36, "#6af4c8", 14);
        } else {
          const healAmount = Math.round(pickup.amount * (1 + this.passives.colaBoost * 0.35));
          this.player.hp = Math.min(this.player.maxHp, this.player.hp + healAmount);
          this.addFloatingText(`+${healAmount} HP`, this.player.x, this.player.y - 50, "#86efac", 16);
          this.addEffect("heal", this.player.x, this.player.y, {});
          this.audio.playSe("se.heal", 0.3);
        }
      }
    }
  }

  resolveEnemyContact() {
    for (const enemy of this.enemies) {
      if (!enemy.dead && distance(enemy.x, enemy.y, this.player.x, this.player.y) <= enemy.radius + this.player.radius) {
        this.damagePlayer(enemy.damagePerSecond * 0.8);
      }
    }
  }

  damageEnemy(enemy, amount) {
    if (enemy.dead) return;
    enemy.flash = 0.12;
    this.addFloatingText(`${Math.round(amount)}`, enemy.x, enemy.y - enemy.radius - 8, "#ffffff", 13);
    if (this.hitSeCooldown <= 0) {
      this.audio.playSe("se.hit", 0.14);
      this.hitSeCooldown = 0.06;
    }
    if (enemy.isDebugDummy) return;

    enemy.hp -= amount;
    if (enemy.hp <= 0) {
      enemy.dead = true;
      this.killScore += enemy.xp * this.config.score.enemyMultiplier;
      this.pickups.push(createXpGem(enemy.x, enemy.y, enemy.xp));
      if (Math.random() < this.config.cola.dropChance) {
        this.pickups.push(createCola(enemy.x + rand(-10, 10), enemy.y + rand(-10, 10), this.config.cola.healAmount));
      }
      this.addEffect("hitSpark", enemy.x, enemy.y, {});
    }
  }

  damagePlayer(amount) {
    if (this.player.hitCooldown > 0) return;
    this.player.hp = Math.max(0, this.player.hp - amount);
    this.player.hitCooldown = this.config.player.contactInvuln;
    this.player.flash = 0.16;
    if (this.player.hp <= 0) {
      this.mode = GAME_MODES.GAME_OVER;
      this.audio.playSe("se.gameover", 0.38);
      renderGameOver(this.ui, this);
    }
  }

  checkLevelUp() {
    if (this.mode !== GAME_MODES.PLAYING || this.xp < this.xpNext) return;
    this.xp -= this.xpNext;
    this.level += 1;
    this.xpNext = getXpForLevel(this.level);
    this.levelChoices = buildLevelChoices(this);
    this.mode = GAME_MODES.LEVEL_UP;
    this.addEffect("levelup", this.player.x, this.player.y, {});
    this.audio.playSe("se.levelup", 0.4);
    renderLevelChoices(this.ui, this.levelChoices, (choice) => this.selectLevelChoice(choice));
  }

  selectLevelChoice(choice) {
    applyChoice(this, choice);
    this.mode = GAME_MODES.PLAYING;
  }

  updateEffects(dt) {
    for (const effect of this.effects) effect.life -= dt;
    for (const text of this.floatingTexts) {
      text.life -= dt;
      text.y -= text.velocity * dt;
      text.velocity *= 0.96;
      text.size = Math.max(10, text.size - dt * 4);
    }
  }

  cleanup() {
    this.enemies = this.enemies.filter((enemy) => !enemy.dead);
    this.projectiles = this.projectiles.filter((projectile) => !projectile.dead);
    this.zones = this.zones.filter((zone) => !zone.dead);
    this.pickups = this.pickups.filter((pickup) => !pickup.dead).slice(-this.config.performance.maxPickups);
    this.effects = this.effects.filter((effect) => effect.life > 0).slice(-this.config.performance.maxEffects);
    this.floatingTexts = this.floatingTexts.filter((text) => text.life > 0).slice(-this.config.performance.maxTexts);
  }

  addEffect(kind, x, y, data) {
    const maxLife = kind === "levelup" ? 0.7 : 0.24;
    this.effects.push({ kind, x, y, data, life: maxLife, maxLife, seed: Math.random() * Math.PI * 2 });
  }

  addFloatingText(text, x, y, color = "#ffffff", size = 14) {
    this.floatingTexts.push({ text, x, y, color, size, life: 0.65, velocity: 42 });
  }

  findNearestEnemy(x, y, maxDistance = Infinity) {
    let best = null;
    let bestDist = maxDistance;
    for (const enemy of this.enemies) {
      if (enemy.dead) continue;
      const dist = distance(enemy.x, enemy.y, x, y);
      if (dist < bestDist) {
        bestDist = dist;
        best = enemy;
      }
    }
    return best;
  }

  updateCamera(immediate = false) {
    const targetX = clamp(this.player.x - this.config.viewport.width / 2, 0, this.config.world.width - this.config.viewport.width);
    const targetY = clamp(this.player.y - this.config.viewport.height / 2, 0, this.config.world.height - this.config.viewport.height);
    if (immediate) {
      this.camera.x = targetX;
      this.camera.y = targetY;
    } else {
      this.camera.x += (targetX - this.camera.x) * 0.12;
      this.camera.y += (targetY - this.camera.y) * 0.12;
    }
  }

  refreshUi() {
    updateHud(this.ui, this);
    syncScreens(this.ui, this);
  }

  render() {
    this.renderer.render(this);
  }

  renderGameToText() {
    const visibleEnemies = this.enemies
      .filter((enemy) => enemy.x >= this.camera.x && enemy.x <= this.camera.x + this.config.viewport.width && enemy.y >= this.camera.y && enemy.y <= this.camera.y + this.config.viewport.height)
      .slice(0, 12)
      .map((enemy) => ({ type: enemy.type, x: Math.round(enemy.x), y: Math.round(enemy.y), hp: enemy.isDebugDummy ? "debug-infinite" : Math.round(enemy.hp) }));

    return JSON.stringify({
      coordinateSystem: "origin at top-left, +x right, +y down",
      mode: this.mode,
      debugMode: this.debugMode,
      player: { x: Math.round(this.player.x), y: Math.round(this.player.y), hp: Math.round(this.player.hp), level: this.level },
      camera: { x: Math.round(this.camera.x), y: Math.round(this.camera.y) },
      time: formatTime(this.elapsed),
      score: Math.floor(this.score),
      enemiesVisible: visibleEnemies,
      enemyCount: this.enemies.length,
      pickupCount: this.pickups.length,
      debugXpSpot: this.debugXpSpot ? { x: Math.round(this.debugXpSpot.x), y: Math.round(this.debugXpSpot.y) } : null,
      weapons: Object.fromEntries(Object.entries(this.weapons).filter(([, level]) => level > 0)),
      levelChoices: this.levelChoices.map((choice) => choice.title)
    });
  }

  toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
      return;
    }
    this.canvas.requestFullscreen?.().catch(() => {});
  }
}


// FILE: src\main.js

const canvas = document.getElementById("game-canvas");
const ui = createUiBindings();
const input = new InputManager(canvas, document.getElementById("joystick-base"), document.getElementById("joystick-stick"));
const game = new Game(canvas, input, ui);

ui.startBtn.addEventListener("click", () => game.startRun());
ui.debugBtn.addEventListener("click", () => game.startRun(true));
ui.retryBtn.addEventListener("click", () => game.startRun(game.debugMode));
ui.titleBtn.addEventListener("click", () => game.backToTitle());

window.game = game;
window.render_game_to_text = () => game.renderGameToText();
window.advanceTime = (ms) => game.advanceTime(ms);

game.init().then(() => {
  requestAnimationFrame(game.frame);
});


})();
