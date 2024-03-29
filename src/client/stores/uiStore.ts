import { action, atom, onMount } from "nanostores";
import Router from "next/router";
import { queryMap } from "~/client/styles/media";

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
  }
);

export const setSettingsMenuOpen = action(
  uiStore,
  "set settingsMenuOpen state",
  (store, open: BooleanOrFn) => {
    const value = store.get();
    const settingsMenuOpen: boolean =
      typeof open == "function" ? open(value.settingsMenuOpen) : open;

    store.set({
      ...value,
      settingsMenuOpen
    });
  }
);

onMount(uiStore, () => {
  if (typeof window == "undefined") return;

  const hideNav = () => setMobileNavOpen(false);
  const query = queryMap.get("large")!;
  const media = window.matchMedia(query);
  const listener = () => {
    if (media.matches) hideNav();
  };

  Router.events.on("routeChangeStart", hideNav);

  if (media.addEventListener) {
    media.addEventListener("change", listener);
  } else {
    media.addListener(listener);
  }

  return () => {
    if (media.removeEventListener) {
      media.removeEventListener("change", listener);
    } else {
      media.removeListener(listener);
    }
    Router.events.off("routeChangeStart", hideNav);
  };
});
