let nextPickupId = 1;

export function createXpGem(x, y, amount) {
  return {
    id: nextPickupId++,
    kind: "xp",
    x,
    y,
    amount,
    radius: 11,
    attractSpeed: 0,
    dead: false
  };
}

export function createCola(x, y, amount) {
  return {
    id: nextPickupId++,
    kind: "cola",
    x,
    y,
    amount,
    radius: 16,
    attractSpeed: 0,
    dead: false
  };
}
