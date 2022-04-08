import { useStore } from "@nanostores/react";
import cc from "classcat";

import styles from "./Layout.module.css";
import { uiStore } from "@stores/uiStore";
import Navigation from "@components/Navigation";

export default function Layout({ isDesktop, children }) {
  const { mobileOpen } = useStore(uiStore);

  return (
    <>
      <div className={styles.wrapper}>
        {mobileOpen && <Navigation />}
        <div className={cc([styles.inner, isDesktop && styles.desktop])}>
          {isDesktop && <Navigation />}
          <main>{children}</main>
        </div>
      </div>
    </>
  );
}
