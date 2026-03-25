export const ASSET_CATALOG = {
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

export const SPRITE_LAYOUTS = {
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
