import styles from "./LoginTicketItem.module.css";

import FGOIcon from "@components/FGOIcon";

export default function LoginTicketItem({ data }) {
  return (
    <div className={styles.wrapper}>
      <FGOIcon {...data} className={styles.icon} />
      <span>{data.name}</span>
    </div>
  );
}
