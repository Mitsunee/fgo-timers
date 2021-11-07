import spacetime from "spacetime";
import { createStore } from "nanostores";

function _makeTimestamp() {
  const now = Date.now();

  return {
    interval: now,
    seconds: Math.trunc(now / 1000),
    s: spacetime(now)
  };
}

export const intervalStore = createStore(() => {
  const update = () => intervalStore.set(_makeTimestamp());
  update(); // set initial values

  if (typeof window === "undefined") return; // no interval on server
  const interval = setInterval(update, 1000);

  return () => clearInterval(interval);
});

export function forceUpdateInterval() {
  intervalStore.set(_makeTimestamp());
}
