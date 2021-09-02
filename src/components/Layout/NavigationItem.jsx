import Link from "next/link";

import styles from "./NavigationItem.module.css";
import { svgChaldea } from "@utils/svgIcons";
import Svg from "@components/Svg";

export default function NavigationItem({
  children,
  link,
  active,
  className = false
}) {
  // TODO: refactor to use new <Button> component

  return active ? (
    <span
      className={
        className
          ? `${styles.link} ${styles.active} ${className}`
          : `${styles.link} ${styles.active}`
      }>
      <Svg viewBox={svgChaldea.viewBox} className={styles.svg}>
        <path d={svgChaldea.path} />
      </Svg>
      {children}
    </span>
  ) : (
    <Link href={link} passHref>
      <a className={className ? `${styles.link} ${className}` : styles.link}>
        {children}
      </a>
    </Link>
  );
}
