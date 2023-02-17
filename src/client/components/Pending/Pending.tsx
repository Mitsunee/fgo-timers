import cc from "classcat";
import { useState, useEffect } from "react";

import styles from "./Pending.module.css";
import { useIsClient } from "@utils/hooks/useIsClient";
import type { CC } from "src/types/ComponentProps";

export function Pending({ className }: CC) {
  const [dots, setDots] = useState(0);
  const isClient = useIsClient();

  useEffect(() => {
    if (!isClient) return;
    const interval = setInterval(() => setDots(dots => (dots + 1) % 4), 500);
    return () => clearInterval(interval);
  }, [isClient]);

  return (
    <div className={cc(className)}>
      <h1 className={styles.title}>Loading{".".repeat(dots)}</h1>
      <img src="/assets/loading.png" alt="loading" className={styles.cat} />
    </div>
  );
}
