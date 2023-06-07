import { useEffect } from "react";
import { createPortal } from "react-dom";
import cc from "classcat";
import styles from "./Modal.module.css";

interface ModalProps extends React.PropsWithChildren {
  labelledBy?: string;
  background?: boolean;
}

export function Modal({ children, labelledBy, background = true }: ModalProps) {
  useEffect(() => {
    if (typeof document == "undefined") return;

    // disable document scrolling
    document.body.style.overflow = "hidden";

    // in cleanup check if other modals still exist, if not re-enable scrolling
    return () => {
      const query = document.querySelectorAll("[aria-modal='true']");
      if (query.length === 0) document.body.style.overflow = "";
    };
  }, []);

  return (
    <>
      {createPortal(
        <div className={cc([styles.wrapper, background && styles.background])}>
          <div
            className={styles.content}
            aria-modal="true"
            aria-labelledby={labelledBy || undefined}>
            {children}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
