class PropProber {
  private probe: HTMLDivElement;

  private cache: WeakMap<HTMLElement, Map<string, number>> = new WeakMap();

  constructor() {
    this.probe = document.createElement("div");
    this.probe.style.position = "absolute";
    this.probe.style.visibility = "hidden";
    this.probe.style.pointerEvents = "none";
    document.body.appendChild(this.probe);

    document.addEventListener("astro:after-swap", () =>
      document.body.appendChild(this.probe),
    );
  }

  propertyToPx(el: HTMLElement, prop: string) {
    let propToPxMap = this.cache.getOrInsert(el, new Map());

    return propToPxMap.getOrInsertComputed(prop, (prop: string) => {
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

export const propProber = new PropProber();
