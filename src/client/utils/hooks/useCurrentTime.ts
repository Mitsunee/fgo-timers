import spacetime from "spacetime";
import { atom, onMount } from "nanostores";
import { useStore } from "@nanostores/react";
import { msToSeconds } from "src/time/msToSeconds";

function createTimestamp() {
  const ms = Date.now();
  const sec = msToSeconds(ms);
  const s = spacetime(ms);

  return { ms, sec, s };
}

const store = atom(createTimestamp());
let interval: ReturnType<typeof setInterval>;

function tick() {
  store.set(createTimestamp());
}

function spawnInterval(length: number) {
  if (interval) clearInterval(interval);
  interval = setInterval(tick, length);
}

onMount(store, () => {
  if (typeof window === "undefined") return; // client only
  spawnInterval(1000);
  const onFocus = () => {
    spawnInterval(1000);
    tick();
  };
  const offFocus = () => spawnInterval(5000);

  window.addEventListener("focus", onFocus);
  window.addEventListener("blur", offFocus);

  return () => {
    clearInterval(interval);
    window.removeEventListener("focus", onFocus);
    window.removeEventListener("blur", offFocus);
  };
});

export function useCurrentTime(unit: "sec" | "ms" = "sec") {
  const state = useStore(store);
  return { current: state[unit], s: state.s };
}
