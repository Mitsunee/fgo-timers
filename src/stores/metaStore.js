import { atom, action } from "nanostores";

export const metaStore = atom({
  title: "FGO Tools",
  description: ""
});

export const setPageMeta = action(metaStore, "update", (store, meta) =>
  store.set(meta)
);
