import { createStore, getValue } from "nanostores";

export const navigationStore = createStore(() => {
  navigationStore.set({
    mobileOpen: false,
    subMenusOpen: {}
  });
});

export function setMobileNavOpen(open) {
  const value = getValue(navigationStore);
  const mobileOpen = typeof open === "function" ? open(value.mobileOpen) : open;

  navigationStore.set({
    ...value,
    mobileOpen
  });

  // scroll to top if nav is opening
  if (mobileOpen) {
    setTimeout(() => window?.scrollTo({ top: 0, behavior: "smooth" }));
  }
}

export function setSubMenuOpen(key, open) {
  const value = getValue(navigationStore);
  const menuOpen =
    typeof open === "function" ? open(value.subMenusOpen[key] || false) : open;

  navigationStore.set({
    ...value,
    subMenusOpen: {
      ...value.subMenusOpen,
      [key]: menuOpen
    }
  });
}
