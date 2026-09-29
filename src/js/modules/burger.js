import { MEDIA_QUERIES } from "../constants.js";
import { lockScroll, unlockScroll } from "../utils/scroll-lock.js";

const LABEL_OPEN = "Open menu";
const LABEL_CLOSE = "Close menu";

/**
 * @returns {HTMLDivElement}
 */
const createScrim = () => {
  const scrim = document.createElement("div");

  scrim.className = "overlay-scrim nav-scrim";
  document.body.append(scrim);

  return scrim;
};

export const initBurgerMenu = () => {
  const button = document.querySelector(".burger");
  const nav = document.getElementById("primary-nav");

  if (!button || !nav) return;

  const scrim = createScrim();
  const mobileQuery = window.matchMedia(MEDIA_QUERIES.mobile);

  let isOpen = false;

  /**
   * @param {boolean} nextIsOpen
   */
  const setOpen = (nextIsOpen) => {
    if (nextIsOpen === isOpen) return;

    isOpen = nextIsOpen;

    nav.classList.toggle("header__nav--open", isOpen);
    scrim.classList.toggle("nav-scrim--visible", isOpen);
    button.classList.toggle("burger--active", isOpen);
    button.setAttribute("aria-expanded", String(isOpen));
    button.setAttribute("aria-label", isOpen ? LABEL_CLOSE : LABEL_OPEN);

    if (isOpen) {
      lockScroll();
    } else {
      unlockScroll();
    }
  };

  button.addEventListener("click", () => setOpen(!isOpen));

  scrim.addEventListener("click", () => setOpen(false));

  nav.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      setOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !isOpen) return;

    setOpen(false);
    button.focus();
  });

  mobileQuery.addEventListener("change", (event) => {
    if (!event.matches) {
      setOpen(false);
    }
  });
};
