import { GAME_MODES } from "../data/constants.js";
import { WEAPON_DEFS } from "../data/weapons.js";
import { formatTime } from "../utils/math.js";

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

export function createUiBindings() {
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

export function updateHud(ui, game) {
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

export function syncScreens(ui, game) {
  screenVisible(ui.titleScreen, game.mode === GAME_MODES.TITLE);
  screenVisible(ui.levelupScreen, game.mode === GAME_MODES.LEVEL_UP);
  screenVisible(ui.gameoverScreen, game.mode === GAME_MODES.GAME_OVER);
}

export function renderLevelChoices(ui, choices, onSelect) {
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

export function renderGameOver(ui, game) {
  ui.finalStats.textContent = `Survival ${formatTime(game.elapsed)} / Score ${Math.floor(game.score)} / Lv.${game.level}`;
}
