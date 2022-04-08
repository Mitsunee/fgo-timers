import cc from "classcat";

import styles from "./InfoTable.module.css";

export default function InfoTable({
  children,
  className,
  background,
  ...props
}) {
  return (
    <table
      className={cc([styles.table, background && styles.background, className])}
      {...props}>
      {children}
    </table>
  );
}
