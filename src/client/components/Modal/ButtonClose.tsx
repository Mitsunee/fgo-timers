import { ActionButton } from "~/components/Button";
import { IconClose } from "~/components/icons";
import styles from "./ButtonClose.module.css";

type OnClick = NonNullable<React.ComponentProps<"button">["onClick"]>;
interface ButtonCloseProps {
  onClick: OnClick;
}

export default function ButtonClose({ onClick }: ButtonCloseProps) {
  return (
    <ActionButton className={styles.close} onClick={onClick} icon={IconClose} />
  );
}
