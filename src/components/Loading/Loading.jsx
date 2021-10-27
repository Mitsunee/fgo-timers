import { useState, useEffect } from "react";

import styles from "./Loading.module.css";
import { useIsClient } from "@utils/hooks/useIsClient";
import Modal from "@components/Modal";

export default function Loading() {
  const [dots, setDots] = useState(0);
  const isClient = useIsClient();

  useEffect(() => {
    if (!isClient) return;
    const timeout = setTimeout(() => setDots((dots + 1) % 4), 500);
    return () => clearTimeout(timeout);
  }, [isClient, dots]);

  return (
    <Modal>
      <h1 className={styles.title}>Loading{".".repeat(dots)}</h1>
      <hr className={styles.line} />
      <img src="/assets/loading.png" alt="loading" className={styles.cat} />
    </Modal>
  );
}
