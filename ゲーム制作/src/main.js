import { InputManager } from "./game/InputManager.js";
import { Game } from "./game/Game.js";
import { createUiBindings, initializeUi } from "./ui/dom.js";

const canvas = document.getElementById("game-canvas");
const ui = createUiBindings();
initializeUi(ui);
const input = new InputManager(canvas, document.getElementById("joystick-base"), document.getElementById("joystick-stick"));
const game = new Game(canvas, input, ui);

ui.startBtn.addEventListener("click", () => game.startRun());
ui.debugBtn.addEventListener("click", () => game.startRun(true));
ui.retryBtn.addEventListener("click", () => game.startRun(game.debugMode));
ui.titleBtn.addEventListener("click", () => game.backToTitle());

window.game = game;
window.render_game_to_text = () => game.renderGameToText();
window.advanceTime = (ms) => game.advanceTime(ms);

game.init().then(() => {
  requestAnimationFrame(game.frame);
});
