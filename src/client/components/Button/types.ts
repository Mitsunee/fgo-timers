import type { ComponentProps } from "react";

type ImgIcon = { icon: string; title: string };
type SvgIcon = {
  icon: (props: ComponentProps<"svg">) => JSX.Element;
  title?: undefined;
};

export type ButtonIconProps = ImgIcon | SvgIcon;
export type OptionalButtonIconProps =
  | ImgIcon
  | SvgIcon
  | { icon?: undefined; title?: undefined };
