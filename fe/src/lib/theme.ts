export const THEME_KEY = "tercelo-theme";
export const FONT_KEY = "tercelo-font";

export type FontSize = "md" | "lg" | "xl";
export const FONT_SIZES: FontSize[] = ["md", "lg", "xl"];

/** Runs in <head> before first paint so the saved theme and text size never flash. Defaults: light, md. */
export const themeInitScript = `(function(){var d=document.documentElement;try{d.dataset.theme=localStorage.getItem("${THEME_KEY}")==="dark"?"dark":"light";var f=localStorage.getItem("${FONT_KEY}");d.dataset.font=f==="lg"||f==="xl"?f:"md"}catch(e){d.dataset.theme="light";d.dataset.font="md"}})()`;
