import { createElement } from "../utils/dom.js";

const FLY_SIZE = 56;
const FLY_DURATION_MS = 750;
const ARC_HEIGHT = 80;
const BUMP_CLASS = "cart-button--bump";

/**
 * @param {HTMLElement} button
 */
const bumpButton = (button) => {
  button.classList.remove(BUMP_CLASS);

  void button.offsetWidth;

  button.classList.add(BUMP_CLASS);
  button.addEventListener(
    "animationend",
    () => button.classList.remove(BUMP_CLASS),
    { once: true },
  );
};

/**
 * @param {DOMRect} rect
 * @returns {{ x: number, y: number }}
 */
const getFlyOrigin = (rect) => ({
  x: rect.left + rect.width / 2 - FLY_SIZE / 2,
  y: rect.top + rect.height / 2 - FLY_SIZE / 2,
});

/**
 * @param {DOMRect} fromRect
 * @param {string} imageUrl
 */
export const playAddToCartAnimation = (fromRect, imageUrl) => {
  const button = document.querySelector("[data-cart-open]");

  if (!(button instanceof HTMLElement)) return;

  const canFly =
    "showPopover" in HTMLElement.prototype &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!canFly) {
    bumpButton(button);

    return;
  }

  const start = getFlyOrigin(fromRect);
  const end = getFlyOrigin(button.getBoundingClientRect());
  const middleX = (start.x + end.x) / 2;
  const middleY = Math.min(start.y, end.y) - ARC_HEIGHT;

  const image = createElement("img", {
    attrs: { src: imageUrl, alt: "", width: "56", height: "56" },
  });

  const fly = createElement("div", {
    className: "cart-fly",
    attrs: { popover: "manual", "aria-hidden": "true" },
    children: [image],
  });

  document.body.append(fly);
  fly.showPopover();

  const animation = fly.animate(
    [
      { transform: `translate(${start.x}px, ${start.y}px) scale(1)` },
      {
        transform: `translate(${middleX}px, ${middleY}px) scale(0.75)`,
        offset: 0.45,
      },
      {
        transform: `translate(${end.x}px, ${end.y}px) scale(0.25)`,
        opacity: 0.7,
      },
    ],
    {
      duration: FLY_DURATION_MS,
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      fill: "forwards",
    },
  );

  animation.finished.then(() => {
    fly.remove();
    bumpButton(button);
  });
};
