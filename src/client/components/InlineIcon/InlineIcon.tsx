import cc from "classcat";
import type { CC } from "src/types/ComponentProps";
import styles from "./InlineIcon.module.css";

type SvgProps = Omit<React.ComponentProps<"svg">, "className">;
type SvgComponent = (props: React.ComponentProps<"svg">) => JSX.Element;
type SvgIconProps = {
  icon: SvgComponent;
  fill?: string;
  hover?: string;
  title?: undefined;
};
type InlineSvgProps = SvgProps & SvgIconProps & CC;
interface InlineSvgStyle extends React.CSSProperties {
  "--icon-fill"?: string;
  "--icon-hover"?: string;
}

type ImgProps = Omit<React.ComponentProps<"img">, "src" | "className" | "alt">;
type ImgIconProps = {
  icon: string;
  fill?: undefined;
  hover?: undefined;
  title: string;
};
type InlineImgProps = ImgProps & ImgIconProps & CC;
type InlineIconProps = InlineImgProps | InlineSvgProps;

export type IconProps = SvgIconProps | ImgIconProps;
export type OptionalIconProps =
  | SvgIconProps
  | ImgIconProps
  | Partial<Record<keyof IconProps, undefined>>;

function isImg(props: InlineIconProps): props is InlineImgProps {
  return typeof props.icon == "string";
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
  if (isImg(props)) return <InlineImg {...props} />;
  return <InlineSvg {...props} />;
}
