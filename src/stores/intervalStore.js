import spacetime from "spacetime";
import { atom, action, onMount } from "nanostores";

function makeTimestamp() {
  const now = Date.now();

  return {
    interval: now,
    seconds: Math.trunc(now / 1000),
    s: spacetime(now)
  };
}

export const intervalStore = atom(makeTimestamp());

export const updateInterval = action(intervalStore, "update", store =>
  store.set(makeTimestamp())
);

onMount(intervalStore, () => {
  if (typeof window === "undefined") return; // client only
  const interval = setInterval(updateInterval, 1000);

  // cleanup interval on dismount
  return () => clearInterval(interval);
});
