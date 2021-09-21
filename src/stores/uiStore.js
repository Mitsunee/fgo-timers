import { createStore, getValue } from "nanostores";

export const uiStore = createStore(() => {
  uiStore.set({
    mobileOpen: false,
    settingsMenuOpen: false,
    subMenusOpen: {},
    apTrackerMenuOpen: false
  });
});

export function setMobileNavOpen(open) {
  const value = getValue(uiStore);
  const mobileOpen = typeof open === "function" ? open(value.mobileOpen) : open;

  uiStore.set({
    ...value,
    mobileOpen
  });

  // scroll to top if nav is opening
  if (mobileOpen) {
    setTimeout(() => window?.scrollTo({ top: 0, behavior: "smooth" }));
  }
}

export function setSubMenuOpen(key, open) {
  const value = getValue(uiStore);
  const menuOpen =
    typeof open === "function" ? open(value.subMenusOpen[key] || false) : open;

  uiStore.set({
    ...value,
    subMenusOpen: {
      ...value.subMenusOpen,
      [key]: menuOpen
    }
  });
}

export function setSettingsMenuOpen(open) {
  const value = getValue(uiStore);
  const settingsMenuOpen =
    typeof open === "function" ? open(value.settingsMenuOpen) : open;

  uiStore.set({
    ...value,
    settingsMenuOpen
  });
}

export function setApTrackerMenuOpen(open) {
  const value = getValue(uiStore);
  const apTrackerMenuOpen =
    typeof open === "function" ? open(value.apTrackerMenuOpen) : open;

  uiStore.set({
    ...value,
    apTrackerMenuOpen
  });
}
