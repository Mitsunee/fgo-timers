import { useStore } from "nanostores/react";

import styles from "./SettingsMenu.module.css";
import { uiStore, setSettingsMenuOpen } from "@stores/uiStore";
import {
  settingsStore,
  setAlternativeClockFormat,
  setShowServerTimes
} from "@stores/settingsStore";
import Modal from "@components/Modal";
import ModalMenu from "@components/ModalMenu";
import Headline from "@components/Headline";
import { Select, SelectOption } from "@components/Select";

export default function SettingsMenu() {
  const { settingsMenuOpen } = useStore(uiStore);
  const { alternativeClockFormat, showServerTimes } = useStore(settingsStore);

  const handleClockFormatChange = (value, event) => {
    event.target.blur();
    setAlternativeClockFormat(value);
  };

  const handleShowServerTimesChange = (value, event) => {
    event.target.blur();
    setShowServerTimes(value);
  };

  return (
    <>
      {settingsMenuOpen && (
        <Modal labelledBy="header-settings">
          <ModalMenu handleClose={() => setSettingsMenuOpen(false)}>
            <Headline id="header-settings">Settings</Headline>
            <section className={styles.section}>
              <h2>Clock Format</h2>
              <Select
                onChange={handleClockFormatChange}
                value={alternativeClockFormat}>
                <SelectOption value={false}>24h</SelectOption>
                <SelectOption value={true}>12h</SelectOption>
              </Select>
            </section>
            <section className={styles.section}>
              <h2>Times</h2>
              <Select
                onChange={handleShowServerTimesChange}
                value={showServerTimes}>
                <SelectOption value={false}>Local Time</SelectOption>
                <SelectOption value={true}>Server Time</SelectOption>
              </Select>
            </section>
          </ModalMenu>
        </Modal>
      )}
    </>
  );
}
