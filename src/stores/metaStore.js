import { createStore } from "nanostores";

export const metaStore = createStore(() => {
  metaStore.set({
    title: "FGO Tools",
    description: "BOTTOM TEXT"
  });
});

export const setPageMeta = meta => {
  metaStore.set(meta);
};
