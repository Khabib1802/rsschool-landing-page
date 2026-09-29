export const initHeader = () => {
  const header = document.querySelector(".header");

  if (!(header instanceof HTMLElement)) return;

  const updateHeight = () => {
    document.documentElement.style.setProperty(
      "--header-height",
      `${header.offsetHeight}px`,
    );
  };

  updateHeight();

  new ResizeObserver(updateHeight).observe(header);
};
