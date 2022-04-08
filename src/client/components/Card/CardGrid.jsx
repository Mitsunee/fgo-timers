import styles from "./CardGrid.module.css";

export default function CardGrid({ children }) {
  return <section className={styles.grid}>{children}</section>;
}
