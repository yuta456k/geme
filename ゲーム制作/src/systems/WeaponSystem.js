import { WEAPON_DEFS } from "../data/weapons.js";
import { updateCat } from "../entities/CatMinion.js";
import { angleToVector, clamp, distance, lerp, rand, rotateTowards } from "../utils/math.js";

const STAR_BURST_INTERVAL = 0.045;

export function updateWeapons(game, dt) {
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

export function updateProjectileState(game, dt) {
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

export function updateZoneState(game, dt) {
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

export function resolveProjectileHits(game) {
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
