import { useStore } from "@nanostores/react";
import { atom, onMount } from "nanostores";

const isClient = atom(false);

/**
 * Enables client rendering. This should be called once in a useEffect or
 * useLayoutEffect in `<App/>`
 */
export function setIsClient() {
  isClient.set(true);
}

declare global {
  interface Window {
    toggleClientRendering: (val?: boolean) => void;
  }
}

onMount(isClient, () => {
  // skip if on serverside pre-render or production deployment
  if (
    typeof window == "undefined" ||
    process.env.NEXT_PUBLIC_VERCEL_ENV == "production"
  ) {
    return;
  }

  window.toggleClientRendering = val => {
    const current = isClient.get();
    isClient.set(val ?? !current);
  };

  console.log(
    "[DEBUG] Toggle client rendering with toggleClientRendering(val?: boolean)"
  );
});

/**
 * SSR-safe client detection. Returns `false` during SSR and Hydration, in
 * client sets state to `true` for second render.
 * @returns boolean
 */
export function useIsClient() {
  return useStore(isClient);
}
