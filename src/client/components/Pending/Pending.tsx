import cc from "classcat";
import { useState, useEffect } from "react";

import styles from "./Pending.module.css";
import { useIsClient } from "@utils/hooks/useIsClient";
import { CC } from "src/types/ComponentProps";

export default function Pending({ className }: CC) {
  const [dots, setDots] = useState(0);
  const isClient = useIsClient();

  useEffect(() => {
    if (!isClient) return;
    const timeout = setTimeout(() => setDots((dots + 1) % 4), 500);
    return () => clearTimeout(timeout);
  }, [isClient, dots]);

  return (
    <div className={cc(className)}>
      <h1 className={styles.title}>Loading{".".repeat(dots)}</h1>
      <img src="/assets/loading.png" alt="loading" className={styles.cat} />
    </div>
  );
}
