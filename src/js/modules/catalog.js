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
 * @param {number} visibleCount
 */
const renderPlants = (grid, plants, visibleCount) => {
  grid.replaceChildren();

  plants.forEach((plant, index) => {
    const card = createPlantCard(plant);

    if (index >= visibleCount) {
      card.hidden = true;
    }

    grid.append(card);
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

/**
 * @param {import("./api.js").Plant[]} plants
 * @param {string} category
 * @returns {import("./api.js").Plant[]}
 */
const filterPlants = (plants, category) => {
  if (category === "all") {
    return plants;
  }

  return plants.filter((plant) => plant.categories.includes(category));
};

/**
 * @param {HTMLElement} grid
 * @returns {number}
 */
const getPageSize = (grid) => {
  const value = getComputedStyle(grid)
    .getPropertyValue("--catalog-page-size")
    .trim();

  return Number.parseInt(value, 10);
};

/**
 * @param {HTMLElement | null} button
 * @param {number} visibleCount
 * @param {number} totalCount
 */
const updateShowMoreButton = (button, visibleCount, totalCount) => {
  if (!button) return;

  console.log(visibleCount >= totalCount);

  button.style.display = visibleCount >= totalCount ? "none" : "";
};

export const initCatalog = async () => {
  const grid = document.querySelector("[data-plant-grid]");

  if (!grid) return;

  const categoryButtons = document.querySelectorAll("[data-category]");
  const showMoreButton = document.querySelector("[data-show-more]");

  const plants = await loadPlants();

  if (plants.length === 0) {
    renderError(grid, "Unable to load plants");
    return;
  }

  const pageSize = getPageSize(grid);

  let activeCategory = "all";
  let currentPlants = plants;
  let visibleCount = pageSize;

  const updateCatalog = () => {
    renderPlants(grid, currentPlants, visibleCount);

    console.log(visibleCount, currentPlants.length);

    updateShowMoreButton(showMoreButton, visibleCount, currentPlants.length);
  };

  updateCatalog();

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category ?? "all";

      currentPlants = filterPlants(plants, activeCategory);
      visibleCount = pageSize;

      updateCatalog();
    });
  });

  if (showMoreButton) {
    showMoreButton.addEventListener("click", () => {
      visibleCount += pageSize;

      updateCatalog();
    });
  }
};
