import styles from "./ModalMenu.module.css";
import ButtonClose from "./ButtonClose";

export default function ModalMenu({ children, handleClose }) {
  return (
    <section className={styles.menu}>
      <ButtonClose onClick={handleClose} />
      {children}
    </section>
  );
}
