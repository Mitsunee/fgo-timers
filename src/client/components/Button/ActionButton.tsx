import cc from "classcat";
import type { ComponentPropsCC } from "src/types/ComponentProps";

interface ActionButtonProps extends ComponentPropsCC<"button"> {
  //icon: string; // TODO: implement icon
}

// TODO: styles

export function ActionButton({
  children,
  className,
  ...props
}: ActionButtonProps) {
  return (
    <button className={cc([className])} {...props}>
      {children}
    </button>
  );
}
