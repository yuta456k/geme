import { PASSIVE_KEYS, WEAPON_ORDER } from "../data/constants.js";
import { PASSIVE_UPGRADES, WEAPON_DEFS } from "../data/weapons.js";

export function getXpForLevel(level) {
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

export function buildLevelChoices(game) {
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

export function applyChoice(game, choice) {
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

export function describeWeaponUpgrade(key, targetLevel) {
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
