import { useStore } from "nanostores/react";
import { useRouter } from "next/router";

import styles from "./NavigationSubMenu.module.css";
import { navigationStore, setSubMenuOpen } from "@stores/navigationStore";
import Svg from "@components/Svg";
import NavigationItem from "./NavigationItem";

export default function NavigationSubMenu({
  menuKey,
  text,
  forceOpen = false,
  items
}) {
  const {
    subMenusOpen: { [menuKey]: isOpen }
  } = useStore(navigationStore);
  const router = useRouter();
  const testActive = item =>
    item.test
      ? item.test.test(router.asPath)
      : router.asPath.startsWith(item.link);
  const open = isOpen || forceOpen;

  return (
    <section className={open ? `${styles.menu} ${styles.open}` : styles.menu}>
      <button
        className={
          forceOpen ? `${styles.button} ${styles.static}` : styles.button
        }
        onClick={event => {
          event.target.blur();
          setSubMenuOpen(menuKey, state => !state);
        }}>
        <Svg className={open ? `${styles.svg} ${styles.open}` : styles.svg}>
          <path
            // ./assets/arrow.svg
            d="M 12,22 0,2 12,7 24,2 Z"
          />
        </Svg>
        {text}
      </button>
      {open &&
        items.map(item => {
          const isActiveItem = testActive(item);
          return (
            <NavigationItem
              key={item.key || item.text}
              link={item.link}
              active={isActiveItem}
              className={styles.item}>
              {item.text}
            </NavigationItem>
          );
        })}
    </section>
  );
}
