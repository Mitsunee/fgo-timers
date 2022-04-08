import cc from "classcat";

import styles from "./FGOIcon.module.css";
import { backgrounds, borderColors } from "@styles/fgoIconTheme";

export default function FGOIcon({
  children = null,
  name = undefined,
  icon,
  background = false,
  className
}) {
  if (!icon) return null;

  const backgroundPath = background ? backgrounds.get(background) : undefined;
  const borderColor =
    (background ? borderColors.get(background) : undefined) ||
    borderColors.get("black");

  return (
    <div
      className={cc([
        styles.wrapper,
        className,
        background === "clear" && styles.clear
      ])}
      title={name}
      style={{ borderColor }}>
      {backgroundPath && (
        <div
          className={styles.background}
          style={{ backgroundImage: `url("${backgroundPath}")` }}
        />
      )}
      <div
        className={styles.icon}
        style={{ backgroundImage: `url("${icon}")` }}
      />
      {children}
    </div>
  );
}
