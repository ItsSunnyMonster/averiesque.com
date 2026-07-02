import { lerp } from "../utils";

// Contains an RGB colour where each colour is a number between 0 and 255
export default class Color {
  r: number;
  g: number;
  b: number;

  constructor(r: number, g: number, b: number) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  static fromArray(channels: number[]) {
    return new Color(channels[0]!, channels[1]!, channels[2]!);
  }

  static parseFromHex(hex: string) {
    const m = hex.match(/[\da-f]{2}/gi) || ["FF", "FF", "00"];
    return Color.fromArray(m.map((x) => parseInt(x, 16)));
  }

  lerpTo(other: Color, t: number) {
    return new Color(
      lerp(this.r, other.r, t),
      lerp(this.g, other.g, t),
      lerp(this.b, other.b, t),
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
