import styles from "./Select.module.css";
import { withAddedProps } from "@utils/withAddedProps";

export default function Select({ children, onChange, value }) {
  return (
    <div className={styles.wrapper}>
      {withAddedProps(children, {
        props: { handler: onChange, currentValue: value },
        keyFn: child => `${child.props.value}`
      })}
    </div>
  );
}
