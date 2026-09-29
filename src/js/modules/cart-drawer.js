import { MAX_QUANTITY } from "../constants.js";
import { createCartDrawer } from "../components/cart-drawer.js";
import { createCartRow, updateCartRow } from "../components/cart-row.js";
import { initDialog, openDialog } from "../utils/dialog.js";
import { loadPlants } from "./api.js";
import {
  changeOptions,
  clearItems,
  getItems,
  getLineId,
  pruneItems,
  removeItem,
  setQuantity,
  subscribe,
} from "./cart-store.js";
import {
  calculateTotalPrice,
  calculateUnitPrice,
  formatPrice,
} from "./pricing.js";

/**
 * @typedef {import("../types.js").Plant} Plant
 * @typedef {import("../types.js").CartItem} CartItem
 */

/**
 * @param {number} count
 * @returns {string}
 */
const formatItemCount = (count) => `${count} ${count === 1 ? "item" : "items"}`;

/**
 * @param {Plant | undefined} plant
 * @param {CartItem} item
 * @returns {boolean}
 */
const isKnownItem = (plant, item) =>
  Boolean(plant) &&
  Object.hasOwn(plant.pricing.sizes, item.size) &&
  Object.hasOwn(plant.pricing.pots, item.pot);

/**
 * @returns {{ open: () => void }}
 */
export const createCartDrawerController = () => {
  const { dialog, elements } = createCartDrawer();

  document.body.append(dialog);
  initDialog(dialog);

  const rows = new Map();

  let plants = /** @type {Plant[] | null} */ (null);
  let completedOrder = /** @type {{ total: number, count: number } | null} */ (
    null
  );
  let pendingFocus = /** @type {{ id: string, field: string } | null} */ (null);

  /**
   * @param {string} plantId
   * @returns {Plant | undefined}
   */
  const findPlant = (plantId) => plants?.find((plant) => plant.id === plantId);

  /**
   * @param {CartItem} item
   * @returns {number}
   */
  const getLineTotal = (item) =>
    calculateTotalPrice(
      calculateUnitPrice(findPlant(item.plantId), item.size, item.pot),
      item.quantity,
    );

  /**
   * @param {"items" | "empty" | "status" | "done"} name
   */
  const showView = (name) => {
    Object.entries(elements.views).forEach(([key, view]) => {
      view.hidden = key !== name;
    });

    elements.footer.hidden = name !== "items";
    elements.count.hidden = name !== "items";
  };

  /**
   * @param {string} text
   * @param {boolean} canRetry
   */
  const showStatus = (text, canRetry) => {
    elements.statusText.textContent = text;
    elements.retry.hidden = !canRetry;
    elements.retry.removeAttribute("disabled");

    showView("status");
  };

  /**
   * @param {CartItem[]} items
   */
  const syncRows = (items) => {
    const ids = new Set(items.map(getLineId));

    rows.forEach((row, id) => {
      if (ids.has(id)) return;

      row.element.remove();
      rows.delete(id);
    });

    items.forEach((item, index) => {
      const id = getLineId(item);
      const plant = /** @type {Plant} */ (findPlant(item.plantId));

      let row = rows.get(id);

      if (!row) {
        row = createCartRow(plant, item);
        rows.set(id, row);
      }

      updateCartRow(row, plant, item);

      const current = elements.list.children[index];

      if (current !== row.element) {
        elements.list.insertBefore(row.element, current ?? null);
      }
    });
  };

  const render = () => {
    const items = getItems();

    if (completedOrder) {
      elements.doneText.textContent = `This is a demo checkout, so nothing was charged and no order was placed. Order total: ${formatPrice(completedOrder.total)} for ${formatItemCount(completedOrder.count)}.`;
      showView("done");

      return;
    }

    if (items.length === 0) {
      showView("empty");

      return;
    }

    syncRows(items);

    elements.count.textContent = formatItemCount(
      items.reduce((sum, item) => sum + item.quantity, 0),
    );
    elements.total.textContent = formatPrice(
      items.reduce((sum, item) => sum + getLineTotal(item), 0),
    );

    showView("items");

    if (pendingFocus) {
      rows.get(pendingFocus.id)?.refs.selects[pendingFocus.field]?.focus();
      pendingFocus = null;
    }
  };

  /**
   * @returns {Promise<boolean>}
   */
  const ensurePlants = async () => {
    if (plants) return true;

    showStatus("Loading your collection…", false);

    try {
      plants = await loadPlants();

      return true;
    } catch (error) {
      console.error("Unable to load plant data:", error);
      showStatus("We couldn't load your collection.", true);

      return false;
    }
  };

  const refresh = async () => {
    if (!dialog.open) return;

    const needsPlants = getItems().length > 0 && !completedOrder;

    if (needsPlants && !(await ensurePlants())) return;

    if (plants && needsPlants) {
      const knownPlants = plants;

      pruneItems((item) =>
        isKnownItem(
          knownPlants.find((plant) => plant.id === item.plantId),
          item,
        ),
      );
    }

    render();
  };

  subscribe(refresh);

  elements.close.addEventListener("click", () => dialog.close());
  elements.continueButton.addEventListener("click", () => dialog.close());
  elements.retry.addEventListener("click", () => {
    elements.retry.setAttribute("disabled", "");
    refresh();
  });

  elements.checkout.addEventListener("click", () => {
    const items = getItems();

    completedOrder = {
      total: items.reduce((sum, item) => sum + getLineTotal(item), 0),
      count: items.reduce((sum, item) => sum + item.quantity, 0),
    };

    clearItems();
  });

  elements.list.addEventListener("click", (event) => {
    const button =
      event.target instanceof Element
        ? event.target.closest("[data-action]")
        : null;
    const row = button?.closest("[data-line-id]");

    if (!(button instanceof HTMLElement) || !(row instanceof HTMLElement)) {
      return;
    }

    const id = row.dataset.lineId ?? "";
    const item = getItems().find((current) => getLineId(current) === id);

    if (!item) return;

    switch (button.dataset.action) {
      case "increase":
        setQuantity(id, Math.min(item.quantity + 1, MAX_QUANTITY));
        break;
      case "decrease":
        setQuantity(id, Math.max(item.quantity - 1, 1));
        break;
      case "remove": {
        const neighbour = row.nextElementSibling ?? row.previousElementSibling;
        const nextFocus = neighbour?.querySelector('[data-action="remove"]');

        removeItem(id);

        (nextFocus instanceof HTMLElement ? nextFocus : elements.close).focus();
        break;
      }
    }
  });

  elements.list.addEventListener("change", (event) => {
    const select = event.target;
    const row =
      select instanceof Element ? select.closest("[data-line-id]") : null;

    if (!(select instanceof HTMLSelectElement)) return;
    if (!(row instanceof HTMLElement)) return;

    const id = row.dataset.lineId ?? "";
    const field = select.dataset.field ?? "";
    const item = getItems().find((current) => getLineId(current) === id);

    if (!item || !field) return;

    pendingFocus = { id: getLineId({ ...item, [field]: select.value }), field };

    changeOptions(id, { [field]: select.value });
  });

  return {
    open: () => {
      completedOrder = null;

      openDialog(dialog);
      refresh();
    },
  };
};
