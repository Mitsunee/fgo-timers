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

    console.log({ value, settingsMenuOpen });

    store.set({
      ...value,
      settingsMenuOpen
    });
  }
);
