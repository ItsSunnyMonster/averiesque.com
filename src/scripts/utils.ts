export function randomRange(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function lerp(from: number, to: number, t: number) {
  if (t > 1) t = 1;
  if (t < 0) t = 0;
  return to * t + from * (1 - t);
}

export function distance(x1: number, y1: number, x2: number, y2: number) {
  return Math.hypot(x2 - x1, y2 - y1);
}

export type RectLike = Pick<DOMRect, "left" | "right" | "top" | "bottom">;

export function distanceFromRect(x: number, y: number, rect: RectLike): number {
  const nearestX = Math.max(rect.left, Math.min(x, rect.right));
  const nearestY = Math.max(rect.top, Math.min(y, rect.bottom));

  const dx = x - nearestX;
  const dy = y - nearestY;

  return Math.hypot(dx, dy);
}

// Inverse falloff function mirrored across the y axis
export function inverseFalloff(k: number, x: number) {
  return x >= 0 ? -Math.expm1(-k * x) : Math.expm1(k * x);
}

export function isPersisted(el: HTMLElement): boolean {
  return el.closest("[data-astro-transition-persist]") !== null;
}
