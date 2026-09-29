let lockCount = 0;

const getScrollbarWidth = () =>
  window.innerWidth - document.documentElement.clientWidth;

export const lockScroll = () => {
  lockCount += 1;

  if (lockCount === 1) {
    document.body.style.setProperty(
      "--scrollbar-width",
      `${getScrollbarWidth()}px`,
    );
    document.body.classList.add("is-scroll-locked");
  }
};

export const unlockScroll = () => {
  lockCount = Math.max(0, lockCount - 1);

  if (lockCount === 0) {
    document.body.classList.remove("is-scroll-locked");
  }
};
