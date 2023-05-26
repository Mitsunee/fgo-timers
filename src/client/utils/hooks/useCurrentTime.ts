import { useStore } from "@nanostores/react";
import { atom, onMount } from "nanostores";
import spacetime from "spacetime";
import { msToSeconds } from "~/time/msToSeconds";

/**
 * Creates new spacetime instance and extract current time in sec and ms units
 * @returns Object { ms, sec, s };
 */
function createTimestamp() {
  const s = spacetime.now();
  const ms = s.epoch;
  const sec = msToSeconds(ms);

  return { ms, sec, s };
}

const store = atom(createTimestamp());
let interval: ReturnType<typeof setInterval>;

/**
 * Updates store with fresh timestamp object
 */
function tick() {
  store.set(createTimestamp());
}

/**
 * Clears previous interval (if any) and creates new one. Does not automatically tick on creation!
 * @param length interval length in milliseconds
 */
function spawnInterval(length: number) {
  if (interval) clearInterval(interval);
  interval = setInterval(tick, length);
}

onMount(store, () => {
  if (typeof window === "undefined") return; // client only
  spawnInterval(1000);
  /**
   * Spawn new interval and tick once immediatly
   */
  const onFocus = () => {
    spawnInterval(1000);
    tick();
  };
  /**
   * Spawns new interval with longer length
   */
  const offFocus = () => spawnInterval(5000);

  window.addEventListener("focus", onFocus);
  window.addEventListener("blur", offFocus);

  return () => {
    clearInterval(interval);
    window.removeEventListener("focus", onFocus);
    window.removeEventListener("blur", offFocus);
  };
});

/**
 * Hook to get current time as number and spacetime instance
 * @param unit Selected unit, either "ms" or "sec". (default: "sec")
 * @returns Object state containing time in selected unit as "current" and spacetime instance as "s"
 */
export function useCurrentTime(unit: "sec" | "ms" = "sec") {
  const state = useStore(store);
  return { current: state[unit], s: state.s };
}
