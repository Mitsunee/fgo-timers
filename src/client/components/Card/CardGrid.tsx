import cc from "classcat";
import type { CC } from "src/types/ComponentProps";
import styles from "./CardGrid.module.css";

export function CardGrid({
  children,
  className
}: React.PropsWithChildren & CC) {
  return <section className={cc([styles.grid, className])}>{children}</section>;
}
