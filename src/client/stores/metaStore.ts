import { action, atom } from "nanostores";

type MetaStoreProps = {
  title: string;
  description: string;
};

export const metaStore = atom<MetaStoreProps>({
  title: "FGO Timers",
  description: "This website is no longer maintained"
});

export const setPageMeta = action(
  metaStore,
  "update",
  (store, meta: MetaStoreProps) => store.set(meta)
);
