import styles from "./FGOItemListItem.module.css";
import FGOIcon from "@components/FGOIcon";

export default function FGOItemListItem({ children, data }) {
  return (
    <li className={styles.item}>
      <FGOIcon {...data} />
      <span>{children || data.name}</span>
    </li>
  );
}
