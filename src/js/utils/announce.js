import { createElement } from "./dom.js";

/** @type {HTMLElement | null} */
let region = null;

/**
 * @param {string} message
 */
export const announce = (message) => {
  if (!region) {
    region = createElement("p", {
      className: "sr-only",
      attrs: { role: "status", "aria-live": "polite" },
    });

    document.body.append(region);
  }

  const target = region;

  target.textContent = "";

  window.setTimeout(() => {
    target.textContent = message;
  }, 50);
};
