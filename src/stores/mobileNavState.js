import { createStore, getValue } from "nanostores";

export const mobileNavState = createStore(() => {
  mobileNavState.set(false);
});

export function setMobileNavOpen(value) {
  const newValue =
    typeof value === "function" ? value(getValue(mobileNavState)) : value;

  // scroll to top if nav is opening
  if (newValue) {
    setTimeout(() => window?.scrollTo({ top: 0, behavior: "smooth" }));
  }

  mobileNavState.set(newValue);
}
