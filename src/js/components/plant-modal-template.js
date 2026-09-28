const PLANT_MODAL_HTML = `
<dialog class="plant-modal" aria-labelledby="plant-modal-title">
  <div class="plant-modal__content">
    <button class="plant-modal__close" type="button" data-modal-close aria-label="Close plant details">
      ×
    </button>

    <div class="plant-modal__image-wrap">
      <img class="plant-modal__image" data-modal-image src="" alt="" width="640" height="800">
    </div>

    <div class="plant-modal__body">
      <p class="plant-modal__category" data-modal-category></p>

      <h2 class="plant-modal__name" id="plant-modal-title" data-modal-name></h2>

      <p class="plant-modal__description" data-modal-description></p>

      <div class="plant-modal__characteristics">
        <div class="characteristic" data-characteristic="light">
          <span class="characteristic__label">Light</span>
          <span class="characteristic__value" data-characteristic-value="light"></span>
        </div>

        <div class="characteristic" data-characteristic="water">
          <span class="characteristic__label">Water</span>
          <span class="characteristic__value" data-characteristic-value="water"></span>
        </div>

        <div class="characteristic" data-characteristic="care">
          <span class="characteristic__label">Care</span>
          <span class="characteristic__value" data-characteristic-value="care"></span>
        </div>
      </div>

      <div class="plant-modal__options">
        <fieldset class="plant-modal__option">
          <legend>Size</legend>

          <label>
            <input type="radio" name="plant-size" value="small" data-modal-size checked>
            <span>Small</span>
          </label>

          <label>
            <input type="radio" name="plant-size" value="medium" data-modal-size>
            <span>Medium</span>
          </label>

          <label>
            <input type="radio" name="plant-size" value="large" data-modal-size>
            <span>Large</span>
          </label>
        </fieldset>

        <fieldset class="plant-modal__option">
          <legend>Pot</legend>

          <label>
            <input type="radio" name="plant-pot" value="none" data-modal-pot checked>
            <span>None</span>
          </label>

          <label>
            <input type="radio" name="plant-pot" value="ceramic" data-modal-pot>
            <span>Ceramic</span>
          </label>

          <label>
            <input type="radio" name="plant-pot" value="stone" data-modal-pot>
            <span>Stone</span>
          </label>
        </fieldset>

        <div class="plant-modal__quantity">
          <label for="plant-quantity">Quantity</label>

          <input id="plant-quantity" type="number" min="1" value="1" data-modal-quantity>
        </div>
      </div>

      <p class="plant-modal__price" data-modal-price aria-live="polite"></p>

      <button class="button button--primary" type="button" data-modal-submit>
        Add to collection
      </button>
    </div>
  </div>
</dialog>
`;

/**
 * @returns {HTMLDialogElement}
 */
export const createPlantModal = () => {
  const template = document.createElement("template");

  template.innerHTML = PLANT_MODAL_HTML.trim();

  return /** @type {HTMLDialogElement} */ (template.content.firstElementChild);
};
