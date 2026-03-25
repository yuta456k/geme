import { clamp } from "../utils/math.js";

export class InputManager {
  constructor(canvas, joystickBase, joystickStick) {
    this.canvas = canvas;
    this.keys = new Set();
    this.pressed = new Set();
    this.touchVector = { x: 0, y: 0 };
    this.joystickBase = joystickBase;
    this.joystickStick = joystickStick;
    this.pointerId = null;
    this.baseRect = null;
    this.bind();
  }

  bind() {
    window.addEventListener("keydown", (event) => {
      const key = event.key.toLowerCase();
      this.keys.add(key);
      this.pressed.add(key);
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(key)) {
        event.preventDefault();
      }
    });

    window.addEventListener("keyup", (event) => {
      this.keys.delete(event.key.toLowerCase());
    });

    const startTouch = (event) => {
      const touch = [...event.changedTouches].find((item) => item.clientX < window.innerWidth * 0.5);
      if (!touch || this.pointerId !== null) return;
      this.pointerId = touch.identifier;
      this.baseRect = this.joystickBase.getBoundingClientRect();
      this.updateTouchVector(touch.clientX, touch.clientY);
    };

    const moveTouch = (event) => {
      if (this.pointerId === null) return;
      const touch = [...event.changedTouches].find((item) => item.identifier === this.pointerId);
      if (!touch) return;
      this.updateTouchVector(touch.clientX, touch.clientY);
    };

    const endTouch = (event) => {
      if (this.pointerId === null) return;
      const touch = [...event.changedTouches].find((item) => item.identifier === this.pointerId);
      if (!touch) return;
      this.pointerId = null;
      this.touchVector.x = 0;
      this.touchVector.y = 0;
      this.joystickStick.style.transform = "translate(0px, 0px)";
    };

    window.addEventListener("touchstart", startTouch, { passive: true });
    window.addEventListener("touchmove", moveTouch, { passive: true });
    window.addEventListener("touchend", endTouch, { passive: true });
    window.addEventListener("touchcancel", endTouch, { passive: true });
  }

  updateTouchVector(clientX, clientY) {
    const rect = this.baseRect || this.joystickBase.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const max = rect.width * 0.3;
    const magnitude = Math.hypot(dx, dy) || 1;
    const clamped = Math.min(max, magnitude);
    const nx = (dx / magnitude) * clamped;
    const ny = (dy / magnitude) * clamped;
    this.touchVector.x = clamp(nx / max, -1, 1);
    this.touchVector.y = clamp(ny / max, -1, 1);
    this.joystickStick.style.transform = `translate(${nx}px, ${ny}px)`;
  }

  consumePressed(key) {
    if (!this.pressed.has(key)) return false;
    this.pressed.delete(key);
    return true;
  }

  clearPressed() {
    this.pressed.clear();
  }

  getMoveVector() {
    let x = 0;
    let y = 0;
    if (this.keys.has("a") || this.keys.has("arrowleft")) x -= 1;
    if (this.keys.has("d") || this.keys.has("arrowright")) x += 1;
    if (this.keys.has("w") || this.keys.has("arrowup")) y -= 1;
    if (this.keys.has("s") || this.keys.has("arrowdown")) y += 1;
    x += this.touchVector.x;
    y += this.touchVector.y;
    return { x: clamp(x, -1, 1), y: clamp(y, -1, 1) };
  }
}
