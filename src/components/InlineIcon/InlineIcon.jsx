import styles from "./InlineIcon.module.css";

export default function InlineIcon({ icon }) {
  return (
    <span
      className={styles.icon}
      style={{ backgroundImage: `url("${icon}")` }}
    />
  );
}
