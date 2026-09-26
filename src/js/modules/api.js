/**
 * @typedef {Object} PlantPricing
 * @property {number} base
 * @property {number} [discount]
 */

/**
 * @typedef {Object} Plant
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} image
 * @property {string[]} categories
 * @property {PlantPricing} pricing
 */

/**
 * @returns {Promise<Plant[]>}
 */
export async function loadPlants() {
  try {
    const res = await fetch("./data/plants.json");

    if (!res.ok) {
      throw new Error(`Loading error: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Unable to load plant data:", error);
    return [];
  }
}
