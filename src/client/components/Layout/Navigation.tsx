import { useRouter } from "next/router";
import cc from "classcat";

import {
  setMobileNavOpen,
  setSettingsMenuOpen
} from "src/client/stores/uiStore";
import { LinkButton, ActionButton } from "src/client/components/Button";
import { navRoutes, isActiveRoute } from "./navRoutes";
import {
  IconSettings,
  IconDiscord,
  IconGithub,
  IconChaldea
} from "src/client/components/icons";
import styles from "./Navigation.module.css";

export function Navigation() {
  const router = useRouter();

  return (
    <nav
      role="navigation"
      aria-label="Main menu"
      className={styles.nav}
      id="main-menu">
      <section className={styles.navSection}>
        {navRoutes.map(navItem =>
          isActiveRoute(navItem, router.route) ? (
            <LinkButton
              key={navItem.route}
              href={navItem.route}
              className={cc([styles.link, styles.active])}
              decorated={false}
              icon={IconChaldea}>
              {navItem.label}
            </LinkButton>
          ) : (
            <LinkButton
              key={navItem.route}
              href={navItem.route}
              className={styles.link}
              decorated={false}>
              {navItem.label}
            </LinkButton>
          )
        )}
        <ActionButton
          onClick={() => {
            setMobileNavOpen(false);
            setSettingsMenuOpen(true);
          }}
          icon={IconSettings}
          decorated={false}
          className={styles.link}>
          Settings
        </ActionButton>
        <LinkButton
          href="https://discord.gg/ZncPkjw"
          icon={IconDiscord}
          decorated={false}
          className={styles.link}
          target="_blank">
          Discord
        </LinkButton>
        <LinkButton
          href="https://github.com/sponsors/Mitsunee"
          icon={IconGithub}
          decorated={false}
          className={styles.link}
          target="_blank">
          Sponsor on Github
        </LinkButton>
      </section>
    </nav>
  );
}
