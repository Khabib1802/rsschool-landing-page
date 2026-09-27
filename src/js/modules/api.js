/**
 * @typedef {import("../types.js").Plant} Plant
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
