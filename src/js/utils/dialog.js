import { lockScroll, unlockScroll } from "./scroll-lock.js";
import { waitForTransitionEnd } from "./motion.js";

/**
 * @param {HTMLDialogElement} dialog
 */
export const initDialog = (dialog) => {
  let pressStartedOnBackdrop = false;

  dialog.addEventListener("pointerdown", (event) => {
    pressStartedOnBackdrop = event.target === dialog;
  });

  dialog.addEventListener("pointerup", (event) => {
    if (pressStartedOnBackdrop && event.target === dialog) {
      dialog.close();
    }

    pressStartedOnBackdrop = false;
  });

  dialog.addEventListener("close", async () => {
    await waitForTransitionEnd(dialog);
    unlockScroll();
  });
};

/**
 * @param {HTMLDialogElement} dialog
 */
export const openDialog = (dialog) => {
  if (dialog.open) return;

  lockScroll();
  dialog.showModal();
};
