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
  private springSupport: any;
  private onChangeCallback: (newValue: number, springSupport: any) => void;

  constructor(
    params: SpringSimParams,
    initialValue: number,
    springSupport?: any,
    onChangeCallback?: (newValue: number, springSupport: any) => void,
  ) {
    this.params = params;
    this.currentValue = initialValue;
    this.targetValue = initialValue;
    this.springSupport = springSupport;
    this.onChangeCallback = onChangeCallback ? onChangeCallback : (_) => {};
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
    this.onChangeCallback(this.currentValue, this.springSupport);
    return this.currentValue;
  }

  isSettled() {
    return (
      Math.abs(this.velocity) < 0.01 &&
      Math.abs(this.targetValue - this.currentValue) < 0.01
    );
  }
}

export class TwoDSpring {
  x: Spring;
  y: Spring;

  private springSupport: any;
  private onChangeCallback: (
    newValues: [number, number],
    springSupport: any,
  ) => void;

  constructor(
    params: SpringSimParams,
    initialValues: [number, number],
    springSupport?: any,
    onChangeCallback?: (
      newValues: [number, number],
      springSupport: any,
    ) => void,
  ) {
    this.x = new Spring(params, initialValues[0]);
    this.y = new Spring(params, initialValues[1]);
    this.springSupport = springSupport;
    this.onChangeCallback = onChangeCallback ? onChangeCallback : (_) => {};
  }

  getCurrent() {
    return [this.x, this.y] as const;
  }

  setTarget(value: [number, number]) {
    this.x.setTarget(value[0]);
    this.y.setTarget(value[1]);
  }

  step(dt: number) {
    const x = this.x.step(dt);
    const y = this.y.step(dt);

    this.onChangeCallback([x, y], this.springSupport);

    return [x, y] as const;
  }

  isSettled() {
    return this.x.isSettled() && this.y.isSettled();
  }
}
