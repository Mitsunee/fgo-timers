import { useStore } from "nanostores/react";

import styles from "./Header.module.css";
import { metaStore } from "@stores/metaStore";
import Floaters from "./Floaters";

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
        {isMobile && <Floaters inline />}
      </header>
      {!isMobile && <Floaters />}
    </>
  );
}
