import { atom, action } from "nanostores";

export const uiStore = atom({
  mobileOpen: false,
  settingsMenuOpen: false
});

export const setMobileNavOpen = action(
  uiStore,
  "set mobileOpen state",
  (store, open) => {
    const value = store.get();
    const mobileOpen =
      typeof open === "function" ? open(value.mobileOpen) : open;

    store.set({
      ...value,
      mobileOpen
    });

    // scroll to top if nav is opening
    if (mobileOpen) {
      setTimeout(() => window?.scrollTo({ top: 0, behavior: "smooth" }));
    }
  }
);

export const setSettingsMenuOpen = action(
  uiStore,
  "set settingsMenuOpen state",
  (store, open) => {
    const value = store.get();
    const settingsMenuOpen =
      typeof open === "function" ? open(value.settingsMenuOpen) : open;

    if (typeof document !== "undefined") {
      // this fixes a bug in HomePage where the backdropFilter breaks fixed
      // positioning of the Modal component, causing inoperable ui.
      document.querySelector("#__next").style.backdropFilter = open
        ? "unset"
        : "";
    }

    store.set({
      ...value,
      settingsMenuOpen
    });
  }
);
