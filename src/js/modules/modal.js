import { MAX_QUANTITY } from "../constants.js";
import {
  createPlantModal,
  fillPlantDetails,
} from "../components/plant-modal.js";
import {
  calculateTotalPrice,
  calculateUnitPrice,
  formatPrice,
} from "./pricing.js";
import { announce } from "../utils/announce.js";
import { initDialog, openDialog } from "../utils/dialog.js";
import { addItem } from "./cart-store.js";
import { playAddToCartAnimation } from "./cart-animation.js";

/**
 * @typedef {import("../types.js").Plant} Plant
 * @typedef {{ plant: Plant, size: string, pot: string, quantity: number }} ModalState
 */

/**
 * @param {Record<string, number>} record
 * @returns {string}
 */
const firstKey = (record) => Object.keys(record)[0];

/**
 * @param {Plant} plant
 * @returns {ModalState}
 */
const createInitialState = (plant) => ({
  plant,
  size: firstKey(plant.pricing.sizes),
  pot: firstKey(plant.pricing.pots),
  quantity: 1,
});

/**
 * @param {string} value
 * @returns {number | null}
 */
const parseQuantity = (value) => {
  const quantity = Number.parseInt(value, 10);

  if (Number.isNaN(quantity)) return null;

  return Math.min(Math.max(quantity, 1), MAX_QUANTITY);
};

/**
 * @returns {(plant: Plant) => void}
 */
const createModalController = () => {
  const { dialog, elements } = createPlantModal();

  document.body.append(dialog);
  initDialog(dialog);

  let state = /** @type {ModalState | null} */ (null);

  const render = () => {
    if (!state) return;

    const { plant, size, pot, quantity } = state;

    elements.options
      .querySelectorAll("input[data-option]")
      .forEach((input) => {
        if (!(input instanceof HTMLInputElement)) return;

        input.checked = input.value === state[input.dataset.option];
      });

    if (Number(elements.quantityInput.value) !== quantity) {
      elements.quantityInput.value = String(quantity);
    }

    elements.price.textContent = formatPrice(
      calculateTotalPrice(calculateUnitPrice(plant, size, pot), quantity),
    );
  };

  elements.options.addEventListener("change", (event) => {
    const input = event.target;

    if (!state || !(input instanceof HTMLInputElement)) return;

    const option = input.dataset.option;

    if (!option) return;

    state[option] = input.value;
    render();
  });

  elements.quantityInput.addEventListener("input", () => {
    const quantity = parseQuantity(elements.quantityInput.value);

    if (!state || quantity === null) return;

    state.quantity = quantity;
    render();
  });

  elements.quantityInput.addEventListener("change", render);

  elements.close.addEventListener("click", () => dialog.close());
  elements.submit.addEventListener("click", () => {
    if (!state) return;

    const { plant, size, pot, quantity } = state;
    const origin = elements.submit.getBoundingClientRect();

    addItem({ plantId: plant.id, size, pot, quantity });
    announce(`${plant.name} added to your collection`);

    dialog.close();
    playAddToCartAnimation(origin, plant.image);
  });

  return (plant) => {
    state = createInitialState(plant);

    fillPlantDetails(elements, plant);
    render();

    openDialog(dialog);
  };
};

/**
 * @param {Plant[]} plants
 */
export const initModal = (plants) => {
  let openPlant = null;

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;

    const card = event.target.closest("[data-plant-id]");

    if (!(card instanceof HTMLElement)) return;

    const plant = plants.find((item) => item.id === card.dataset.plantId);

    if (!plant) return;

    openPlant ??= createModalController();
    openPlant(plant);
  });
};
