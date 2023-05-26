import ButtonClose from "./ButtonClose";
import styles from "./ModalMenu.module.css";

interface ModalMenuProps extends React.PropsWithChildren {
  handleClose: Parameters<typeof ButtonClose>[0]["onClick"];
}

export function ModalMenu({ children, handleClose }: ModalMenuProps) {
  return (
    <section className={styles.menu}>
      <ButtonClose onClick={handleClose} />
      {children}
    </section>
  );
}
