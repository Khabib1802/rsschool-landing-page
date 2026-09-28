/**
 * @typedef {Object} CreateElementOptions
 * @property {string} [className]
 * @property {string} [text]
 * @property {Record<string, string>} [attrs]
 * @property {(Node | string)[]} [children]
 */

/**
 * @param {string} tag
 * @param {CreateElementOptions} [options]
 * @returns {HTMLElement}
 */
export const createElement = (tag, options = {}) => {
  const element = document.createElement(tag);
  const { className, text, attrs, children } = options;

  if (className) {
    element.className = className;
  }

  if (text !== undefined) {
    element.textContent = text;
  }

  if (attrs) {
    Object.entries(attrs).forEach(([name, value]) => {
      element.setAttribute(name, value);
    });
  }

  if (children) {
    element.append(...children);
  }

  return element;
};
