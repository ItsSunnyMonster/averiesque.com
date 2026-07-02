export function randomRange(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function lerp(from: number, to: number, t: number) {
  return to * t + from * (1 - t);
}

export function distance(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
