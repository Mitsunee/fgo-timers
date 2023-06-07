import { useStore } from "@nanostores/react";
import { atom } from "nanostores";

const isClient = atom(false);

/**
 * Enables client rendering. This should be called once in a useEffect or
 * useLayoutEffect in `<App/>`
 */
export function setIsClient() {
  isClient.set(true);
}

/**
 * SSR-safe client detection. Returns `false` during SSR and Hydration, in
 * client sets state to `true` for second render.
 * @returns boolean
 */
export function useIsClient() {
  return useStore(isClient);
}
