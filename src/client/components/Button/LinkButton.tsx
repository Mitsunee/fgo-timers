import cc from "classcat";
import Link from "next/link";
import type { ComponentWithRefCC } from "src/types/ComponentProps";

interface LinkButtonProps extends ComponentWithRefCC<"a"> {
  // TODO: implement icon
  href: string;
  onClick: undefined; // use ActionButton instead!
}

// TODO: styles

export function LinkButton({ children, className, ...props }: LinkButtonProps) {
  if (props.href.startsWith("/")) {
    return (
      <Link {...props} className={cc([className])}>
        {children}
      </Link>
    );
  }

  return (
    <a {...props} className={cc([className])}>
      {children}
    </a>
  );
}
