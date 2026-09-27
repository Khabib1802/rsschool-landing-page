/** @type {Record<string, string>} */
export const CATEGORY_LABELS = {
  "easy-care": "Easy Care",
  "low-light": "Low Light",
  "pet-friendly": "Pet Friendly",
  tropical: "Tropical",
  succulent: "Succulents",
};

/**
 * @param {string} category
 * @returns {string}
 */
export const getCategoryLabel = (category) =>
  CATEGORY_LABELS[category] ?? category;

export const BREAKPOINTS = {
  mobile: 768,
  desktop: 1200,
};

export const MEDIA_QUERIES = {
  mobile: `(max-width: ${BREAKPOINTS.mobile}px)`,
  tablet: `(min-width: ${BREAKPOINTS.mobile + 1}px) and (max-width: ${BREAKPOINTS.desktop - 1}px)`,
  desktop: `(min-width: ${BREAKPOINTS.desktop}px)`,
};
