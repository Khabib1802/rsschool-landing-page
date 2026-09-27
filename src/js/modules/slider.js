import { BREAKPOINTS } from "../constants.js";
import { createPlantCard } from "../components/plant-card.js";

const FEATURED_COUNT = 5;

/**
 * @param {import("../types.js").Plant[]} plants
 * @returns {import("../types.js").Plant[]}
 */
const shufflePlants = (plants) => {
  const shuffled = [...plants];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));

    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }

  return shuffled;
};

const getFeaturedPlants = (plants) =>
  shufflePlants(plants).slice(0, FEATURED_COUNT);

const getSlidesPerView = () => {
  if (window.innerWidth >= BREAKPOINTS.desktop) {
    return 3;
  }

  if (window.innerWidth > BREAKPOINTS.mobile) {
    return 2;
  }

  return 1;
};

/**
 * @param {import("../types.js").Plant} plant
 * @returns {HTMLLIElement}
 */
const createSlideCard = (plant) =>
  createPlantCard(plant, {
    as: "a",
    href: "./catalog.html",
    headingLevel: "h3",
    ariaLabel: `View ${plant.name} in the catalog`,
    itemClassName: "plant-slider__item",
  });

export const initSlider = (plants) => {
  const track = document.querySelector("[data-featured-track]");

  if (!track) return;

  const previousButton = document.querySelector("[data-slider-prev]");
  const nextButton = document.querySelector("[data-slider-next]");

  const featuredPlants = getFeaturedPlants(plants);

  let currentIndex = 0;
  let slidesPerView = getSlidesPerView();

  /**
   * @returns {number}
   */
  const getSlideStep = () => {
    const firstItem = track.firstElementChild;

    if (!(firstItem instanceof HTMLElement)) return 0;

    const trackGap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;

    return firstItem.getBoundingClientRect().width + trackGap;
  };

  const updatePosition = () => {
    const offset = currentIndex * getSlideStep();

    track.style.transform = `translateX(-${offset}px)`;
  };

  const updateControls = () => {
    const maxIndex = Math.max(0, featuredPlants.length - slidesPerView);

    if (currentIndex > maxIndex) {
      currentIndex = 0;
    }

    updatePosition();

    if (previousButton) {
      previousButton.disabled = featuredPlants.length <= slidesPerView;
    }

    if (nextButton) {
      nextButton.disabled = featuredPlants.length <= slidesPerView;
    }
  };

  const render = () => {
    track.replaceChildren(...featuredPlants.map(createSlideCard));

    updateControls();
  };

  previousButton?.addEventListener("click", () => {
    const maxIndex = Math.max(0, featuredPlants.length - slidesPerView);

    currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;

    updatePosition();
  });

  nextButton?.addEventListener("click", () => {
    const maxIndex = Math.max(0, featuredPlants.length - slidesPerView);

    currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;

    updatePosition();
  });

  window.addEventListener("resize", () => {
    const nextSlidesPerView = getSlidesPerView();

    if (nextSlidesPerView === slidesPerView) return;

    slidesPerView = nextSlidesPerView;
    currentIndex = 0;

    updateControls();
  });

  render();
};
