import { ActionButton } from "~/client/components/Button";
import { IconClose } from "~/client/components/icons";
import { Modal } from "~/client/components/Modal";
import styles from "./EventNewsModal.module.css";

interface EventNewsModalProps {
  url: string;
  closeCallback: () => void;
}

export function EventNewsModal({ url, closeCallback }: EventNewsModalProps) {
  return (
    <Modal>
      <div className={styles.wrapper}>
        <iframe src={`https://webview.fate-go.us/iframe/${url}`} />
        <ActionButton
          className={styles.close}
          icon={IconClose}
          onClick={closeCallback}
        />
      </div>
    </Modal>
  );
}
