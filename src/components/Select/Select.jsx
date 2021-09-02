import { cloneElement } from "react";

import styles from "./Select.module.css";

export default function Select({ children, onChange, value }) {
  return (
    <div className={styles.wrapper}>
      {children instanceof Array
        ? children.map(child =>
            cloneElement(child, {
              key: `${child.props.value}`,
              handler: onChange,
              currentValue: value
            })
          )
        : cloneElement(children, { handler: onChange, currentValue: value })}
    </div>
  );
}
