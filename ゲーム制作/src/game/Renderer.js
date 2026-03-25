import { GAME_MODES } from "../data/constants.js";
import { SPRITE_LAYOUTS } from "../data/assets.js";
import { WEAPON_DEFS } from "../data/weapons.js";
import { clamp } from "../utils/math.js";

export class Renderer {
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
