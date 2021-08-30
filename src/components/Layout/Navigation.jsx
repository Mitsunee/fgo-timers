import { useRouter } from "next/router";

import styles from "./Navigation.module.css";
import { navRoutes } from "@utils/navRoutes";
import NavigationItem from "./NavigationItem";
import NavigationSubMenu from "./NavigationSubMenu";

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

          return navItem.link instanceof Array ? (
            <NavigationSubMenu
              key={navItem.key || navItem.text}
              menuKey={navItem.key}
              text={navItem.text}
              forceOpen={isActiveItem}
              items={navItem.link}
            />
          ) : (
            <NavigationItem
              key={navItem.key || navItem.text}
              link={navItem.link}
              active={isActiveItem}>
              {navItem.text}
            </NavigationItem>
          );
        })}
      </section>
    </nav>
  );
}
