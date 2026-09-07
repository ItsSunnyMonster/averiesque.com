interface CallbackEntry {
  onScrollPast: () => void;
  onScrollBack: () => void;
}

function createScrollObserver() {
  const callbacks = new Map<Element, CallbackEntry>();

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const handlers = callbacks.get(entry.target);
        if (!handlers) continue;
        const scrolledPast =
          !entry.isIntersecting && entry.boundingClientRect.top < 0;
        scrolledPast ? handlers.onScrollPast() : handlers.onScrollBack();
      }
    },
    { threshold: 0 },
  );

  function add({
    offset,
    onScrollPast,
    onScrollBack,
  }: {
    offset: number;
    onScrollPast: () => void;
    onScrollBack: () => void;
  }) {
    const sentinel = document.createElement("div");
    sentinel.style.cssText = `position: absolute; top: ${offset}px;`;

    const tearDown = () => {
      observer.unobserve(sentinel);
    };

    const setup = () => {
      document.body.appendChild(sentinel);
      observer.observe(sentinel);
    };

    callbacks.set(sentinel, { onScrollPast, onScrollBack });

    setup();

    document.addEventListener("astro:before-swap", tearDown);
    document.addEventListener("astro:after-swap", setup);

    // Clean up function
    return () => {
      tearDown();
      document.removeEventListener("astro:before-swap", tearDown);
      document.removeEventListener("astro:after-swap", setup);
      callbacks.delete(sentinel);
      sentinel.remove();
    };
  }

  return { add };
}

export const scrollObserver = createScrollObserver();
