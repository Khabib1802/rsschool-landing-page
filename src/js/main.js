import "../styles/main.scss";

import { initTheme } from "./modules/theme.js";
import { initSubmissionNotice } from "./modules/submission-notice.js";
import { loadPlants } from "./modules/api.js";
import { initCatalog } from "./modules/catalog.js";
import { initModal } from "./modules/modal.js";

initTheme();
initSubmissionNotice();

const init = async () => {
  const plants = await loadPlants();

  if (plants.length === 0) {
    return;
  }

  initCatalog(plants);
  initModal(plants);
};

init();
