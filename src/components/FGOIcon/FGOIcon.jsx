import styles from "./FGOIcon.module.css";

const backgrounds = new Map([
  ["bronze", "/assets/backgrounds/material_bg_bronze.png"],
  ["silver", "/assets/backgrounds/material_bg_silver.png"],
  ["gold", "/assets/backgrounds/material_bg_gold.png"],
  ["zero", "/assets/backgrounds/material_bg_blue.png"],
  ["questClearQPReward", "/assets/backgrounds/material_bg_blue.png"]
]);

const borderColors = new Map([
  ["bronze", "#7d583b"],
  ["silver", "#c1c1c1"],
  ["gold", "#f0ce02"],
  ["zero", "#9db5b5"],
  ["questClearQPReward", "#9db5b5"],
  ["black", "#000000"],
  ["red", "#e35e2b"]
]);

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
      className={className ? `${styles.wrapper} ${className}` : styles.wrapper}
      title={name}
      style={{ borderColor }}>
      {background && (
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
