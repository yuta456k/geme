export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
export const lerp = (a, b, t) => a + (b - a) * t;
export const rand = (min, max) => min + Math.random() * (max - min);
export const randInt = (min, max) => Math.floor(rand(min, max + 1));
export const distanceSq = (ax, ay, bx, by) => {
  const dx = bx - ax;
  const dy = by - ay;
  return dx * dx + dy * dy;
};
export const distance = (ax, ay, bx, by) => Math.sqrt(distanceSq(ax, ay, bx, by));
export const length = (x, y) => Math.sqrt(x * x + y * y);
export const normalize = (x, y) => {
  const len = length(x, y) || 1;
  return { x: x / len, y: y / len };
};
export const angleToVector = (angle) => ({ x: Math.cos(angle), y: Math.sin(angle) });
export const vectorToAngle = (x, y) => Math.atan2(y, x);
export const rotateTowards = (currentAngle, targetAngle, maxStep) => {
  let diff = ((targetAngle - currentAngle + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
  diff = clamp(diff, -maxStep, maxStep);
  return currentAngle + diff;
};
export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${secs}`;
};
