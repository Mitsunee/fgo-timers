import cc from "classcat";
import Link from "next/link";
import type { ComponentWithRefCC } from "src/types/ComponentProps";
import {
  InlineIcon,
  IconProps,
  OptionalIconProps
} from "src/client/components/InlineIcon";
import { GlobalStyles } from "src/types/enum";

interface LinkButtonProps extends ComponentWithRefCC<"a"> {
  decorated?: boolean;
  href: string;
  onClick?: undefined; // use ActionButton instead!
  fill?: undefined; // style color instead
  hover?: undefined; // style :hover color instead
}
type LinkButtonIconProps =
  | (Partial<Record<Exclude<keyof OptionalIconProps, "title">, undefined>> & {
      title: string;
    })
  | OptionalIconProps;

export function LinkButton({
  children,
  className,
  decorated = true,
  rel,
  icon,
  fill,
  hover,
  title,
  ...props
}: LinkButtonProps & LinkButtonIconProps) {
  const classNameExtended = cc([
    GlobalStyles.BUTTON,
    decorated && GlobalStyles.BUTTON_DECORATED,
    className
  ]);
  const iconProps = icon ? ({ icon, fill, hover, title } as IconProps) : false;
  const Inner = (
    <>
      {iconProps && <InlineIcon {...iconProps} />}
      {iconProps && typeof children == "string" ? (
        <span>{children}</span>
      ) : (
        children
      )}
    </>
  );
  let relProp = rel;

  if (props.target == "_blank") {
    relProp ??= "";
    if (relProp.indexOf("noopener") < 0) relProp += " noopener";
    if (relProp.indexOf("noreferrer") < 0) relProp += " noreferrer";
    relProp = relProp.trim();
  }

  return props.href.startsWith("/") ? (
    <Link
      {...props}
      title={title && !iconProps ? title : undefined}
      rel={relProp}
      className={classNameExtended}>
      {Inner}
    </Link>
  ) : (
    <a
      {...props}
      title={title && !iconProps ? title : undefined}
      rel={relProp}
      className={classNameExtended}>
      {Inner}
    </a>
  );
}