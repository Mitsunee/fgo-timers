import { useStore } from "nanostores/react";
import { useRouter } from "next/router";

import styles from "./NavigationSubMenu.module.css";
import { uiStore, setSubMenuOpen } from "@stores/uiStore";
import { svgArrow } from "@utils/svgIcons";
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
  } = useStore(uiStore);
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
        <Svg
          viewBox={svgArrow.viewBox}
          className={open ? `${styles.svg} ${styles.open}` : styles.svg}>
          <path d={svgArrow.path} />
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
