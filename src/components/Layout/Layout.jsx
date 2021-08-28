import { useStore } from "nanostores/react";

import styles from "./Layout.module.css";
import { mobileNavState } from "@stores/mobileNavState";
import Navigation from "./Navigation";

export default function Layout({ isDesktop, children }) {
  const mobileOpen = useStore(mobileNavState);

  return (
    <>
      <div className={styles.wrapper}>
        {mobileOpen && <Navigation />}
        <div className={styles.inner}>
          {isDesktop && <Navigation />}
          <main>{children}</main>
        </div>
      </div>
    </>
  );
}
