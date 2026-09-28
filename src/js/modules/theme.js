const THEMES = { LIGHT: "light", DARK: "dark" };
const STORAGE_KEY = "moss-theme";

const isValidTheme = (theme) => theme === THEMES.LIGHT || theme === THEMES.DARK;

const applyTheme = (theme) => {
  document.documentElement.dataset.theme = isValidTheme(theme)
    ? theme
    : THEMES.LIGHT;
};

const getPreferredTheme = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return isValidTheme(saved) ? saved : systemDark ? THEMES.DARK : THEMES.LIGHT;
};

const setTheme = (theme) => {
  if (!isValidTheme(theme)) return;
  applyTheme(theme);
  localStorage.setItem(STORAGE_KEY, theme);
};

const toggleTheme = () => {
  const theme = document.documentElement.dataset.theme || THEMES.LIGHT;
  const nextTheme = theme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
  setTheme(nextTheme);
};

const initTheme = (buttonSelector = "[data-theme-toggle]") => {
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);
  const buttons = document.querySelectorAll(buttonSelector);
  buttons.forEach((button) => button.addEventListener("click", toggleTheme));
};

export {
  THEMES,
  isValidTheme,
  applyTheme,
  getPreferredTheme,
  setTheme,
  toggleTheme,
  initTheme,
};
