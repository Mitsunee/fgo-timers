import { useStore } from "@nanostores/react";

import styles from "./SettingsMenu.module.css";
import { uiStore, setSettingsMenuOpen } from "@stores/uiStore";
import { settingsStore, setSetting } from "@stores/settingsStore";
import Modal from "@components/Modal";
import ModalMenu from "@components/ModalMenu";
import Headline from "@components/Headline";
import { Select, SelectOption } from "@components/Selector";
import DebugInfo from "./DebugInfo";

const handleClockFormatChange = ({ value, event }) => {
  event.target.blur();
  setSetting("alternativeClockFormat", value);
};

const handleShowServerTimesChange = ({ value, event }) => {
  event.target.blur();
  setSetting("showServerTimes", value);
};

const handlePerPageChange = ({ value, event }) => {
  event.target.blur();
  setSetting("perPage", value);
};

const handleSpoilerChange = ({ value, event }) => {
  event.target.blur();
  setSetting("showSpoiler", value);
};

export default function SettingsMenu() {
  const { settingsMenuOpen } = useStore(uiStore);
  const { alternativeClockFormat, showServerTimes, perPage, showSpoiler } =
    useStore(settingsStore);

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
            <section className={styles.section}>
              <h2>Items per Page</h2>
              <Select onChange={handlePerPageChange} value={perPage}>
                <SelectOption value={10}>10</SelectOption>
                <SelectOption value={25}>25</SelectOption>
                <SelectOption value={50}>50</SelectOption>
                <SelectOption value={100}>100</SelectOption>
              </Select>
            </section>
            <section className={styles.section}>
              <h2>Show Spoilers</h2>
              <Select onChange={handleSpoilerChange} value={showSpoiler}>
                <SelectOption value="strict">None</SelectOption>
                <SelectOption value="some">Names only</SelectOption>
                <SelectOption value="all">All</SelectOption>
              </Select>
            </section>
            <DebugInfo />
          </ModalMenu>
        </Modal>
      )}
    </>
  );
}
