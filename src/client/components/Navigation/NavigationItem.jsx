import { createElement } from "react";
import cc from "classcat";

import styles from "./NavigationItem.module.css";
import { Button } from "@components/Button";
import { IconChaldea } from "@components/icons";

export default function NavigationItem({
  children,
  link,
  onClick,
  icon,
  active,
  className
}) {
  const props = {
    className: cc([styles.link, active && styles.active, className]),
    disableDefaultStyle: true,
    onClick
  };

  if (active || icon) {
    props.iconComponent = icon || IconChaldea;
    props.iconSize = "1.25em";
    props.iconSide = "left";
  }

  if (link) {
    props.href = link;
    if (link.startsWith("/")) {
      props.nextLink = true;
    } else {
      props.targetBlank = true;
    }
  }

  return createElement(Button, props, children);
}
