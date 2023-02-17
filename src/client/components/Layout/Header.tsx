import Link from "next/link";
import { useStore } from "@nanostores/react";
import spacetime from "spacetime";

import styles from "./Header.module.css";
import { metaStore } from "@stores/metaStore";
import { setMobileNavOpen, uiStore } from "@stores/uiStore";
import { ActionButton } from "@components/Button";
import { IconHamburger } from "@components/icons";

export function Header() {
  const meta = useStore(metaStore);
  const { mobileOpen } = useStore(uiStore);
  const s = spacetime.now();
  const isPadoru = s.format("month-short") === "Dec" && s.date() <= 27;

  return (
    <>
      <header className={styles.header}>
        <Link href="/" title="FGO Tools">
          <img src={`/icon-${isPadoru ? "padoru" : 64}.png`} alt="FGO Tools" />
        </Link>
        <section>
          <h1>{meta.title}</h1>
          <h2>{meta.description}</h2>
        </section>
        <ActionButton
          onClick={() => setMobileNavOpen(true)}
          icon={IconHamburger}
          decorated={false}
          className={styles.button}
          aria-controls="main-menu"
          aria-expanded={mobileOpen ? "true" : "false"}
        />
      </header>
    </>
  );
}
