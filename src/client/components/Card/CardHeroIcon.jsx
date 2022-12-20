import cc from "classcat";

import styles from "./CardHeroIcon.module.css";

export default function CardHeroIcon({ icon, alt, forceRoundIcon }) {
  return (
    <div className={styles.wrapper}>
      <img
        src={icon}
        width="76"
        height="76"
        alt={alt}
        className={cc(forceRoundIcon && styles.forceRound)}
      />
    </div>
  );
}
