export class PropProber {
  private probe: HTMLDivElement;

  private cache: WeakMap<HTMLElement, Map<string, number>> = new WeakMap();

  constructor() {
    this.probe = this.createProbe();
  }

  private createProbe(): HTMLDivElement {
    const probe = document.createElement("div");
    probe.style.position = "absolute";
    probe.style.visibility = "hidden";
    probe.style.pointerEvents = "none";
    document.body.appendChild(probe);
    return probe;
  }

  propertyToPx(el: HTMLElement, prop: string) {
    if (!this.probe.isConnected) {
      this.probe = this.createProbe();
      // NOTE: don't need to clear the weak map here because once the element is dropped
      // the weak map does not keep it alive and so it also gets garbage collected anyway
    }

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
