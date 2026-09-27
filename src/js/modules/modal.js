import { calculateUnitPrice, calculateTotalPrice } from "./pricing.js";
import { getCategoryLabel } from "../constants.js";
import { lockScroll, unlockScroll } from "../utils/scroll-lock.js";

/**
 * @typedef {import("../types.js").Plant} Plant
 */

/**
 * @param {HTMLDialogElement} modal
 * @param {Plant} plant
 */
const renderPlant = (modal, plant) => {
  const image = modal.querySelector("[data-modal-image]");
  const category = modal.querySelector("[data-modal-category]");
  const name = modal.querySelector("[data-modal-name]");
  const description = modal.querySelector("[data-modal-description]");

  if (image instanceof HTMLImageElement) {
    image.src = plant.image;
    image.alt = plant.name;
  }

  if (category) {
    category.textContent = plant.categories.map(getCategoryLabel).join(" · ");
  }

  if (name) {
    name.textContent = plant.name;
  }

  if (description) {
    description.textContent = plant.description;
  }

  renderCharacteristics(modal, plant);
};

/**
 * @param {HTMLDialogElement} modal
 */
const closeModal = (modal) => {
  modal.close();
};

/**
 * @param {HTMLDialogElement} modal
 * @param {import("../types.js").Plant} plant
 */
const renderCharacteristics = (modal, plant) => {
  const characteristics = ["light", "water", "care"];

  characteristics.forEach((characteristic) => {
    const value = plant.characteristics[characteristic];

    const element = modal.querySelector(
      `[data-characteristic-value="${characteristic}"]`,
    );

    if (!element) return;

    element.replaceChildren();

    for (let index = 1; index <= 4; index += 1) {
      const indicator = document.createElement("span");

      indicator.className = "characteristic__indicator";

      if (index <= value) {
        indicator.classList.add("characteristic__indicator--active");
      }

      element.append(indicator);
    }
  });
};

/**
 * @param {HTMLDialogElement} modal
 * @param {import("../types.js").Plant} plant
 * @param {"small" | "medium" | "large"} size
 * @param {"none" | "ceramic" | "stone"} pot
 * @param {number} quantity
 */
const updatePrice = (modal, plant, size, pot, quantity) => {
  const priceElement = modal.querySelector("[data-modal-price]");

  if (!priceElement) return;

  const unitPrice = calculateUnitPrice(plant, size, pot);
  const totalPrice = calculateTotalPrice(unitPrice, quantity);

  priceElement.textContent = `$${totalPrice}`;
};

/**
 * @param {HTMLDialogElement} modal
 */
const resetOptions = (modal) => {
  const smallSize = modal.querySelector('[data-modal-size][value="small"]');

  const noPot = modal.querySelector('[data-modal-pot][value="none"]');

  const quantityInput = modal.querySelector("[data-modal-quantity]");

  if (smallSize instanceof HTMLInputElement) {
    smallSize.checked = true;
  }

  if (noPot instanceof HTMLInputElement) {
    noPot.checked = true;
  }

  if (quantityInput instanceof HTMLInputElement) {
    quantityInput.value = "1";
  }
};

/**
 * @param {import("../types.js").Plant[]} plants
 */
export const initModal = (plants) => {
  const modal = document.querySelector('[data-js="plant-modal"]');

  if (!(modal instanceof HTMLDialogElement)) {
    return;
  }

  let currentPlant = null;

  let selectedSize = "small";
  let selectedPot = "none";
  let quantity = 1;

  const sizeInputs = modal.querySelectorAll("[data-modal-size]");
  const potInputs = modal.querySelectorAll("[data-modal-pot]");
  const quantityInput = modal.querySelector("[data-modal-quantity]");

  sizeInputs.forEach((input) => {
    input.addEventListener("change", () => {
      if (!(input instanceof HTMLInputElement)) return;
      if (!currentPlant) return;

      selectedSize = input.value;

      updatePrice(modal, currentPlant, selectedSize, selectedPot, quantity);
    });
  });

  potInputs.forEach((input) => {
    input.addEventListener("change", () => {
      if (!(input instanceof HTMLInputElement)) return;
      if (!currentPlant) return;

      selectedPot = input.value;

      updatePrice(modal, currentPlant, selectedSize, selectedPot, quantity);
    });
  });

  quantityInput?.addEventListener("input", () => {
    if (!(quantityInput instanceof HTMLInputElement)) return;
    if (!currentPlant) return;

    const value = Number.parseInt(quantityInput.value, 10);

    quantity = Number.isNaN(value) || value < 1 ? 1 : value;

    quantityInput.value = String(quantity);

    updatePrice(modal, currentPlant, selectedSize, selectedPot, quantity);
  });

  const closeButton = modal.querySelector("[data-modal-close]");

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const card = event.target.closest("[data-plant-id]");

    if (!card) {
      return;
    }

    const plantId = card.dataset.plantId;

    if (!plantId) {
      return;
    }

    const plant = plants.find((item) => item.id === plantId);

    if (!plant) {
      return;
    }

    currentPlant = plant;

    selectedSize = "small";
    selectedPot = "none";
    quantity = 1;

    resetOptions(modal);
    renderPlant(modal, plant);

    updatePrice(modal, plant, selectedSize, selectedPot, quantity);

    lockScroll();
    modal.showModal();
  });

  closeButton?.addEventListener("click", () => {
    closeModal(modal);
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal(modal);
    }
  });

  modal.addEventListener("close", () => {
    unlockScroll();
  });

  const submitButton = modal.querySelector("[data-modal-submit]");

  submitButton?.addEventListener("click", () => {
    closeModal(modal);
  });
};
