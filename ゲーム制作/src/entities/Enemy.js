import { normalize } from "../utils/math.js";

let nextEnemyId = 1;

export function createEnemy(def, x, y, intensity = 1) {
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

export function updateEnemy(enemy, player, dt) {
  const dir = normalize(player.x - enemy.x, player.y - enemy.y);
  enemy.x += dir.x * enemy.speed * dt;
  enemy.y += dir.y * enemy.speed * dt;
  enemy.flash = Math.max(0, enemy.flash - dt);
  for (const key of Object.keys(enemy.hitCooldowns)) {
    enemy.hitCooldowns[key] = Math.max(0, enemy.hitCooldowns[key] - dt);
  }
}
