import { useState, useEffect } from "react";

import styles from "./Pending.module.css";
import { useIsClient } from "@utils/hooks/useIsClient";

export default function Pending() {
  const [dots, setDots] = useState(0);
  const isClient = useIsClient();

  useEffect(() => {
    if (!isClient) return;
    const timeout = setTimeout(() => setDots((dots + 1) % 4), 500);
    return () => clearTimeout(timeout);
  }, [isClient, dots]);

  return (
    <div>
      <h1 className={styles.title}>Loading{".".repeat(dots)}</h1>
      <img src="/assets/loading.png" alt="loading" className={styles.cat} />
    </div>
  );
}
