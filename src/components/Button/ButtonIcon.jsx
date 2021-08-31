import styles from "./ButtonIcon.module.css";
import Svg from "@components/Svg";

export default function ButtonIcon({ icon, iconSvg, iconSize }) {
  if (!icon) return null;

  const iconSizeStyle = iconSize
    ? { width: iconSize, height: iconSize }
    : undefined;

  if (iconSvg) {
    return (
      <Svg
        viewBox={iconSvg.viewBox}
        style={iconSizeStyle}
        className={styles.icon}>
        <path d={iconSvg.path} />
      </Svg>
    );
  }

  if (icon) {
    return (
      <div
        className={styles.icon}
        style={{
          ...iconSizeStyle,
          backgroundImage: `url("${icon}")`,
          backgroundSize: "contain"
        }}
      />
    );
  }

  return null;
}
