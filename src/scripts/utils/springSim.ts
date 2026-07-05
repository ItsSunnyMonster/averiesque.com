export interface SpringSimParams {
  stiffness: number;
  damping: number;
  mass: number;
}

export class Spring {
  params: SpringSimParams;

  private velocity = 0;
  private currentValue: number;
  private targetValue: number;

  constructor(params: SpringSimParams, initialValue: number) {
    this.params = params;
    this.currentValue = initialValue;
    this.targetValue = initialValue;
  }

  getCurrent() {
    return this.currentValue;
  }

  setTarget(value: number) {
    this.targetValue = value;
  }

  step(dt: number) {
    const force =
      -this.params.stiffness * (this.currentValue - this.targetValue);
    const dampingForce = -this.params.damping * this.velocity;
    const acceleration = (force + dampingForce) / this.params.mass;
    this.velocity += acceleration * dt;
    this.currentValue += this.velocity * dt;
    return this.currentValue;
  }

  isSettled() {
    return (
      Math.abs(this.velocity) < 0.01 &&
      Math.abs(this.targetValue - this.currentValue) < 0.01
    );
  }
}
