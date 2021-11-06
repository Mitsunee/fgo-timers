import { createStore } from "nanostores";

export const metaStore = createStore(() => {
  metaStore.set({
    title: "FGO Tools",
    description: ""
  });
});

export const setPageMeta = meta => {
  metaStore.set(meta);
};
