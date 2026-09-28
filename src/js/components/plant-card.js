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

  imageWrap.append(image);

  const body = createElement("div", { className: "plant-card__body" });

  const category = createElement("span", {
    className: "plant-card__category",
    text: getCategoryLabel(plant.category),
  });

  const heading = createElement(headingLevel, {
    className: "plant-card__name",
  });
  const button = createElement("button", {
    className: "plant-card__action",
    text: plant.name,
    attrs: { "data-plant-id": plant.id },
  });
  heading.append(button);

  const price = createElement("span", {
    className: "plant-card__price",
    text: `$${plant.price}`,
  });

  body.append(category, heading, price);
  card.append(imageWrap, body);
  item.append(card);

  return item;
};
