import { distance, normalize } from "../utils/math.js";

let nextCatId = 1;

export function createCat(player) {
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

export function updateCat(cat, player, target, stats, dt) {
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
