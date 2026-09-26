import { loadPlants } from "./api.js";

/**
 * @type {Record<string, string>}
 */
const CATEGORY_LABELS = {
  "easy-care": "Easy Care",
  "low-light": "Low Light",
  "pet-friendly": "Pet Friendly",
  tropical: "Tropical",
  succulent: "Succulent",
};

/**
 * @param {string} category
 * @returns {string}
 */
const getCategoryLabel = (category) => CATEGORY_LABELS[category] ?? category;

/**
 * @param {import("./api.js").Plant} plant
 * @returns {HTMLLIElement}
 */
const createPlantCard = (plant) => {
  const item = document.createElement("li");
  const link = document.createElement("a");
  const imageWrap = document.createElement("div");
  const image = document.createElement("img");
  const body = document.createElement("div");
  const category = document.createElement("p");
  const name = document.createElement("h2");
  const description = document.createElement("p");
  const price = document.createElement("p");

  const firstCategory = plant.categories[0];

  item.dataset.plantId = plant.id;

  link.href = "./catalog.html";
  link.className = "plant-card";
  link.setAttribute("aria-label", `View ${plant.name}`);

  imageWrap.className = "plant-card__image-wrap";

  image.src = plant.image;
  image.alt = plant.name;
  image.className = "plant-card__image";
  image.width = 640;
  image.height = 800;

  body.className = "plant-card__body";

  category.className = "plant-card__category";
  category.textContent = getCategoryLabel(firstCategory);

  name.className = "plant-card__name";
  name.textContent = plant.name;

  description.className = "plant-card__description";
  description.textContent = plant.description;

  price.className = "plant-card__price";
  price.textContent = `$${plant.pricing.base}`;

  imageWrap.append(image);
  body.append(category, name, description, price);
  link.append(imageWrap, body);
  item.append(link);

  return item;
};

/**
 * @param {HTMLElement} grid
 * @param {import("./api.js").Plant[]} plants
 */
const renderPlants = (grid, plants) => {
  grid.replaceChildren();

  plants.forEach((plant) => {
    grid.append(createPlantCard(plant));
  });
};

/**
 * @param {HTMLElement} grid
 * @param {string} message
 */
const renderError = (grid, message) => {
  const item = document.createElement("li");
  item.className = "plant-card__error";
  item.textContent = message;

  grid.replaceChildren(item);
};

export const initCatalog = async () => {
  const grid = document.querySelector("[data-plant-grid]");

  if (!grid) return;

  const plants = await loadPlants();

  if (plants.length === 0) {
    renderError(grid, "Unable to load plants");
    return;
  }

  renderPlants(grid, plants);
};
