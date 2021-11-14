import { useRouter } from "next/router";

import styles from "./Navigation.module.css";
import { navRoutes } from "@utils/navRoutes";
import { setSettingsMenuOpen } from "@stores/uiStore";
import NavigationItem from "./NavigationItem";
import { IconSettings, IconDiscord, IconGithub } from "@components/icons";

export default function Navigation() {
  const router = useRouter();
  const testActive = item =>
    item.test
      ? item.test.test(router.asPath)
      : router.asPath.startsWith(item.link);

  return (
    <nav className={styles.wrapper}>
      <section className={styles.nav}>
        {navRoutes.map(navItem => {
          const isActiveItem = testActive(navItem);

          return (
            <NavigationItem
              key={navItem.key || navItem.text}
              link={navItem.link}
              active={isActiveItem}>
              {navItem.text}
            </NavigationItem>
          );
        })}
        <NavigationItem
          onClick={() => setSettingsMenuOpen(true)}
          icon={IconSettings}>
          Settings
        </NavigationItem>
        <NavigationItem link="https://discord.gg/ZncPkjw" icon={IconDiscord}>
          Discord
        </NavigationItem>
        <NavigationItem
          link="https://github.com/sponsors/Mitsunee"
          icon={IconGithub}>
          Sponsor on Github
        </NavigationItem>
      </section>
    </nav>
  );
}
