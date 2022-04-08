import styles from "./ButtonClose.module.css";
import { Button } from "@components/Button";
import { IconClose } from "@components/icons";

export default function ButtonClose({ onClick }) {
  return (
    <Button
      className={styles.buttonClose}
      onClick={onClick}
      iconComponent={IconClose}
    />
  );
}
