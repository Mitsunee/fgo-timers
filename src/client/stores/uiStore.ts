import { atom, action } from "nanostores";
import type { ElementRef } from "react";

type UiStore = {
  mobileOpen: boolean;
  settingsMenuOpen: boolean;
};

export const uiStore = atom<UiStore>({
  mobileOpen: false,
  settingsMenuOpen: false
});

export const setMobileNavOpen = action(
  uiStore,
  "set mobileOpen state",
  (store, open: BooleanOrFn) => {
    const value = store.get();
    const mobileOpen: boolean =
      typeof open == "function" ? open(value.mobileOpen) : open;

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
  (store, open: BooleanOrFn) => {
    const value = store.get();
    const settingsMenuOpen: boolean =
      typeof open == "function" ? open(value.settingsMenuOpen) : open;

    if (typeof document != "undefined") {
      // this fixes a bug in HomePage where the backdropFilter breaks fixed
      // positioning of the Modal component, causing inoperable ui.
      const next = document.querySelector<ElementRef<"div">>("#__next")!;
      next.style.setProperty(
        "backdrop-filter",
        settingsMenuOpen ? "unset" : ""
      );
    }

    store.set({
      ...value,
      settingsMenuOpen
    });
  }
);
