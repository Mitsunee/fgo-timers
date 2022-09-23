import { useStore } from "@nanostores/react";

import styles from "./Layout.module.css";
import { uiStore } from "@stores/uiStore";
import Navigation from "@components/Navigation";

export default function Layout({ children }) {
  const { mobileOpen } = useStore(uiStore);

  return (
    <div className={styles.wrapper}>
      {mobileOpen && <Navigation />}
      <div className={styles.inner}>
        <Navigation />
        <main>{children}</main>
      </div>
    </div>
  );
}
