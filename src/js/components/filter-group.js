import { createElement } from "../utils/dom.js";

const ACTIVE_CLASS = "category-nav__item--active";

/**
 * @param {HTMLElement} container
 * @param {{ value: string, label: string }[]} options
 * @param {(value: string) => void} onSelect
 * @returns {(activeValue: string) => void}
 */
export const initFilterGroup = (container, options, onSelect) => {
  const buttons = options.map(({ value, label }) => {
    const button = createElement("button", {
      className: "category-nav__item",
      text: label,
      attrs: { type: "button" },
    });

    button.addEventListener("click", () => onSelect(value));

    return button;
  });

  container.replaceChildren(...buttons);

  return (activeValue) => {
    buttons.forEach((button, index) => {
      const isActive = options[index].value === activeValue;

      button.classList.toggle(ACTIVE_CLASS, isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  };
};
