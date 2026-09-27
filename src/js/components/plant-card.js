import { createElement } from "../utils/dom.js";
import { getCategoryLabel } from "../constants.js";

/**
 * @typedef {Object} PlantCardOptions
 * @property {"div" | "a"} [as] - root tag of the clickable card surface
 * @property {"h2" | "h3"} [headingLevel] - catalog cards are top-level (h2),
 *   slider cards sit under a section heading so they use h3
 * @property {string} [href] - required when `as` is "a"
 * @property {string} [ariaLabel] - defaults to `View ${plant.name}`
 * @property {string} [itemClassName] - extra class on the outer <li> (e.g. slider item sizing)
 */

/**
 * @param {import("../types.js").Plant} plant
 * @param {PlantCardOptions} [options]
 * @returns {HTMLLIElement}
 */
export const createPlantCard = (plant, options = {}) => {
  const {
    as = "div",
    headingLevel = "h2",
    href,
    ariaLabel = `View ${plant.name}`,
    itemClassName,
  } = options;

  const item = /** @type {HTMLLIElement} */ (createElement("li"));
  item.dataset.plantId = plant.id;

  if (itemClassName) {
    item.className = itemClassName;
  }

  const card = createElement(as, {
    className: "plant-card",
    attrs: { "aria-label": ariaLabel, ...(as === "a" && href ? { href } : {}) },
  });

  const imageWrap = createElement("div", {
    className: "plant-card__image-wrap",
  });

  const image = /** @type {HTMLImageElement} */ (
    createElement("img", {
      className: "plant-card__image",
      attrs: { src: plant.image, alt: plant.name, width: "640", height: "800" },
    })
  );

  const body = createElement("div", { className: "plant-card__body" });

  const category = createElement("p", {
    className: "plant-card__category",
    text: plant.categories.map(getCategoryLabel).join(" · "),
  });

  const name = createElement(headingLevel, {
    className: "plant-card__name",
    text: plant.name,
  });

  const description = createElement("p", {
    className: "plant-card__description",
    text: plant.description,
  });

  const price = createElement("p", {
    className: "plant-card__price",
    text: `$${plant.pricing.base}`,
  });

  imageWrap.append(image);
  body.append(category, name, description, price);
  card.append(imageWrap, body);
  item.append(card);

  return item;
};
