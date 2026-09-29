import { MAX_QUANTITY } from "../constants.js";
import { readStorage, writeStorage } from "../utils/storage.js";

const STORAGE_KEY = "moss-cart";

/**
 * @typedef {import("../types.js").CartItem} CartItem
 * @typedef {(items: CartItem[]) => void} CartListener
 */

/**
 * @param {CartItem} item
 * @returns {string}
 */
export const getLineId = ({ plantId, size, pot }) =>
  `${plantId}:${size}:${pot}`;

/**
 * @param {number} quantity
 * @returns {number}
 */
const clampQuantity = (quantity) =>
  Math.min(Math.max(quantity, 1), MAX_QUANTITY);

/**
 * @param {unknown} item
 * @returns {boolean}
 */
const isValidItem = (item) =>
  typeof item === "object" &&
  item !== null &&
  typeof item.plantId === "string" &&
  typeof item.size === "string" &&
  typeof item.pot === "string" &&
  Number.isInteger(item.quantity) &&
  item.quantity >= 1;

/**
 * @param {string | null} raw
 * @returns {CartItem[]}
 */
const parseItems = (raw) => {
  if (!raw) return [];

  try {
    const data = JSON.parse(raw);

    if (!Array.isArray(data)) return [];

    return data.filter(isValidItem).map((item) => ({
      plantId: item.plantId,
      size: item.size,
      pot: item.pot,
      quantity: clampQuantity(item.quantity),
    }));
  } catch {
    return [];
  }
};

let items = parseItems(readStorage(STORAGE_KEY));

/** @type {Set<CartListener>} */
const listeners = new Set();

const notify = () => listeners.forEach((listener) => listener(items));

/**
 * @param {CartItem[]} nextItems
 */
const commit = (nextItems) => {
  items = nextItems;
  writeStorage(STORAGE_KEY, JSON.stringify(items));
  notify();
};

window.addEventListener("storage", (event) => {
  if (event.key !== null && event.key !== STORAGE_KEY) return;

  items = parseItems(readStorage(STORAGE_KEY));
  notify();
});

/**
 * @returns {CartItem[]}
 */
export const getItems = () => items;

/**
 * @returns {number}
 */
export const getCount = () =>
  items.reduce((sum, item) => sum + item.quantity, 0);

/**
 * @param {CartListener} listener
 * @returns {() => void}
 */
export const subscribe = (listener) => {
  listeners.add(listener);

  return () => listeners.delete(listener);
};

/**
 * @param {CartItem} item
 */
export const addItem = (item) => {
  const id = getLineId(item);
  const existing = items.find((current) => getLineId(current) === id);

  if (!existing) {
    commit([...items, { ...item, quantity: clampQuantity(item.quantity) }]);

    return;
  }

  commit(
    items.map((current) =>
      current === existing
        ? {
            ...current,
            quantity: clampQuantity(current.quantity + item.quantity),
          }
        : current,
    ),
  );
};

/**
 * @param {string} id
 * @param {number} quantity
 */
export const setQuantity = (id, quantity) => {
  commit(
    items.map((item) =>
      getLineId(item) === id
        ? { ...item, quantity: clampQuantity(quantity) }
        : item,
    ),
  );
};

/**
 * @param {string} id
 * @param {Partial<Pick<CartItem, "size" | "pot">>} changes
 */
export const changeOptions = (id, changes) => {
  const current = items.find((item) => getLineId(item) === id);

  if (!current) return;

  const updated = { ...current, ...changes };
  const updatedId = getLineId(updated);

  if (updatedId === id) return;

  const duplicate = items.find((item) => getLineId(item) === updatedId);

  if (!duplicate) {
    commit(items.map((item) => (item === current ? updated : item)));

    return;
  }

  commit(
    items
      .filter((item) => item !== current)
      .map((item) =>
        item === duplicate
          ? {
              ...item,
              quantity: clampQuantity(item.quantity + current.quantity),
            }
          : item,
      ),
  );
};

/**
 * @param {string} id
 */
export const removeItem = (id) => {
  commit(items.filter((item) => getLineId(item) !== id));
};

export const clearItems = () => commit([]);

/**
 * @param {(item: CartItem) => boolean} isKnown
 */
export const pruneItems = (isKnown) => {
  const nextItems = items.filter(isKnown);

  if (nextItems.length !== items.length) {
    commit(nextItems);
  }
};
