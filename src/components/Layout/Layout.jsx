import { useStore } from "nanostores/react";

import styles from "./Layout.module.css";
import { uiStore } from "@stores/uiStore";
import Navigation from "./Navigation";

export default function Layout({ isDesktop, children }) {
  const { mobileOpen } = useStore(uiStore);

  return (
    <>
      <div className={styles.wrapper}>
        {mobileOpen && <Navigation />}
        <div
          className={
            isDesktop ? `${styles.inner} ${styles.desktop}` : styles.inner
          }>
          {isDesktop && <Navigation />}
          <main>{children}</main>
        </div>
      </div>
    </>
  );
}
