import cc from "classcat";
import { useRouter } from "next/router";
import {
  IconChaldea,
  IconDiscord,
  IconGithub,
  IconSettings
} from "~/client/components/icons";
import { setMobileNavOpen, setSettingsMenuOpen } from "~/client/stores/uiStore";
import { ActionButton, LinkButton } from "~/components/Button";
import { isActiveRoute, navRoutes } from "./navRoutes";
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
        {navRoutes.map(navItem => {
          const isActive = isActiveRoute(navItem, router.route);

          return (
            <LinkButton
              key={navItem.route}
              href={navItem.route}
              className={cc([styles.link, isActive && styles.active])}
              decorated={false}
              icon={isActive ? IconChaldea : undefined}>
              {navItem.label}
            </LinkButton>
          );
        })}
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
