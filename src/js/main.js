import "../styles/main.scss";

import { initTheme } from "./modules/theme.js";
import { initBurgerMenu } from "./modules/burger.js";
import { loadPlants } from "./modules/api.js";
import { initCatalog } from "./modules/catalog.js";
import { initModal } from "./modules/modal.js";
import { initSlider } from "./modules/slider.js";

initTheme();
initBurgerMenu();

const init = async () => {
  const plants = await loadPlants();

  if (plants.length === 0) {
    return;
  }

  initCatalog(plants);
  initModal(plants);
  initSlider(plants);
};

init();
