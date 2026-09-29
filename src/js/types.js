/**
 * @typedef {Object} PlantCharacteristics
 * @property {number} light
 * @property {number} water
 * @property {number} care
 */

/**
 * @typedef {Object} PlantPricing
 * @property {number} base
 * @property {Object} sizes
 * @property {number} sizes.small
 * @property {number} sizes.medium
 * @property {number} sizes.large
 * @property {Object} pots
 * @property {number} pots.none
 * @property {number} pots.ceramic
 * @property {number} pots.stone
 */

/**
 * @typedef {Object} Plant
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} image
 * @property {string[]} categories
 * @property {string[]} spaces
 * @property {PlantCharacteristics} characteristics
 * @property {PlantPricing} pricing
 */

/**
 * @typedef {Object} CartItem
 * @property {string} plantId
 * @property {string} size
 * @property {string} pot
 * @property {number} quantity
 */

export {};
