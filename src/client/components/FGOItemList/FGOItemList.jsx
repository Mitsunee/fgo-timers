import styles from "./FGOItemList.module.css";

export default function FGOItemList({ children }) {
  return <ul className={styles.list}>{children}</ul>;
}
