import styles from "./ButtonInner.module.css";
import ButtonIcon from "./ButtonIcon";

export default function ButtonInner({
  children,
  icon,
  iconSvg,
  iconSide,
  iconSize
}) {
  const iconProps = { icon, iconSvg, iconSize };
  return icon ? (
    <div className={styles.inner}>
      {icon && iconSide === "left" && <ButtonIcon {...iconProps} />}
      {typeof children === "string" ? <span>{children}</span> : children}
      {icon && iconSide === "right" && <ButtonIcon {...iconProps} />}
    </div>
  ) : (
    <>{children}</>
  );
}
