import { GAME_CONFIG } from "./constants.js";

const c = GAME_CONFIG.colors;

export const WEAPON_DEFS = {
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

export const PASSIVE_UPGRADES = {
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
