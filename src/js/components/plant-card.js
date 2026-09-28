import { createElement } from "../utils/dom.js";
import { getCategoryLabel } from "../constants.js";

/**
 * @typedef {Object} PlantCardOptions
 * @property {"h2" | "h3"} [headingLevel] - catalog cards are top-level (h2),
 * @property {string} [itemClassName] - extra class on the outer <li>
 */

/**
 * @param {import("../types.js").Plant} plant
 * @param {PlantCardOptions} [options]
 * @returns {HTMLLIElement}
 */
export const createPlantCard = (plant, options = {}) => {
  const { headingLevel = "h2", itemClassName } = options;

  const item = /** @type {HTMLLIElement} */ (
    createElement("li", { className: itemClassName })
  );

  const card = createElement("article", { className: "plant-card" });

  const imageWrap = createElement("div", {
    className: "plant-card__image-wrap",
  });

  const image = createElement("img", {
    className: "plant-card__image",
    attrs: { src: plant.image, alt: "", width: "640", height: "800" },
  });

  const body = createElement("div", { className: "plant-card__body" });

  const category = createElement("p", {
    className: "plant-card__category",
    text: plant.categories.map(getCategoryLabel).join(" · "),
  });

  const name = createElement(headingLevel, { className: "plant-card__name" });

  const action = createElement("button", {
    className: "plant-card__action",
    text: plant.name,
    attrs: {
      type: "button",
      "aria-haspopup": "dialog",
      "data-plant-id": plant.id,
    },
  });

  const description = createElement("p", {
    className: "plant-card__description",
    text: plant.description,
  });

  const price = createElement("p", {
    className: "plant-card__price",
    text: `$${plant.pricing.base}`,
  });

  name.append(action);
  imageWrap.append(image);
  body.append(category, name, description, price);
  card.append(imageWrap, body);
  item.append(card);

  return item;
};
