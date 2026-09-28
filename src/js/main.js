import "../styles/main.scss";

import { initTheme } from "./modules/theme.js";
import { initBurgerMenu } from "./modules/burger.js";
import { loadPlants } from "./modules/api.js";
import { initCatalog, showCatalogError } from "./modules/catalog.js";
import { initModal } from "./modules/modal.js";
import { initSlider } from "./modules/slider.js";

initTheme();
initBurgerMenu();

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

PAGE_INITIALIZERS[document.body.dataset.page]?.();
