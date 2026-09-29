import { createElement } from "../utils/dom.js";

/**
 * @typedef {Object} CatalogMessageOptions
 * @property {"alert" | "status"} role
 * @property {string} title
 * @property {string} text
 * @property {string} actionLabel
 * @property {() => void} onAction
 */

/**
 * @param {HTMLElement} container
 * @param {CatalogMessageOptions} options
 */
export const renderCatalogMessage = (container, options) => {
  const { role, title, text, actionLabel, onAction } = options;

  const heading = createElement("h2", {
    className: "catalog-message__title",
    text: title,
  });

  const description = createElement("p", {
    className: "catalog-message__text",
    text,
  });

  const action = createElement("button", {
    className: "button button--primary",
    text: actionLabel,
    attrs: { type: "button" },
  });

  action.addEventListener("click", () => {
    action.setAttribute("disabled", "");
    onAction();
  });

  container.setAttribute("role", role);
  container.replaceChildren(heading, description, action);
  container.hidden = false;
};

/**
 * @param {HTMLElement} container
 */
export const clearCatalogMessage = (container) => {
  container.removeAttribute("role");
  container.replaceChildren();
  container.hidden = true;
};
