import { ActionButton } from "src/client/components/Button";
import { IconClose } from "src/client/components/icons";
import styles from "./ButtonClose.module.css";

type OnClick = Exclude<
  Pick<React.ComponentProps<"button">, "onClick">["onClick"],
  undefined
>;
interface ButtonCloseProps {
  onClick: OnClick;
}

export default function ButtonClose({ onClick }: ButtonCloseProps) {
  return (
    <ActionButton className={styles.close} onClick={onClick} icon={IconClose} />
  );
}
