import { useEffect } from "react";

import styles from "./Modal.module.css";

export default function Modal({ children, labelledBy }) {
  useEffect(() => {
    if (typeof document !== "undefined") {
      // disable document scrolling
      document.body.style.overflow = "hidden";

      // in cleanup check if other modals still exist, if not re-enable scrolling
      return () => {
        const query = document.querySelectorAll("[aria-modal='true']");
        if (query.length === 0) document.body.style.overflow = "";
      };
    }
  }, []);

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.content}
        aria-modal="true"
        aria-labelledby={labelledBy || undefined}>
        {children}
      </div>
    </div>
  );
}
