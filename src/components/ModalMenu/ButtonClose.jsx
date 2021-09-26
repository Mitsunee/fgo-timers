import styles from "./ButtonClose.module.css";
import { Button } from "@components/Button";
import { svgClose } from "@utils/svgIcons";

export default function ButtonClose({ onClick }) {
  return (
    <Button
      className={styles.buttonClose}
      onClick={onClick}
      iconSvg={svgClose}
    />
  );
}
