import { useState, useEffect } from "react";

export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") setIsClient(true);
  }, []);

  return isClient;
}
