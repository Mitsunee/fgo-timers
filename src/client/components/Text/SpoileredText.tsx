import cc from "classcat";
import { useSpoilerLevel } from "~/hooks/useSpoilerLevel";
import { useSpoilerState } from "~/hooks/useSpoilerState";
import { SpoilerLevels } from "~/types/enum";
import type {
  ComponentPropsCC,
  RequiredChildren
} from "~/types/ComponentProps";
import styles from "./SpoileredText.module.css";

interface SpoileredTextProps
  extends React.PropsWithChildren,
    Omit<ComponentPropsCC<"span">, "title" | "id"> {
  children: RequiredChildren;
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
  const level = useSpoilerLevel();
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
          // FIXME: This can't be a span
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
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
