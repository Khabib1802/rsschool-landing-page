import { MEDIA_QUERIES } from "../constants.js";
import { createPlantCard } from "../components/plant-card.js";

/**
 * @param {HTMLElement} grid
 * @param {import("../types.js").Plant[]} plants
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
 * @param {import("../types.js").Plant[]} plants
 * @param {string} category
 * @returns {import("../types.js").Plant[]}
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
 * @param {import("../types.js").Plant[]} plants
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

  const mediaQueries = Object.values(MEDIA_QUERIES).map((query) =>
    window.matchMedia(query),
  );

  mediaQueries.forEach((mq) => {
    mq.addEventListener("change", resetPagination);
  });
};
