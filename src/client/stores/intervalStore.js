import spacetime from "spacetime";
import { atom, action, onMount } from "nanostores";

class Timestamp {
  constructor() {
    this.interval = Date.now();
  }
  get seconds() {
    return Math.trunc(this.interval / 1000);
  }
  get s() {
    if (!this._s) this._s = spacetime(this.interval);

    return this._s;
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
