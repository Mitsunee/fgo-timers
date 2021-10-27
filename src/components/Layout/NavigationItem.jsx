import cc from "classcat";

import styles from "./NavigationItem.module.css";
import { Button } from "@components/Button";
import { IconChaldea } from "@components/icons";

export default function NavigationItem({ children, link, active, className }) {
  return active ? (
    <Button
      disableDefaultStyle
      className={cc([styles.link, styles.active, className])}
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
      className={cc([styles.link, className])}>
      {children}
    </Button>
  );
}
