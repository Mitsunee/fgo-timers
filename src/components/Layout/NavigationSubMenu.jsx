import { useStore } from "nanostores/react";
import { useRouter } from "next/router";

import styles from "./NavigationSubMenu.module.css";
import { uiStore, setSubMenuOpen } from "@stores/uiStore";
import { Button } from "@components/Button";
import { IconArrow } from "@components/icons";
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
      <Button
        onClick={event => {
          event.target.blur();
          setSubMenuOpen(menuKey, state => !state);
        }}
        disableDefaultStyle
        className={
          forceOpen ? `${styles.button} ${styles.static}` : styles.button
        }
        iconComponent={IconArrow}
        iconSize="0.75em"
        iconSide="left">
        {text}
      </Button>
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
