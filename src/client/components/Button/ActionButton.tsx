import cc from "classcat";
import type { ComponentPropsCC } from "src/types/ComponentProps";
import type {
  IconProps,
  OptionalIconProps
} from "src/client/components/InlineIcon";
import { InlineIcon } from "src/client/components/InlineIcon";
import { GlobalStyles } from "src/types/enum";

interface ActionButtonProps
  extends ComponentPropsCC<"button">,
    OptionalIconProps {
  decorated?: boolean;
  fill?: undefined; // style color instead
  hover?: undefined; // style :hover color instead
}

export function ActionButton({
  children,
  className,
  decorated = true,
  icon,
  fill,
  hover,
  title,
  ...props
}: ActionButtonProps) {
  const classNameExtended = cc([
    GlobalStyles.BUTTON,
    decorated && GlobalStyles.BUTTON_DECORATED,
    className
  ]);
  const iconProps = icon
    ? ({ icon, fill, hover, title } satisfies IconProps)
    : false;

  return (
    <button
      className={classNameExtended}
      {...props}
      title={title && !iconProps ? title : undefined}>
      {iconProps && <InlineIcon {...iconProps} />}
      {iconProps && typeof children == "string" ? (
        <span>{children}</span>
      ) : (
        children
      )}
    </button>
  );
}
