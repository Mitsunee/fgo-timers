import styles from "./Button.module.css";
import ButtonLink from "./ButtonLink";
import ButtonInner from "./ButtonInner";

export default function Button({
  children,
  text = false, // has precendent over children
  onClick,
  inputType = false, // use <input> instead of <button> with this type
  href, // use <a> instead of <button>
  targetBlank = false, // if using <a> use target="_blank"
  nextLink = false, // if using <a> use <Link>
  disableDefaultStyle = false,
  icon = false, // image file, leave empty for SVG!
  iconSvg, // for SVG
  iconSide = "left", // "left" or "right"
  iconSize = "1em", // used as inline-style!
  className = "",
  style = {},
  disabled,
  ...props
}) {
  const commonProps = {
    className: `${disableDefaultStyle ? "" : styles.button} ${
      className ?? ""
    }`.trim(),
    style: { fontSize: iconSize, ...style },
    onClick,
    "aria-disabled": disabled ? "true" : undefined,
    disabled: disabled ? true : undefined,
    ...props
  };

  const iconProps = { icon, iconSvg, iconSide, iconSize };

  // input doesn't support icons!
  if (inputType)
    return <input type={inputType} {...commonProps} value={text || children} />;

  if (href) {
    return (
      <ButtonLink
        href={href}
        targetBlank={targetBlank}
        nextLink={nextLink}
        {...commonProps}>
        <ButtonInner {...iconProps}>{text || children}</ButtonInner>
      </ButtonLink>
    );
  }

  return (
    <button {...commonProps}>
      <ButtonInner {...iconProps}>{text || children}</ButtonInner>
    </button>
  );
}
