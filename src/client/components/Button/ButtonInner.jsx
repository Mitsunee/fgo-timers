import styles from "./ButtonInner.module.css";
import ButtonIcon from "./ButtonIcon";

export default function ButtonInner({
  children,
  icon,
  iconComponent,
  iconSide,
  iconSize
}) {
  const iconProps = { icon, Component: iconComponent, iconSize };
  const hasIcon = icon || iconComponent ? true : false;

  return hasIcon ? (
    <div className={styles.inner}>
      {hasIcon && iconSide === "left" && <ButtonIcon {...iconProps} />}
      {typeof children === "string" ? <span>{children}</span> : children}
      {hasIcon && iconSide === "right" && <ButtonIcon {...iconProps} />}
    </div>
  ) : (
    <>{children}</>
  );
}
