export class PropProber {
  private readonly probe: HTMLDivElement;

  private readonly cache: WeakMap<HTMLElement, Map<string, number>> =
    new WeakMap();

  constructor() {
    this.probe = document.createElement("div");
    this.probe.style.position = "absolute";
    this.probe.style.visibility = "hidden";
    this.probe.style.pointerEvents = "none";
    document.body.appendChild(this.probe);
  }

  propertyToPx(el: HTMLElement, prop: string) {
    let propToPxMap = this.cache.getOrInsert(el, new Map());

    return propToPxMap.getOrInsertComputed(prop, (prop) => {
      const elStyle = getComputedStyle(el, null);

      const propString = elStyle.getPropertyValue(prop);

      if (propString.endsWith("%")) {
        throw Error("Cannot decode length from percentages.");
      }

      this.probe.style.fontFamily = elStyle.fontFamily;
      this.probe.style.fontSize = elStyle.fontSize;

      this.probe.style.setProperty(prop, propString);
      this.probe.style.width = `var(${prop})`;

      const px = getComputedStyle(this.probe, null).width;

      return parseFloat(px);
    });
  }
}
