import { MAX_QUANTITY, PLANT_OPTIONS } from "../constants.js";
import { createElement } from "../utils/dom.js";
import {
  calculateTotalPrice,
  calculateUnitPrice,
  formatPrice,
} from "../modules/pricing.js";
import { getLineId } from "../modules/cart-store.js";

/**
 * @typedef {import("../types.js").Plant} Plant
 * @typedef {import("../types.js").CartItem} CartItem
 */

/**
 * @param {string} action
 * @param {string} text
 * @param {string} label
 * @returns {HTMLButtonElement}
 */
const createStepButton = (action, text, label) =>
  /** @type {HTMLButtonElement} */ (
    createElement("button", {
      className: "cart-row__step",
      text,
      attrs: { type: "button", "data-action": action, "aria-label": label },
    })
  );

/**
 * @param {Plant} plant
 * @param {CartItem} item
 */
export const createCartRow = (plant, item) => {
  const selects = {};

  const fields = PLANT_OPTIONS.map(({ key, title, pricingKey, labels }) => {
    const options = Object.keys(plant.pricing[pricingKey]).map((value) =>
      createElement("option", {
        text: labels[value] ?? value,
        attrs: { value },
      }),
    );

    const select = /** @type {HTMLSelectElement} */ (
      createElement("select", {
        className: "cart-row__select",
        attrs: { "data-field": key },
        children: options,
      })
    );

    selects[key] = select;

    return createElement("label", {
      className: "cart-row__field",
      children: [
        createElement("span", {
          className: "cart-row__field-label",
          text: title,
        }),
        select,
      ],
    });
  });

  const price = createElement("p", { className: "cart-row__price" });

  const decrease = createStepButton(
    "decrease",
    "−",
    `Decrease quantity of ${plant.name}`,
  );

  const increase = createStepButton(
    "increase",
    "+",
    `Increase quantity of ${plant.name}`,
  );

  const quantity = createElement("span", {
    className: "cart-row__quantity-value",
  });

  const remove = createElement("button", {
    className: "link-button",
    text: "Remove",
    attrs: {
      type: "button",
      "data-action": "remove",
      "aria-label": `Remove ${plant.name} from collection`,
    },
  });

  const element = createElement("li", {
    className: "cart-row",
    attrs: { "data-line-id": getLineId(item) },
    children: [
      createElement("img", {
        className: "cart-row__image",
        attrs: {
          src: plant.image,
          alt: "",
          width: "64",
          height: "80",
          loading: "lazy",
        },
      }),
      createElement("div", {
        className: "cart-row__info",
        children: [
          createElement("div", {
            className: "cart-row__head",
            children: [
              createElement("h3", {
                className: "cart-row__name",
                text: plant.name,
              }),
              price,
            ],
          }),
          createElement("div", {
            className: "cart-row__options",
            children: fields,
          }),
          createElement("div", {
            className: "cart-row__foot",
            children: [
              createElement("div", {
                className: "cart-row__quantity",
                children: [decrease, quantity, increase],
              }),
              remove,
            ],
          }),
        ],
      }),
    ],
  });

  return {
    element,
    refs: { selects, price, quantity, decrease, increase },
  };
};

/**
 * @param {ReturnType<typeof createCartRow>} row
 * @param {Plant} plant
 * @param {CartItem} item
 */
export const updateCartRow = ({ refs }, plant, item) => {
  refs.selects.size.value = item.size;
  refs.selects.pot.value = item.pot;

  refs.quantity.textContent = String(item.quantity);
  refs.decrease.disabled = item.quantity <= 1;
  refs.increase.disabled = item.quantity >= MAX_QUANTITY;

  refs.price.textContent = formatPrice(
    calculateTotalPrice(
      calculateUnitPrice(plant, item.size, item.pot),
      item.quantity,
    ),
  );
};
