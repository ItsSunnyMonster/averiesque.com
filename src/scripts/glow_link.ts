interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  lifeRemaining: number;
  lifetime: number;
  size: number;
  initialFlickerPhase: number;
}

class Color {
  r: number;
  g: number;
  b: number;

  constructor(r: number, g: number, b: number) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  static fromArray(channels: Array<number>) {
    return new Color(channels[0]!, channels[1]!, channels[2]!);
  }

  static parseFromHex(hex: string) {
    const m = hex.match(/[\da-f]{2}/gi) || ["FF", "FF", "00"];
    return Color.fromArray(m.map((x) => parseInt(x, 16)));
  }

  lerpTo(other: Color, t: number) {
    return new Color(
      other.r * t + this.r * (1 - t),
      other.g * t + this.g * (1 - t),
      other.b * t + this.b * (1 - t),
    );
  }

  toHex() {
    function componentToHex(c: number) {
      var hex = Math.round(c).toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    }

    return (
      "#" +
      componentToHex(this.r) +
      componentToHex(this.g) +
      componentToHex(this.b)
    );
  }
}

class GlowLink {
  linkElement: HTMLAnchorElement;
  canvas: HTMLCanvasElement;
  canvasContext: CanvasRenderingContext2D;
  points: Array<Point>;

  width: number = 0;
  height: number = 0;

  previousTimestamp = 0;

  startColor: Color;
  endColor: Color;

  constructor(linkElement: HTMLAnchorElement) {
    this.linkElement = linkElement;

    const rawStartColor =
      getComputedStyle(linkElement)
        .getPropertyValue("--underline-color")
        .trim() || "#FF00FF";

    this.startColor = Color.parseFromHex(rawStartColor);

    const rawEndColor =
      getComputedStyle(linkElement)
        .getPropertyValue("--particle-fade-color")
        .trim() || "#FF00FF";

    this.endColor = Color.parseFromHex(rawEndColor);

    // Setup canvas to draw particles
    this.canvas = document.createElement("canvas");
    // === styles
    Object.assign(this.canvas.style, {
      position: "absolute",
      bottom: "-3px",
      left: "-16px",
      pointerEvents: "none",
      zIndex: "-1",
    });
    linkElement.appendChild(this.canvas);

    this.canvasContext = this.canvas.getContext("2d")!;
    this.points = [];

    this.resize();
    new ResizeObserver(this.resize.bind(this)).observe(linkElement);
    // tick is a method so we must call bind and provide which object to use as the 'this' object in the function call
    requestAnimationFrame(this.tick.bind(this));
  }

  resize() {
    const rect = this.linkElement.getBoundingClientRect();
    // 32 = 16 x 2 (either side of the underline to allow glow to bleed outside of the link's bounds)
    this.width = rect.width + 32;
    // Arbitrary height
    this.height = 70;

    // Set width and heights both on canvas and on style
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.style.width = this.width + "px";
    this.canvas.style.height = this.height + "px";
  }

  spawnPoint(deltaTime: number) {
    // Spawn rate scaled on time passed and width (longer link == more particles)
    if (Math.random() > 0.05 * deltaTime * this.width) return;

    this.points.push({
      // Only spawn the point somewhere above the underline, not in the bleedover space
      x: 16 + Math.random() * (this.width - 32),
      // Start moving up from somewhere below the canvas
      y: this.height - 2,
      // Velocity
      vx: (Math.random() - 0.5) * 24, // -12 ~ 12 px/s
      vy: -(5 + Math.random() * 25), // -30 ~ -5 px/s (negative is up)
      lifeRemaining: 1,
      lifetime: 1.5 + Math.random() * 1.5, // 1.5 ~ 3 s
      size: 0.6 + Math.random() * 1.4, // 0.6 ~ 2.0
      initialFlickerPhase: Math.random() * Math.PI * 2, // 0 ~ 2π
    });
  }

  tick(timestamp: number) {
    const deltaTime =
      this.previousTimestamp === 0
        ? 0
        : (timestamp - this.previousTimestamp) / 1000;
    this.previousTimestamp = timestamp;

    this.canvasContext.clearRect(0, 0, this.width, this.height);
    // this.canvasContext.fillStyle = "#FF0000";
    // this.canvasContext.fillRect(0, 0, this.width, this.height);
    this.spawnPoint(deltaTime);

    // Tick each point (iterate backwards because we may remove elements)
    for (let i = this.points.length - 1; i >= 0; i--) {
      const p = this.points[i]!;
      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;
      p.lifeRemaining -= (1 / p.lifetime) * deltaTime;

      // Remove dead particles
      if (p.lifeRemaining <= 0) {
        this.points.splice(i, 1);
        continue;
      }

      // Flicker between 0.7 and 1.0
      const flicker =
        0.7 + 0.3 * Math.sin(timestamp * 0.008 + p.initialFlickerPhase);

      this.canvasContext.globalAlpha = p.lifeRemaining * 0.65 * flicker;
      this.canvasContext.fillStyle = this.startColor
        .lerpTo(this.endColor, 1 - p.lifeRemaining)
        .toHex();
      this.canvasContext.shadowColor =
        this.startColor.lerpTo(this.endColor, 1 - p.lifeRemaining).toHex() +
        "CC";
      this.canvasContext.shadowBlur = p.size * 3;
      this.canvasContext.beginPath();
      this.canvasContext.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.canvasContext.fill();
    }
    this.canvasContext.globalAlpha = 1;
    this.canvasContext.shadowBlur = 0;

    requestAnimationFrame(this.tick.bind(this));
  }
}

document.querySelectorAll(".prose a, a.prose").forEach((el) => {
  if (el instanceof HTMLAnchorElement) {
    new GlowLink(el);
  }
});
