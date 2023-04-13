/* eslint-disable @typescript-eslint/no-unused-vars */
import cc from "classcat";
import type { CC, ComponentPropsCC } from "src/types/ComponentProps";
import styles from "./InlineIcon.module.css";

type SvgComponent = (props: React.ComponentProps<"svg">) => JSX.Element;

interface StyleProps {
  fill?: string;
  hover?: string;
  title?: string;
}

type SvgProps = ComponentPropsCC<"svg">;
type ImgProps = Omit<ComponentPropsCC<"img">, "src" | "alt">;

interface InlineImgProps extends ImgProps, StyleProps {
  icon: string;
  title: string;
}

interface InlineSvgProps extends SvgProps, StyleProps {
  icon: SvgComponent;
}

interface InlineSvgStyle extends React.CSSProperties {
  "--icon-fill"?: string;
  "--icon-hover"?: string;
}

export interface IconProps extends StyleProps {
  icon: SvgComponent | string;
}
export interface OptionalIconProps extends StyleProps {
  icon?: SvgComponent | string;
}

interface InlineIconProps extends Common<SvgProps, ImgProps>, StyleProps {
  icon: SvgComponent | string;
}

export function InlineImg({
  className,
  icon,
  title,
  ...props
}: InlineImgProps) {
  return (
    <img
      {...props}
      src={icon}
      alt={title}
      className={cc([styles.icon, className])}
    />
  );
}

export function InlineSvg({
  children,
  className,
  icon: Component,
  style,
  fill,
  hover,
  ...props
}: InlineSvgProps) {
  const styleExtended: InlineSvgStyle = { ...style };
  if (fill) styleExtended["--icon-fill"] = fill;
  if (hover) styleExtended["--icon-hover"] = hover;

  return (
    <Component
      {...props}
      style={styleExtended}
      className={cc([styles.icon, className])}>
      {children}
    </Component>
  );
}

export function InlineIcon(props: InlineIconProps) {
  if (typeof props.icon == "string") {
    const { title = "", icon, ...otherProps } = props;
    return <InlineImg icon={icon} title={title} {...otherProps} />;
  }

  const { icon, ...otherProps } = props;
  return <InlineSvg icon={icon} {...otherProps} />;
}
