export function randomRange(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function lerp(from: number, to: number, t: number) {
  return to * t + from * (1 - t);
}

export function lerpVector2(
  from: [number, number],
  to: [number, number],
  t: number,
) {}
