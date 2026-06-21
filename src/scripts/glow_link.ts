import { randomRange } from "./utils";
import Color from "./utils/rgbColor";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  lifeRemaining: number;
  lifetime: number;
  radius: number;
  initialFlickerPhase: number;
}

interface EffectSettings {
  // How much larger the particle canvas is either side of the link in pixels
  horizontalBleedover: number;
  // Height of the particle canvas / pixels
  height: number;
  // Number of particles spawned per second per pixel horizontal length
  spawnRate: number;
  // In px/s
  maxVx: number;
  minVx: number;
  maxVy: number;
  minVy: number;
  // in seconds
  maxLifetime: number;
  minLifetime: number;
  // in pixels
  maxRadius: number;
  minRadius: number;
  // This will be multiplied to the calculated alpha of the particle
  flickerMultiplierOffset: number;
  flickerMultiplierAmplitude: number;
  // Time taken for one cycle of flicker, in miliseconds
  flickerPeriod: number;
  // Alpha of the particle at the highest flicker brightness and highest time
  maxAlpha: number;
  // Size of blur as a multiple of the radius of the particle.
  blurMultiplier: number;
}

const S: EffectSettings = {
  horizontalBleedover: 16,
  height: 80,
  spawnRate: 0.05,
  maxVx: 12,
  minVx: -12,
  maxVy: -5,
  minVy: -30,
  maxLifetime: 4,
  minLifetime: 1.5,
  maxRadius: 3,
  minRadius: 0.6,
  flickerMultiplierOffset: 0.7,
  flickerMultiplierAmplitude: 0.3,
  flickerPeriod: 1000,
  maxAlpha: 0.65,
  blurMultiplier: 3,
};

class GlowLink {
  linkElement: HTMLAnchorElement;
  canvas: HTMLCanvasElement;
  canvasContext: CanvasRenderingContext2D;
  particles: Particle[];

  width = 0;
  height = 0;

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
    // Canvas styles
    Object.assign(this.canvas.style, {
      position: "absolute",
      bottom: "-3px",
      // Canvas width is 32px more than the link, this is to allow particles to bleed left and right
      left: `-${S.horizontalBleedover}px`,
      pointerEvents: "none",
      // So that particles draw behind text
      zIndex: "-1",
    });
    linkElement.appendChild(this.canvas);

    this.canvasContext = this.canvas.getContext("2d")!;

    this.particles = [];

    // Triggers an initial resize
    new ResizeObserver(this.resize.bind(this)).observe(linkElement);

    // tick is a method so we must call bind and provide which object to use as the 'this' object in the function call
    requestAnimationFrame(this.tick.bind(this));
  }

  resize() {
    const rect = this.linkElement.getBoundingClientRect();
    // 32 = 16 x 2 (either side of the underline to allow particles to bleed outside of the link's bounds)
    this.width = rect.width + S.horizontalBleedover * 2;
    // Arbitrary height
    this.height = S.height;

    // Set width and heights both on canvas and on style
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.style.width = this.width + "px";
    this.canvas.style.height = this.height + "px";
  }

  spawnParticle(deltaTime: number) {
    // Spawn rate scaled on time passed and width (longer link == more particles)
    if (Math.random() > S.spawnRate * deltaTime * this.width) return;

    this.particles.push({
      // Only spawn the particle somewhere above the underline, not in the bleedover space
      x: randomRange(S.horizontalBleedover, this.width - S.horizontalBleedover),
      // Start moving up from somewhere below the canvas
      y: this.height + 2,
      // Velocity
      vx: randomRange(S.minVx, S.maxVx),
      vy: randomRange(S.minVy, S.maxVy),
      lifeRemaining: 1, // particle destroyed when life goes below 0
      lifetime: randomRange(S.minLifetime, S.maxLifetime),
      radius: randomRange(S.minRadius, S.maxRadius),
      // particles flicker sinusoidally, a random phase between 0 and 2π allows each particle to start their life at a different phase of their flicker
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
    // // Debug canvas bounds
    // this.canvasContext.fillStyle = "#FF0000";
    // this.canvasContext.fillRect(0, 0, this.width, this.height);
    this.spawnParticle(deltaTime);

    // Tick each particle (iterate backwards because we may remove elements)
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i]!;

      // Move particle by velocity
      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;

      // Age particle
      p.lifeRemaining -= (1 / p.lifetime) * deltaTime;

      // Remove dead particles
      if (p.lifeRemaining <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      // Flicker between 0.4 and 1.0
      const flickerMultiplier =
        S.flickerMultiplierOffset +
        S.flickerMultiplierAmplitude *
          Math.sin(
            ((Math.PI * 2) / S.flickerPeriod) * timestamp +
              p.initialFlickerPhase,
          );

      this.canvasContext.globalAlpha =
        p.lifeRemaining * S.maxAlpha * flickerMultiplier;
      this.canvasContext.fillStyle = this.startColor
        .lerpTo(this.endColor, 1 - p.lifeRemaining)
        .toHex();
      this.canvasContext.shadowColor =
        this.startColor.lerpTo(this.endColor, 1 - p.lifeRemaining).toHex() +
        "CC";
      this.canvasContext.shadowBlur = p.radius * 3;
      this.canvasContext.beginPath();
      this.canvasContext.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.canvasContext.fill();
    }

    // Reset context
    this.canvasContext.globalAlpha = 1;
    this.canvasContext.shadowBlur = 0;

    requestAnimationFrame(this.tick.bind(this));
  }
}

if (!matchMedia("(prefers-reduced-motion)").matches) {
  document.querySelectorAll(".prose a, a.prose").forEach((el) => {
    if (el instanceof HTMLAnchorElement) {
      new GlowLink(el);
    }
  });
}
