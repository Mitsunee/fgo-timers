import styles from "./NavigationItem.module.css";
import { Button } from "@components/Button";
import { IconChaldea } from "@components/icons";

export default function NavigationItem({
  children,
  link,
  active,
  className = false
}) {
  return active ? (
    <Button
      disableDefaultStyle
      className={
        className
          ? `${styles.link} ${styles.active} ${className}`
          : `${styles.link} ${styles.active}`
      }
      iconComponent={IconChaldea}
      iconSize="1.25em"
      iconSide="left">
      {children}
    </Button>
  ) : (
    <Button
      href={link}
      nextLink
      disableDefaultStyle
      className={className ? `${styles.link} ${className}` : styles.link}>
      {children}
    </Button>
  );
}
