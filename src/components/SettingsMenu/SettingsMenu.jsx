import { useStore } from "nanostores/react";

import styles from "./SettingsMenu.module.css";
import { uiStore, setSettingsMenuOpen } from "@stores/uiStore";
import {
  settingsStore,
  setAlternativeClockFormat,
  setShowServerTimes
} from "@stores/settingsStore";
import Modal from "@components/Modal";
import Headline from "@components/Headline";
//import ButtonRow from "@components/ButtonRow";
import Button from "@components/Button";
import { Select, SelectOption } from "@components/Select";

export default function SettingsMenu() {
  const { settingsMenuOpen } = useStore(uiStore);
  const { alternativeClockFormat, showServerTimes } = useStore(settingsStore);

  const handleClockFormatChange = (value, event) => {
    event?.target.blur();
    setAlternativeClockFormat(value);
  };

  const handleShowServerTimesChange = (value, event) => {
    event?.target.blur();
    setShowServerTimes(value);
  };

  return settingsMenuOpen ? (
    <Modal labelledBy="header-settings">
      <section className={styles.menu}>
        <Button
          className={styles.buttonClose}
          onClick={() => setSettingsMenuOpen(false)}
          iconPath="M 23.288372,19.485444 15.685,11.979 23.18142,4.4076159 a 1.0049875,1.0049875 89.857474 0 0 -0.0035,-1.4177227 L 20.895107,0.70710678 a 0.99360798,0.99360798 179.8163 0 0 -1.409665,0.00452 L 11.976,8.318 4.3776737,0.81751016 a 1.0065007,1.0065007 179.81437 0 0 -1.4187805,0.004597 L 0.70710678,3.0738932 a 0.99512095,0.99512095 89.859884 0 0 0.00345,1.4107467 L 8.321,12.021 0.81751184,19.622328 a 1.0064984,1.0064984 89.814439 0 0 0.004595,1.418779 l 2.25178642,2.251786 a 0.99511919,0.99511919 179.85983 0 0 1.4107454,-0.0035 l 7.5305204,-7.604573 a 0.00403837,0.00403837 179.71736 0 1 0.0057,-2.8e-5 l 7.571516,7.496578 a 1.0049857,1.0049857 179.85753 0 0 1.417722,-0.0035 l 2.282786,-2.282786 a 0.99360566,0.99360566 89.816229 0 0 -0.0045,-1.409663 z"
        />
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
      </section>
    </Modal>
  ) : null;
}
