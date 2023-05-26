import cc from "classcat";
import Link from "next/link";
import { InlineIcon } from "~/client/components/InlineIcon";
import { GlobalStyles } from "~/types/enum";
import type {
  IconProps,
  OptionalIconProps
} from "~/client/components/InlineIcon";
import type { ComponentWithRefCC } from "~/types/ComponentProps";

interface LinkButtonProps extends ComponentWithRefCC<"a">, OptionalIconProps {
  decorated?: boolean;
  href: string;
  fill?: undefined; // style color instead
  hover?: undefined; // style :hover color instead
  replace?: boolean;
}

export function LinkButton({
  children,
  className,
  decorated = true,
  rel,
  icon,
  fill,
  hover,
  title,
  replace,
  ...props
}: LinkButtonProps) {
  const classNameExtended = cc([
    GlobalStyles.BUTTON,
    decorated && GlobalStyles.BUTTON_DECORATED,
    className
  ]);
  const iconProps = icon
    ? ({ icon, fill, hover, title } satisfies IconProps)
    : false;
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
      className={classNameExtended}
      replace={replace}>
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
