import cc from "classcat";
import type { CSSProperties } from "react";
import { ComponentPropsCC } from "src/types/ComponentProps";
import { Borders, BorderColours, BgColours } from "src/types/borders";
import styles from "./BorderedIcon.module.css";

export interface BorderedIconProps extends ComponentPropsCC<"div"> {
  border: Borders;
  forceBig?: boolean;
}

interface BorderedIconStyle extends CSSProperties {
  "--border": string;
  "--bg": string;
}

export function BorderedIcon({
  children,
  border,
  forceBig,
  className,
  style,
  ...props
}: BorderedIconProps) {
  const styleExtended: BorderedIconStyle = {
    ...style,
    "--border": BorderColours[border],
    "--bg": BgColours[border]
  };

  return (
    <div
      className={cc([styles.icon, forceBig && styles.big, className])}
      style={styleExtended}
      {...props}>
      {children}
    </div>
  );
}
