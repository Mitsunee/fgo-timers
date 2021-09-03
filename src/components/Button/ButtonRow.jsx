import styles from "./ButtonRow.module.css";

export default function ButtonRow({ children, alignLeft = false }) {
  return (
    <div
      className={`${styles.buttonrow} ${
        alignLeft ? styles.left : styles.right
      }`}>
      {children}
    </div>
  );
}
