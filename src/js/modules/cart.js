import { createCartDrawerController } from "./cart-drawer.js";
import { getCount, subscribe } from "./cart-store.js";

const MAX_BADGE_COUNT = 99;

export const initCart = () => {
  const button = document.querySelector("[data-cart-open]");
  const badge = document.querySelector("[data-cart-count]");

  if (!(button instanceof HTMLElement) || !(badge instanceof HTMLElement)) {
    return;
  }

  const renderBadge = () => {
    const count = getCount();

    badge.textContent =
      count > MAX_BADGE_COUNT ? `${MAX_BADGE_COUNT}+` : String(count);
    badge.hidden = count === 0;

    button.setAttribute(
      "aria-label",
      count === 0
        ? "Open collection"
        : `Open collection, ${count} ${count === 1 ? "item" : "items"}`,
    );
  };

  let drawer = null;

  subscribe(renderBadge);
  renderBadge();

  button.addEventListener("click", () => {
    drawer ??= createCartDrawerController();
    drawer.open();
  });
};
