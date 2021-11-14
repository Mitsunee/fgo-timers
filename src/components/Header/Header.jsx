import { useStore } from "nanostores/react";

import styles from "./Header.module.css";
import { metaStore } from "@stores/metaStore";
import { setMobileNavOpen } from "@stores/uiStore";
import { Button } from "@components/Button";
import { IconHamburger } from "@components/icons";

export default function Header({ isMobile }) {
  const meta = useStore(metaStore);

  return (
    <>
      <header className={styles.header}>
        <img src="/assets/icon_64.png" alt="FGO Tools" />
        <section>
          <h1>{meta.title}</h1>
          <h2>{meta.description}</h2>
        </section>
        {isMobile && (
          <Button
            onClick={() => setMobileNavOpen(state => !state)}
            iconComponent={IconHamburger}
            disableDefaultStyle
            className={styles.button}
          />
        )}
      </header>
    </>
  );
}
