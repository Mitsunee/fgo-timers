import styles from "./Clock.module.css";

export default function Clock({ children, title }) {
  return (
    <div className={styles.clock}>
      <h1>{title}</h1>
      <h2>{children}</h2>
    </div>
  );
}
