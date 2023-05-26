import cc from "classcat";
import styles from "./InfoTableRow.module.css";

export default function InfoTableRow({
  children,
  active = false,
  className,
  ...props
}) {
  return (
    <tr className={cc([active && styles.active, className])} {...props}>
      {children}
    </tr>
  );
}
