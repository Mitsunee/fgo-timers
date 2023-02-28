import { useStore } from "@nanostores/react";
import { action, map } from "nanostores";

const store = map<Partial<Record<`${number}`, boolean>>>();
const toggle = action(
  store,
  "Set Spoiler State",
  (store, id: number, value?: boolean) => {
    const key = `${id}` as const;
    // use value if given or invert current value in store.
    // If neither is given set as false
    store.setKey(key, value ?? !(store.get()[key] ?? true));
  }
);

/**
 * SSR-Safe store subscription to determine current spoiler state of an Entity (Servant, CE, Item)
 * @param id {number} id of selected Entity
 * @returns Tuple containing the current spoiler state as boolean (`true` if hidden, `false` if unhidden), and setter/toggle method for this Entity's state
 */
export function useSpoilerState(id: number) {
  const key = `${id}` as const;
  const { [key]: state } = useStore(store, { keys: [key] });
  /**
   * Toggle for Entity's spoiler state
   * @param value optionally override with value instead
   */
  const setter = (value?: boolean) => toggle(id, value);

  return [state ?? true, setter] as [boolean, typeof setter];
}
