import styles from "./CardGrid.module.css";

export function CardGrid({ children }: React.PropsWithChildren) {
  return <section className={styles.grid}>{children}</section>;
}
