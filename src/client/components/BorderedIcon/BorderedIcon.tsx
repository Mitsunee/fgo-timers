import cc from "classcat";
import type { CSSProperties } from "react";
import { ComponentPropsCC } from "src/types/ComponentProps";
import { BorderColours, Borders } from "src/types/borders";
import styles from "./BorderedIcon.module.css";

export interface BorderedIconProps extends ComponentPropsCC<"div"> {
  border: Borders;
}

interface BorderedIconStyle extends CSSProperties {
  "--border"?: string;
}

export function BorderedIcon({
  children,
  border,
  className,
  style,
  ...props
}: BorderedIconProps) {
  const styleExtended: BorderedIconStyle = {
    ...style,
    "--border": BorderColours[border]
  };

  return (
    <div
      className={cc([styles.icon, className])}
      style={styleExtended}
      {...props}>
      {children}
    </div>
  );
}
