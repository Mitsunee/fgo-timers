import cc from "classcat";

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
      className={cc([
        styles.option,
        value === currentValue ? styles.selected : styles.unselected
      ])}
      onClick={event => handler({ value, event })}>
      {children}
    </Button>
  );
}
