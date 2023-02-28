import { useState, useEffect } from "react";

/**
 * SSR-safe client detection. Returns `false` during SSR and Hydration, in client sets state to `true` for second render.
 * @returns boolean
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") setIsClient(true);
  }, []);

  return isClient;
}
