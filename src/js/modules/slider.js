import { createPlantCard } from "../components/plant-card.js";

const FEATURED_COUNT = 5;

const MAX_VISIBLE_SLIDES = 3;

const MOVE_FALLBACK_MS = 500;

/**
 * @typedef {import("../types.js").Plant} Plant
 */

/**
 * @param {Plant[]} plants
 * @returns {Plant[]}
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

/**
 * @param {Plant[]} plants
 * @returns {Plant[]}
 */
const getFeaturedPlants = (plants) =>
  shufflePlants(plants).slice(0, FEATURED_COUNT);

/**
 * @param {Plant} plant
 * @returns {HTMLLIElement}
 */
const createSlide = (plant) =>
  createPlantCard(plant, {
    headingLevel: "h3",
    itemClassName: "plant-slider__item",
  });

/**
 * @param {Plant} plant
 * @returns {HTMLLIElement}
 */
const createCloneSlide = (plant) => {
  const slide = createSlide(plant);

  slide.setAttribute("aria-hidden", "true");
  slide
    .querySelectorAll("button")
    .forEach((control) => control.setAttribute("tabindex", "-1"));

  return slide;
};

/**
 * @param {Plant[]} plants
 * @param {number} cloneCount
 * @returns {HTMLLIElement[]}
 */
const buildTrackItems = (plants, cloneCount) => {
  const headClones = plants.slice(-cloneCount).map(createCloneSlide);
  const realSlides = plants.map(createSlide);
  const tailClones = plants.slice(0, cloneCount).map(createCloneSlide);

  return [...headClones, ...realSlides, ...tailClones];
};

/**
 * @param {Plant[]} plants
 */
export const initSlider = (plants) => {
  const track = document.querySelector("[data-featured-track]");
  const previousButton = document.querySelector("[data-slider-prev]");
  const nextButton = document.querySelector("[data-slider-next]");

  if (!(track instanceof HTMLElement)) return;

  const featuredPlants = getFeaturedPlants(plants);
  const realCount = featuredPlants.length;

  if (realCount === 0) return;

  const cloneCount = Math.min(MAX_VISIBLE_SLIDES, realCount);

  const firstRealSlot = cloneCount;

  let currentSlot = firstRealSlot;
  let isMoving = false;
  let fallbackTimer = 0;

  /**
   * @returns {number}
   */
  const getSlideStep = () => {
    const firstSlide = track.firstElementChild;

    if (!(firstSlide instanceof HTMLElement)) return 0;

    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;

    return firstSlide.getBoundingClientRect().width + gap;
  };

  const applyPosition = () => {
    track.style.transform = `translateX(${-currentSlot * getSlideStep()}px)`;
  };

  /**
   * @param {number} slot
   */
  const jumpToSlot = (slot) => {
    currentSlot = slot;

    track.style.transition = "none";
    applyPosition();

    void track.offsetWidth;

    track.style.transition = "";
  };

  const finishMove = () => {
    window.clearTimeout(fallbackTimer);

    if (!isMoving) return;

    isMoving = false;

    if (currentSlot >= firstRealSlot + realCount) {
      jumpToSlot(currentSlot - realCount);
    } else if (currentSlot < firstRealSlot) {
      jumpToSlot(currentSlot + realCount);
    }
  };

  /**
   * @param {1 | -1} direction 1 = next, -1 = previous
   */
  const move = (direction) => {
    if (isMoving) return;

    isMoving = true;
    currentSlot += direction;
    applyPosition();

    fallbackTimer = window.setTimeout(finishMove, MOVE_FALLBACK_MS);
  };

  track.replaceChildren(...buildTrackItems(featuredPlants, cloneCount));
  jumpToSlot(firstRealSlot);

  track.addEventListener("transitionend", (event) => {
    if (event.target === track && event.propertyName === "transform") {
      finishMove();
    }
  });

  previousButton?.addEventListener("click", () => move(-1));
  nextButton?.addEventListener("click", () => move(1));

  window.addEventListener("resize", () => jumpToSlot(currentSlot));
};
