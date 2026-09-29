const QUIET_MS = 300;
const MAX_FOLLOW_MS = 8000;
const CANCEL_EVENTS = ["wheel", "touchstart", "keydown", "pointerdown"];

/**
 * @returns {HTMLElement | null}
 */
const getTarget = () => {
  const id = decodeURIComponent(window.location.hash.slice(1));

  return id ? document.getElementById(id) : null;
};

const alignToTarget = () => {
  getTarget()?.scrollIntoView({ block: "start", behavior: "instant" });
};

/**
 * @returns {Promise<void>}
 */
const whenWindowLoaded = () =>
  new Promise((resolve) => {
    if (document.readyState === "complete") {
      resolve();
    } else {
      window.addEventListener("load", () => resolve(), { once: true });
    }
  });

/**
 * @param {Promise<unknown>} [pageReady]
 */
export const initAnchorScroll = (pageReady = Promise.resolve()) => {
  if (!getTarget()) return;

  const observer = new ResizeObserver(alignToTarget);
  let quietTimer = 0;

  const stop = () => {
    observer.disconnect();
    window.clearTimeout(quietTimer);
    window.clearTimeout(maxTimer);

    CANCEL_EVENTS.forEach((type) => window.removeEventListener(type, stop));
  };

  const maxTimer = window.setTimeout(stop, MAX_FOLLOW_MS);

  CANCEL_EVENTS.forEach((type) =>
    window.addEventListener(type, stop, { passive: true }),
  );

  observer.observe(document.body);

  Promise.allSettled([
    pageReady,
    whenWindowLoaded(),
    document.fonts.ready,
  ]).then(() => {
    quietTimer = window.setTimeout(stop, QUIET_MS);
  });
};
