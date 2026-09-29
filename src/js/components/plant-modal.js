import {
  CHARACTERISTIC_LABELS,
  CHARACTERISTIC_MAX,
  MAX_QUANTITY,
  PLANT_OPTIONS,
  getCategoryLabel,
} from "../constants.js";
import { createElement } from "../utils/dom.js";

const TITLE_ID = "plant-modal-title";
const QUANTITY_ID = "plant-modal-quantity";

/**
 * @typedef {import("../types.js").Plant} Plant
 */

/**
 * @param {string} label
 * @returns {{ item: HTMLElement, value: HTMLElement }}
 */
const createCharacteristic = (label) => {
  const value = createElement("span", {
    className: "characteristic__value",
    attrs: { role: "img" },
  });

  const item = createElement("div", {
    className: "characteristic",
    children: [
      createElement("span", { className: "characteristic__label", text: label }),
      value,
    ],
  });

  return { item, value };
};

/**
 * @param {{ key: string, title: string }} option
 * @returns {{ group: HTMLElement, choices: HTMLElement }}
 */
const createOptionGroup = ({ key, title }) => {
  const labelId = `plant-modal-${key}-label`;

  const label = createElement("p", {
    className: "plant-modal__option-label",
    text: title,
    attrs: { id: labelId },
  });

  const choices = createElement("div", {
    className: "plant-modal__choices",
    attrs: { role: "radiogroup", "aria-labelledby": labelId },
  });

  const group = createElement("div", {
    className: "plant-modal__option",
    children: [label, choices],
  });

  return { group, choices };
};

/**
 * @returns {{ group: HTMLElement, input: HTMLInputElement }}
 */
const createQuantityField = () => {
  const label = createElement("label", {
    className: "plant-modal__option-label",
    text: "Quantity",
    attrs: { for: QUANTITY_ID },
  });

  const input = /** @type {HTMLInputElement} */ (
    createElement("input", {
      className: "plant-modal__quantity-input",
      attrs: {
        id: QUANTITY_ID,
        type: "number",
        inputmode: "numeric",
        min: "1",
        max: String(MAX_QUANTITY),
        value: "1",
      },
    })
  );

  const group = createElement("div", {
    className: "plant-modal__option",
    children: [label, input],
  });

  return { group, input };
};

/**
 * @param {{ key: string, value: string, label: string }} choice
 * @returns {HTMLLabelElement}
 */
const createChoice = ({ key, value, label }) => {
  const input = createElement("input", {
    className: "plant-modal__choice-input",
    attrs: {
      type: "radio",
      name: `plant-${key}`,
      value,
      "data-option": key,
    },
  });

  const text = createElement("span", {
    className: "plant-modal__choice-label",
    text: label,
  });

  return /** @type {HTMLLabelElement} */ (
    createElement("label", {
      className: "plant-modal__choice",
      children: [input, text],
    })
  );
};

export const createPlantModal = () => {
  const close = createElement("button", {
    className: "close-button plant-modal__close",
    text: "×",
    attrs: { type: "button", "aria-label": "Close plant details" },
  });

  const image = /** @type {HTMLImageElement} */ (
    createElement("img", {
      className: "plant-modal__image",
      attrs: { alt: "", width: "896", height: "1152", loading: "lazy" },
    })
  );

  const category = createElement("p", { className: "plant-modal__category" });

  const name = createElement("h2", {
    className: "plant-modal__name",
    attrs: { id: TITLE_ID },
  });

  const description = createElement("p", {
    className: "plant-modal__description",
  });

  const characteristics = {};
  const characteristicItems = Object.entries(CHARACTERISTIC_LABELS).map(
    ([key, label]) => {
      const { item, value } = createCharacteristic(label);

      characteristics[key] = value;

      return item;
    },
  );

  const choices = {};
  const optionGroups = PLANT_OPTIONS.map((option) => {
    const { group, choices: container } = createOptionGroup(option);

    choices[option.key] = container;

    return group;
  });

  const quantity = createQuantityField();

  const options = createElement("div", {
    className: "plant-modal__options",
    children: [...optionGroups, quantity.group],
  });

  const price = createElement("p", {
    className: "plant-modal__price",
    attrs: { "aria-live": "polite" },
  });

  const submit = createElement("button", {
    className: "button button--primary",
    text: "Add to collection",
    attrs: { type: "button" },
  });

  const body = createElement("div", {
    className: "plant-modal__body",
    children: [
      createElement("div", {
        className: "plant-modal__header",
        children: [category, name],
      }),
      description,
      createElement("div", {
        className: "plant-modal__characteristics",
        children: characteristicItems,
      }),
      options,
      createElement("div", {
        className: "plant-modal__footer",
        children: [price, submit],
      }),
    ],
  });

  const dialog = /** @type {HTMLDialogElement} */ (
    createElement("dialog", {
      className: "plant-modal",
      attrs: { "aria-labelledby": TITLE_ID },
      children: [
        createElement("div", {
          className: "plant-modal__content",
          children: [
            close,
            createElement("div", {
              className: "plant-modal__image-wrap",
              children: [image],
            }),
            body,
          ],
        }),
      ],
    })
  );

  return {
    dialog,
    elements: {
      body,
      close,
      submit,
      image,
      category,
      name,
      description,
      characteristics,
      choices,
      options,
      quantityInput: quantity.input,
      price,
    },
  };
};

/**
 * @param {ReturnType<typeof createPlantModal>["elements"]} elements
 * @param {Plant} plant
 */
export const fillPlantDetails = (elements, plant) => {
  elements.image.src = plant.image;
  elements.image.alt = plant.name;
  elements.category.textContent = plant.categories
    .map(getCategoryLabel)
    .join(" · ");
  elements.name.textContent = plant.name;
  elements.description.textContent = plant.description;

  Object.entries(elements.characteristics).forEach(([key, container]) => {
    const value = plant.characteristics[key];

    const indicators = Array.from({ length: CHARACTERISTIC_MAX }, (_, index) =>
      createElement("span", {
        className:
          index < value
            ? "characteristic__indicator characteristic__indicator--active"
            : "characteristic__indicator",
      }),
    );

    container.setAttribute("aria-label", `${value} of ${CHARACTERISTIC_MAX}`);
    container.replaceChildren(...indicators);
  });

  PLANT_OPTIONS.forEach(({ key, pricingKey, labels }) => {
    const choices = Object.keys(plant.pricing[pricingKey]).map((value) =>
      createChoice({ key, value, label: labels[value] ?? value }),
    );

    elements.choices[key].replaceChildren(...choices);
  });

  elements.body.scrollTop = 0;
};
