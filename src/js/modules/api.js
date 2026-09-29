/**
 * @typedef {import("../types.js").Plant} Plant
 */

/**
 * @returns {Promise<Plant[]>}
 */
const fetchPlants = async () => {
  const res = await fetch("./data/plants.json");

  if (!res.ok) {
    throw new Error(`Loading error: ${res.status}`);
  }

  const plants = await res.json();

  if (!Array.isArray(plants) || plants.length === 0) {
    throw new Error("Plant data is empty or malformed");
  }

  return plants;
};

/** @type {Promise<Plant[]> | null} */
let plantsRequest = null;

/**
 * @returns {Promise<Plant[]>}
 */
export const loadPlants = () => {
  plantsRequest ??= fetchPlants().catch((error) => {
    plantsRequest = null;

    throw error;
  });

  return plantsRequest;
};
