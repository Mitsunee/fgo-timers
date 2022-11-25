import cc from "classcat";

import styles from "./InlineIconLegacy.module.css";

export default function InlineIcon({ icon, className }) {
  return (
    <span
      className={cc([styles.icon, className])}
      style={{ backgroundImage: `url("${icon}")` }}
    />
  );
}
