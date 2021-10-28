import cc from "classcat";

import styles from "./InfoTable.module.css";

export default function InfoTable({ children, className, ...props }) {
  return (
    <table className={cc([styles.table, className])} {...props}>
      {children}
    </table>
  );
}
