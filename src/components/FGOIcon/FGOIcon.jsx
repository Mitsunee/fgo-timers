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
  const classNames = [styles.wrapper];
  if (className) classNames.push(className);
  if (background === "clear") classNames.push(styles.clear);

  return (
    <div className={classNames.join(" ")} title={name} style={{ borderColor }}>
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
