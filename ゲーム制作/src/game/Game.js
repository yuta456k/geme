import { GAME_CONFIG, GAME_MODES, WEAPON_ORDER } from "../data/constants.js";
import { WEAPON_DEFS } from "../data/weapons.js";
import { createCat } from "../entities/CatMinion.js";
import { createEnemy, updateEnemy } from "../entities/Enemy.js";
import { createCola, createXpGem } from "../entities/Pickup.js";
import { createPlayer, getPickupRadius, updatePlayer } from "../entities/Player.js";
import { ENEMY_DEFS } from "../data/enemies.js";
import { getXpForLevel, applyChoice, buildLevelChoices } from "../systems/LevelSystem.js";
import { resolveProjectileHits, updateProjectileState, updateWeapons, updateZoneState } from "../systems/WeaponSystem.js";
import { clamp, distance, formatTime, rand } from "../utils/math.js";
import { renderGameOver, renderLevelChoices, syncScreens, updateHud } from "../ui/dom.js";
import { AudioManager } from "./AudioManager.js";
import { AssetManager } from "./AssetManager.js";
import { Renderer } from "./Renderer.js";
import { ASSET_CATALOG } from "../data/assets.js";

export class Game {
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
