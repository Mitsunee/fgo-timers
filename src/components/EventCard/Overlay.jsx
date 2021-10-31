import styles from "./Overlay.module.css";

export default function Overlay({ shortTitle }) {
  return (
    <div className={styles.overlay}>
      <h1>{shortTitle}</h1>
    </div>
  );
}
