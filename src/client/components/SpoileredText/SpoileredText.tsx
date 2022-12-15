import cc from "classcat";
import type { PropsWithChildren } from "react";
import type { ComponentPropsCC } from "src/types/ComponentProps";
import { useSpoilerState } from "src/client/utils/hooks/useSpoilerState";
import { useSpoilerLevel } from "src/client/utils/hooks/useSpoilerLevel";
import { SpoilerLevels } from "src/types/enum";
import styles from "./SpoileredText.module.css";

interface SpoileredTextProps
  extends PropsWithChildren,
    Omit<ComponentPropsCC<"span">, "title" | "id"> {
  children: Exclude<Stringable, object>;
  id: number;
  placeholder: string;
  na?: true;
}

export function SpoileredText({
  children,
  id,
  placeholder,
  na,
  className,
  ...props
}: SpoileredTextProps) {
  const [level] = useSpoilerLevel();
  const [hidden, toggleHidden] = useSpoilerState(id);

  if (!na) {
    switch (level) {
      case SpoilerLevels.PRERENDER: {
        return (
          <span {...props} className={cc([styles.prerendered, className])}>
            {children}
          </span>
        );
      }
      case SpoilerLevels.STRICT: {
        const displayTitle = `${placeholder} (Click to ${
          hidden ? "reveal" : "hide"
        })`;
        return (
          <span
            {...props}
            className={cc([hidden && styles.hidden, className])}
            title={displayTitle}
            onClick={(...args) => {
              toggleHidden();
              props.onClick?.(...args);
            }}>
            {children}
          </span>
        );
      }
    }
  }

  return (
    <span {...props} className={cc(className)}>
      {children}
    </span>
  );
}
