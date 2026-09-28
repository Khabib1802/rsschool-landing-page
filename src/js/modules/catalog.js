/**
 * @type {Record<string, string>}
 */
const CATEGORY_LABELS = {
  "easy-care": "Easy Care",
  "low-light": "Low Light",
  "pet-friendly": "Pet Friendly",
  tropical: "Tropical",
  succulent: "Succulents",
};

/**
 * @type {Record<string, string>}
 */
const BREAKPOINTS = {
  mobile: "(max-width: 768px)",
  tablet: "(min-width: 769px) and (max-width: 1199px)",
  desktop: "(min-width: 1200px)",
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
  const card = document.createElement("div");
  const imageWrap = document.createElement("div");
  const image = document.createElement("img");
  const body = document.createElement("div");
  const category = document.createElement("p");
  const name = document.createElement("h2");
  const description = document.createElement("p");
  const price = document.createElement("p");

  item.dataset.plantId = plant.id;

  card.className = "plant-card";
  card.setAttribute("aria-label", `View ${plant.name}`);

  imageWrap.className = "plant-card__image-wrap";

  image.src = plant.image;
  image.alt = plant.name;
  image.className = "plant-card__image";
  image.width = 640;
  image.height = 800;

  body.className = "plant-card__body";

  category.className = "plant-card__category";
  category.textContent = plant.categories.map(getCategoryLabel).join(" · ");

  name.className = "plant-card__name";
  name.textContent = plant.name;

  description.className = "plant-card__description";
  description.textContent = plant.description;

  price.className = "plant-card__price";
  price.textContent = `$${plant.pricing.base}`;

  imageWrap.append(image);
  body.append(category, name, description, price);
  card.append(imageWrap, body);
  item.append(card);

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
    const card = createPlantCard(plant, { headingLevel: "h2" });

    if (index >= visibleCount) {
      card.hidden = true;
    }

    grid.append(card);
  });
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

  button.style.display = visibleCount >= totalCount ? "none" : "";
};

/**
 * @param {NodeListOf<Element>} buttons
 * @param {Element} activeButton
 */
const setActiveCategoryButton = (buttons, activeButton) => {
  buttons.forEach((button) => {
    const isActive = button === activeButton;

    button.classList.toggle("category-nav__item--active", isActive);
    button.setAttribute("aria-current", String(isActive));
  });
};

/**
 * @param {import("./api.js").Plant[]} plants
 */
export const initCatalog = (plants) => {
  const grid = document.querySelector("[data-plant-grid]");

  if (!grid) return;

  const categoryButtons = document.querySelectorAll("[data-category]");
  const showMoreButton = document.querySelector("[data-show-more]");

  let currentPlants = plants;
  let visibleCount = getPageSize(grid);

  const updateCatalog = () => {
    renderPlants(grid, currentPlants, visibleCount);
    updateShowMoreButton(showMoreButton, visibleCount, currentPlants.length);
  };

  const resetPagination = () => {
    visibleCount = getPageSize(grid);
    updateCatalog();
  };

  updateCatalog();

  const initiallyActiveButton = Array.from(categoryButtons).find((button) =>
    button.classList.contains("category-nav__item--active"),
  );

  if (initiallyActiveButton) {
    setActiveCategoryButton(categoryButtons, initiallyActiveButton);
  }

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.category ?? "all";

      currentPlants = filterPlants(plants, category);
      setActiveCategoryButton(categoryButtons, button);
      resetPagination();
    });
  });

  showMoreButton?.addEventListener("click", () => {
    visibleCount += getPageSize(grid);
    updateCatalog();
  });

  const mediaQueries = Object.values(BREAKPOINTS).map((query) =>
    window.matchMedia(query),
  );

  mediaQueries.forEach((mq) => {
    mq.addEventListener("change", resetPagination);
  });
};
