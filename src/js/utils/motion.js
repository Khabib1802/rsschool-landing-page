/**
 * @param {string} value
 * @returns {number[]}
 */
const parseTimeList = (value) =>
  value.split(",").map((part) => {
    const time = part.trim();
    const number = Number.parseFloat(time);

    if (Number.isNaN(number)) return 0;

    return time.endsWith("ms") ? number : number * 1000;
  });

/**
 * @param {Element} element
 * @returns {number} milliseconds
 */
export const getTransitionTimeMs = (element) => {
  const style = getComputedStyle(element);
  const durations = parseTimeList(style.transitionDuration);
  const delays = parseTimeList(style.transitionDelay);

  const totals = durations.map(
    (duration, index) => duration + (delays[index % delays.length] ?? 0),
  );

  return Math.max(0, ...totals);
};

/**
 * @param {HTMLElement} element
 * @returns {Promise<void>}
 */
export const waitForTransitionEnd = (element) =>
  new Promise((resolve) => {
    const fallbackMs = getTransitionTimeMs(element) + 50;

    /** @param {TransitionEvent} event */
    const handleEnd = (event) => {
      if (event.target === element) finish();
    };

    const timer = window.setTimeout(() => finish(), fallbackMs);

    const finish = () => {
      window.clearTimeout(timer);
      element.removeEventListener("transitionend", handleEnd);
      resolve();
    };

    element.addEventListener("transitionend", handleEnd);
  });
