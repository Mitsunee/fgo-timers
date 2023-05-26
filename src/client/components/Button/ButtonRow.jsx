import cc from "classcat";
import styles from "./ButtonRow.module.css";

export default function ButtonRow({ children, align = "left" }) {
  return <div className={cc([styles.row, styles[align]])}>{children}</div>;
}
