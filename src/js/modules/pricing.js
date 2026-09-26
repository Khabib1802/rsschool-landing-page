/**
 * @param {import("./api.js").Plant} plant
 * @param {"small" | "medium" | "large"} size
 * @param {"none" | "ceramic" | "stone"} pot
 * @returns {number}
 */
export const calculateUnitPrice = (plant, size, pot) => {
  return (
    plant.pricing.base + plant.pricing.sizes[size] + plant.pricing.pots[pot]
  );
};

/**
 * @param {number} unitPrice
 * @param {number} quantity
 * @returns {number}
 */
export const calculateTotalPrice = (unitPrice, quantity) => {
  return unitPrice * quantity;
};
