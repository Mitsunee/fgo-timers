import cc from "classcat";
import { ComponentProps, CSSProperties } from "react";
import type { CC } from "src/types/ComponentProps";

type SvgProps = Omit<ComponentProps<"svg">, "className"> & CC;
type SvgComponent = (props: SvgProps) => JSX.Element;
type WithSvg = SvgProps & { icon: SvgComponent; hover?: string };
type ImgProps = Omit<ComponentProps<"img">, "src" | "className" | "alt"> & CC;
type WithImg = ImgProps & { icon: string; hover?: undefined; title: string };
export type WithIcon = WithImg | WithSvg;

// TODO: styles

export function ButtonIcon(props: WithIcon) {
  if (typeof props.icon == "string") {
    const { icon, title, className, ...imgProps } = props as WithImg;
    return (
      <img {...imgProps} src={icon} alt={title} className={cc(className)} />
    );
  }

  const {
    children,
    icon: Component,
    style,
    hover = "var(--hover)",
    ...svgProps
  } = props as WithSvg;
  const styleExtended = { ...style, "--hover": hover } as CSSProperties;
  return (
    <Component {...svgProps} style={styleExtended}>
      {children}
    </Component>
  );
}
