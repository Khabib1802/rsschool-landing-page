import { loadPlants } from "./api.js";

/**
 * @typedef {import("./api.js").Plant} Plant
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
    category.textContent = plant.categories[0] ?? "";
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
 * @param {import("./api.js").Plant} plant
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

export const initModal = async () => {
  const modal = document.querySelector('[data-js="plant-modal"]');

  if (!(modal instanceof HTMLDialogElement)) {
    return;
  }

  const plants = await loadPlants();

  if (plants.length === 0) {
    return;
  }

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

    renderPlant(modal, plant);
    modal.showModal();
  });

  closeButton?.addEventListener("click", () => {
    closeModal(modal);
  });
};
