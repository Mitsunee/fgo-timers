import spacetime from "spacetime";
import { atom, action, onMount } from "nanostores";

class Timestamp {
  interval: number;
  seconds: number;
  s: ReturnType<typeof spacetime>;

  constructor() {
    this.interval = Date.now();
    this.seconds = Math.trunc(this.interval / 1000);
    this.s = spacetime(this.interval);
  }
}

export const intervalStore = atom(new Timestamp());

export const updateInterval = action(intervalStore, "update", store =>
  store.set(new Timestamp())
);

onMount(intervalStore, () => {
  if (typeof window === "undefined") return; // client only
  const interval = setInterval(updateInterval, 1000);

  // cleanup interval on dismount
  return () => clearInterval(interval);
});
