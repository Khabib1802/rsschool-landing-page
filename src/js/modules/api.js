/**
 * @typedef {import("../types.js").Plant} Plant
 */

/**
 * @returns {Promise<Plant[]>}
 */
export async function loadPlants() {
  const res = await fetch("./data/plants.json");

  if (!res.ok) {
    throw new Error(`Loading error: ${res.status}`);
  }

  const plants = await res.json();

  if (!Array.isArray(plants) || plants.length === 0) {
    throw new Error("Plant data is empty or malformed");
  }

  return plants;
}
