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
};

/**
 * @param {HTMLDialogElement} modal
 */
const closeModal = (modal) => {
  modal.close();
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
