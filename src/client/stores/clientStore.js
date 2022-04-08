import { atom, action, onMount } from "nanostores";

const getDimension = () =>
  typeof window === "undefined"
    ? { width: 0, height: 0 }
    : { width: window.innerWidth, height: window.innerHeight };

export const clientStore = atom(getDimension());

export const updateClientStore = action(clientStore, "update", store =>
  store.set(getDimension())
);

onMount(clientStore, () => {
  if (typeof window === "undefined") return; // client only
  window.addEventListener("resize", updateClientStore);

  // cleanup event listener on dismount
  return () => window.removeEventListener("resize", updateClientStore);
});
