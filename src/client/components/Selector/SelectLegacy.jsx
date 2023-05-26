import cc from "classcat";
import { withAddedProps } from "~/client/utils/withAddedProps";
import { Button } from "~/components/Button";
import styles from "./SelectLegacy.module.css";

export function Select({ children, onChange, value }) {
  return (
    <div className={styles.wrapper}>
      {withAddedProps(children, {
        props: { handler: onChange, currentValue: value },
        keyFn: child => `${child.props.value}`
      })}
    </div>
  );
}

export function SelectOption({ children, value, handler, currentValue }) {
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
