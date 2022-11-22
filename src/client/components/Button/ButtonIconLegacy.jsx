import styles from "./ButtonIcon.module.css";

export default function ButtonIcon({ icon, Component, iconSize }) {
  const iconSizeStyle = iconSize
    ? { width: iconSize, height: iconSize }
    : undefined;

  if (Component) {
    return <Component style={iconSizeStyle} className={styles.icon} />;
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
