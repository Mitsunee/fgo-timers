import styles from "./SelectOption.module.css";
import { Button } from "@components/Button";

export default function SelectOption({
  children,
  value,
  handler,
  currentValue
}) {
  return (
    <Button
      className={
        value === currentValue
          ? `${styles.option} ${styles.selected}`
          : `${styles.option} ${styles.unselected}`
      }
      onClick={event => handler(value, event)}>
      {children}
    </Button>
  );
}
