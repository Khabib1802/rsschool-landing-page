import {
  CATEGORY_LABELS,
  MEDIA_QUERIES,
  SPACE_LABELS,
  getPageSize,
} from "../constants.js";
import { createPlantCard } from "../components/plant-card.js";
import { initFilterGroup } from "../components/filter-group.js";
import {
  clearCatalogMessage,
  renderCatalogMessage,
} from "../components/catalog-message.js";
import { getTransitionTimeMs } from "../utils/motion.js";

const ALL = "all";
const GRID_LEAVING_CLASS = "product-grid--leaving";
const CARD_ENTERING_CLASS = "is-entering";

/**
 * @typedef {import("../types.js").Plant} Plant
 * @typedef {{ category: string, space: string }} Filters
 */

/**
 * @param {Record<string, string>} labels
 * @returns {{ value: string, label: string }[]}
 */
const toOptions = (labels) => [
  { value: ALL, label: "All" },
  ...Object.entries(labels).map(([value, label]) => ({ value, label })),
];

/**
 * @param {string | null} value
 * @param {Record<string, string>} labels
 * @returns {string}
 */
const pickKnown = (value, labels) =>
  value !== null && Object.hasOwn(labels, value) ? value : ALL;

/**
 * @returns {Filters}
 */
const takeInitialFilters = () => {
  const url = new URL(window.location.href);
  const space = pickKnown(url.searchParams.get("space"), SPACE_LABELS);

  if (url.search) {
    url.search = "";
    window.history.replaceState(null, "", url);
  }

  return { category: ALL, space };
};

/**
 * @param {Filters} filters
 * @returns {boolean}
 */
const hasActiveFilters = ({ category, space }) =>
  category !== ALL || space !== ALL;

/**
 * @param {Filters} first
 * @param {Filters} second
 * @returns {boolean}
 */
const isSameFilters = (first, second) =>
  first.category === second.category && first.space === second.space;

/**
 * @param {Plant[]} plants
 * @param {Filters} filters
 * @returns {Plant[]}
 */
const filterPlants = (plants, { category, space }) =>
  plants.filter(
    (plant) =>
      (category === ALL || plant.categories.includes(category)) &&
      (space === ALL || plant.spaces.includes(space)),
  );

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
 * @param {Plant[]} plants
 * @returns {HTMLElement[]}
 */
const createCards = (plants) =>
  plants.map((plant) => {
    const card = createPlantCard(plant, { headingLevel: "h2" });

    card.hidden = true;

    return card;
  });

/**
 * @param {() => void} onRetry
 */
export const showCatalogError = (onRetry) => {
  const message = document.querySelector("[data-catalog-message]");

  if (!(message instanceof HTMLElement)) return;

  renderCatalogMessage(message, {
    role: "alert",
    title: "We couldn't load the plants",
    text: "Check your connection and try again.",
    actionLabel: "Try again",
    onAction: onRetry,
  });
};

/**
 * @param {Plant[]} plants
 */
export const initCatalog = (plants) => {
  const grid = document.querySelector("[data-plant-grid]");
  const categoryContainer = document.querySelector('[data-filter="category"]');
  const spaceContainer = document.querySelector('[data-filter="space"]');
  const filtersBlock = document.querySelector("[data-catalog-filters]");
  const results = document.querySelector("[data-catalog-results]");
  const count = document.querySelector("[data-catalog-count]");
  const clearButton = document.querySelector("[data-clear-filters]");
  const message = document.querySelector("[data-catalog-message]");
  const showMoreWrap = document.querySelector("[data-show-more-wrap]");
  const showMoreButton = document.querySelector("[data-show-more]");

  if (
    !(grid instanceof HTMLElement) ||
    !(categoryContainer instanceof HTMLElement) ||
    !(spaceContainer instanceof HTMLElement) ||
    !(filtersBlock instanceof HTMLElement) ||
    !(results instanceof HTMLElement) ||
    !(count instanceof HTMLElement) ||
    !(clearButton instanceof HTMLElement) ||
    !(message instanceof HTMLElement) ||
    !(showMoreWrap instanceof HTMLElement) ||
    !(showMoreButton instanceof HTMLElement)
  ) {
    return;
  }

  let filters = takeInitialFilters();
  let currentPlants = filterPlants(plants, filters);
  let cards = /** @type {HTMLElement[]} */ ([]);
  let visibleCount = getPageSize();
  let swapTimer = 0;

  const setCategoryActive = initFilterGroup(
    categoryContainer,
    toOptions(CATEGORY_LABELS),
    (category) => applyFilters({ ...filters, category }),
  );

  const setSpaceActive = initFilterGroup(
    spaceContainer,
    toOptions(SPACE_LABELS),
    (space) => applyFilters({ ...filters, space }),
  );

  const resetFilters = () => applyFilters({ category: ALL, space: ALL });

  const refreshResults = () => {
    const total = currentPlants.length;

    count.textContent = `${total} ${total === 1 ? "plant" : "plants"}`;
    clearButton.hidden = !hasActiveFilters(filters);
    showMoreWrap.hidden = visibleCount >= total;

    if (total === 0) {
      renderCatalogMessage(message, {
        role: "status",
        title: "No plants match these filters",
        text: "Try another category or room to see more plants.",
        actionLabel: "Clear filters",
        onAction: resetFilters,
      });
    } else {
      clearCatalogMessage(message);
    }
  };

  const rebuildCards = () => {
    cards = createCards(currentPlants);
    grid.replaceChildren(...cards);

    updateVisibleCards(cards, visibleCount);
    refreshResults();
  };

  /**
   * @param {Filters} nextFilters
   */
  const applyFilters = (nextFilters) => {
    if (isSameFilters(filters, nextFilters)) return;

    filters = nextFilters;
    currentPlants = filterPlants(plants, filters);
    visibleCount = getPageSize();

    setCategoryActive(filters.category);
    setSpaceActive(filters.space);

    window.clearTimeout(swapTimer);
    grid.classList.add(GRID_LEAVING_CLASS);

    swapTimer = window.setTimeout(() => {
      rebuildCards();
      grid.classList.remove(GRID_LEAVING_CLASS);
    }, getTransitionTimeMs(grid));
  };

  const resetPagination = () => {
    visibleCount = getPageSize();

    updateVisibleCards(cards, visibleCount);
    refreshResults();
  };

  setCategoryActive(filters.category);
  setSpaceActive(filters.space);
  rebuildCards();

  filtersBlock.hidden = false;
  results.hidden = false;

  clearButton.addEventListener("click", resetFilters);

  showMoreButton.addEventListener("click", () => {
    if (grid.classList.contains(GRID_LEAVING_CLASS)) return;

    visibleCount += getPageSize();

    updateVisibleCards(cards, visibleCount);
    refreshResults();
  });

  Object.values(MEDIA_QUERIES).forEach((query) => {
    window.matchMedia(query).addEventListener("change", resetPagination);
  });
};
