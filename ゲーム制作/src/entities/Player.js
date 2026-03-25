import { clamp, normalize } from "../utils/math.js";

export function createPlayer(config, world) {
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

export function updatePlayer(player, inputVector, dt, world) {
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

export function getPickupRadius(player) {
  return player.pickupRadiusBase * player.pickupRadiusMultiplier;
}
