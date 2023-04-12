import cc from "classcat";
import type { ComponentPropsCC } from "src/types/ComponentProps";
import styles from "./TimerList.module.css";

type TimerListProps = ComponentPropsCC<"ul">;

interface TimerListEntitiesProps extends ComponentPropsCC<"li"> {
  title?: string;
}

interface TimerListItemProps extends TimerListEntitiesProps {
  /**
   * Whether to display the item as ended.
   * Note: This is NOT SSR-safe and should be used like
   *
   * ```tsx
   * const isClient = useIsClient();
   *
   * <TimerListItem ended={isClient && condition}>
   *   ChildrenHere
   * </TimerListItem>
   * ```
   */
  ended?: boolean;
}

/**
 * Wrapper Component for content of a card which contains a list of timers. Children should be one or multiple `<li>` or `<TimerListItem>` elements
 */
export function TimerList({ children, className, ...props }: TimerListProps) {
  return (
    <ul {...props} className={cc([styles.list, className])}>
      {children}
    </ul>
  );
}

/**
 * Wrapper Component for item of TimerList. Children should be one or multiple `<li>` elements
 * To target full-width add a `data-wide` property on a child element.
 */
export function TimerListItem({
  children,
  title,
  ended,
  className,
  ...props
}: TimerListItemProps) {
  return (
    <li
      {...props}
      className={cc([styles.item, ended && styles.ended, className])}>
      {title && <h2>{title}</h2>}
      <ul style={{ padding: title ? undefined : "0px" }}>{children}</ul>
    </li>
  );
}

/**
 * Wrapper Component for list of BorderedIcons
 * the target size can be configured with the `--entity-icon-size` property
 */
export function TimerListEntities({
  children,
  title,
  className,
  ...props
}: TimerListEntitiesProps) {
  return (
    <li {...props} className={cc(className)} data-wide>
      {title && <h2>{title}</h2>}
      <div className={styles.entities}>{children}</div>
    </li>
  );
}
