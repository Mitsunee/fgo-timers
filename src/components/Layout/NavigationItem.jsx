import styles from "./NavigationItem.module.css";
import { svgChaldea } from "@utils/svgIcons";
import { Button } from "@components/Button";

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
      iconSvg={svgChaldea}
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
