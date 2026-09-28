import { MEDIA_QUERIES } from "../constants.js";
import { createPlantCard } from "../components/plant-card.js";
import { getTransitionTimeMs } from "../utils/motion.js";

const ACTIVE_CATEGORY_CLASS = "category-nav__item--active";
const GRID_LEAVING_CLASS = "product-grid--leaving";
const CARD_ENTERING_CLASS = "is-entering";

/**
 * @param {import("../types.js").Plant[]} plants
 * @param {string} category "all" or a category id
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
 * @param {HTMLElement} card
 * @param {number} order
 */
const playEnterAnimation = (card, order) => {
  card.style.setProperty("--enter-index", String(order));
  card.classList.add(CARD_ENTERING_CLASS);

  card.addEventListener(
    "animationend",
    () => card.classList.remove(CARD_ENTERING_CLASS),
    { once: true },
  );
};

/**
 * @param {HTMLElement[]} cards
 * @param {number} visibleCount
 */
const updateVisibleCards = (cards, visibleCount) => {
  let order = 0;

  cards.forEach((card, index) => {
    const shouldShow = index < visibleCount;
    const wasHidden = card.hidden;

    card.hidden = !shouldShow;

    if (shouldShow && wasHidden) {
      playEnterAnimation(card, order);
      order += 1;
    }
  });
};

/**
 * @param {import("../types.js").Plant[]} plants
 * @returns {HTMLElement[]}
 */
const createCards = (plants) =>
  plants.map((plant) => {
    const card = createPlantCard(plant, { headingLevel: "h2" });

    card.hidden = true;

    return card;
  });

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

    button.classList.toggle(ACTIVE_CATEGORY_CLASS, isActive);
    button.setAttribute("aria-current", String(isActive));
  });
};

/**
 * @param {import("../types.js").Plant[]} plants
 */
export const initCatalog = (plants) => {
  const grid = document.querySelector("[data-plant-grid]");

  if (!(grid instanceof HTMLElement)) return;

  const categoryButtons = document.querySelectorAll("[data-category]");
  const showMoreButton = document.querySelector("[data-show-more]");

  let activeCategory = "all";
  let currentPlants = plants;
  let cards = /** @type {HTMLElement[]} */ ([]);
  let visibleCount = getPageSize(grid);
  let swapTimer = 0;

  const refreshShowMore = () =>
    updateShowMoreButton(showMoreButton, visibleCount, cards.length);

  const rebuildCards = () => {
    cards = createCards(currentPlants);
    grid.replaceChildren(...cards);

    updateVisibleCards(cards, visibleCount);
    refreshShowMore();
  };

  const showCategory = () => {
    visibleCount = getPageSize(grid);

    window.clearTimeout(swapTimer);
    grid.classList.add(GRID_LEAVING_CLASS);

    swapTimer = window.setTimeout(() => {
      rebuildCards();
      grid.classList.remove(GRID_LEAVING_CLASS);
    }, getTransitionTimeMs(grid));
  };

  const resetPagination = () => {
    visibleCount = getPageSize(grid);

    updateVisibleCards(cards, visibleCount);
    refreshShowMore();
  };

  rebuildCards();

  const initiallyActiveButton = Array.from(categoryButtons).find((button) =>
    button.classList.contains(ACTIVE_CATEGORY_CLASS),
  );

  if (initiallyActiveButton) {
    setActiveCategoryButton(categoryButtons, initiallyActiveButton);
  }

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.category ?? "all";

      if (category === activeCategory) return;

      activeCategory = category;
      currentPlants = filterPlants(plants, category);

      setActiveCategoryButton(categoryButtons, button);
      showCategory();
    });
  });

  showMoreButton?.addEventListener("click", () => {
    if (grid.classList.contains(GRID_LEAVING_CLASS)) return;

    visibleCount += getPageSize(grid);

    updateVisibleCards(cards, visibleCount);
    refreshShowMore();
  });

  Object.values(MEDIA_QUERIES).forEach((query) => {
    window.matchMedia(query).addEventListener("change", resetPagination);
  });
};
