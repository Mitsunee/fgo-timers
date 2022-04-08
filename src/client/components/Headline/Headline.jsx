import cc from "classcat";

import styles from "./Headline.module.css";

export default function Headline({ children, className, id }) {
  return (
    <h1 className={cc([styles.headline, className])} id={id}>
      {children}
    </h1>
  );
}
