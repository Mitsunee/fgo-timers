import { useState, useEffect } from "react";

import styles from "./Loading.module.css";
import { useIsClient } from "@utils/hooks/useIsClient";

export default function Loading() {
  const [dots, setDots] = useState(0);
  const isClient = useIsClient();

  useEffect(() => {
    if (!isClient) return;
    const timeout = setTimeout(() => setDots((dots + 1) % 4), 500);
    return () => clearInterval(timeout);
  }, [isClient, dots]);

  // TODO: rewrite to use <Modal>

  return (
    <div className={styles.overlay}>
      <h1>Loading{".".repeat(dots)}</h1>
      <hr />
      <img src="/assets/loading.png" alt="loading" />
    </div>
  );
}
