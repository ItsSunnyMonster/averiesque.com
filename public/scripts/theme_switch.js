const storageKey = "theme-preference";

const getColorPreference = () => {
  if (localStorage.getItem(storageKey)) return localStorage.getItem(storageKey);
  else
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
};

let theme = getColorPreference();

const setPreference = () => {
  localStorage.setItem(storageKey, theme);
  reflectPreference();
};

const reflectPreference = () => {
  document.firstElementChild.setAttribute("data-theme", theme);

  document.querySelector("#theme-toggle")?.setAttribute("aria-label", theme);
};

reflectPreference();

window.onload = () => {
  // set on load so screen readers can get the latest value on the button
  reflectPreference();

  // now this script can find and listen for clicks on the control
  document.querySelector("#theme-toggle").addEventListener("click", onClick);
};

const onClick = () => {
  theme = theme === "light" ? "dark" : "light";

  setPreference();
};

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", ({ matches: isDark }) => {
    theme = isDark ? "dark" : "light";
    setPreference();
  });
