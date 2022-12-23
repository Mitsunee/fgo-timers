import { useStore } from "@nanostores/react";
import { action, map } from "nanostores";

const store = map<Partial<Record<`${number}`, boolean>>>();
const toggle = action(
  store,
  "Set Spoiler State",
  (store, id: number, value?: boolean) => {
    const key = `${id}` as const;
    store.setKey(key, value ?? !(store.get()[key] ?? true));
  }
);

export function useSpoilerState(id: number) {
  const key = `${id}` as const;
  const { [key]: state } = useStore(store, { keys: [key] });
  const setter = (value?: boolean) => toggle(id, value);

  return [state ?? true, setter] as [boolean, typeof setter];
}
