import "../styles/main.scss";

import { initTheme } from "./modules/theme.js";
import { initBurgerMenu } from "./modules/burger.js";
import { initHeader } from "./modules/header.js";
import { initCart } from "./modules/cart.js";
import { initAnchorScroll } from "./modules/anchor-scroll.js";
import { loadPlants } from "./modules/api.js";
import { initCatalog, showCatalogError } from "./modules/catalog.js";
import { initModal } from "./modules/modal.js";
import { initSlider } from "./modules/slider.js";

initTheme();
initHeader();
initBurgerMenu();
initCart();

const fetchPlants = async (onError) => {
  try {
    return await loadPlants();
  } catch (error) {
    console.error("Unable to load plant data:", error);
    onError?.();

    return null;
  }
};

const initHomePage = async () => {
  const plants = await fetchPlants();

  if (!plants) return;

  initSlider(plants);
  initModal(plants);
};

const initCatalogPage = async () => {
  const plants = await fetchPlants(() => showCatalogError(initCatalogPage));

  if (!plants) return;

  initCatalog(plants);
  initModal(plants);
};

const PAGE_INITIALIZERS = {
  home: initHomePage,
  catalog: initCatalogPage,
};

const pageReady = PAGE_INITIALIZERS[document.body.dataset.page]?.();

initAnchorScroll(pageReady);
