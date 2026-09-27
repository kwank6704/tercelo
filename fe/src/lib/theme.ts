export const THEME_KEY = "tercelo-theme";

/** Runs in <head> before first paint so the saved theme never flashes. Default: light. */
export const themeInitScript = `try{var t=localStorage.getItem("${THEME_KEY}");document.documentElement.dataset.theme=t==="dark"?"dark":"light"}catch(e){document.documentElement.dataset.theme="light"}`;
