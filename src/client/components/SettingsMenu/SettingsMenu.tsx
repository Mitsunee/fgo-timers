import { useStore } from "@nanostores/react";

import { SpoilerLevels } from "src/types/enum";
import { uiStore, setSettingsMenuOpen } from "src/client/stores/uiStore";
import {
  settingsStore,
  toggleClockFormat,
  toggleServerTimes,
  setPageSize,
  setSpoilerLevel,
  toggleInfiniteScrollMode
} from "src/client/stores/settingsStore";
import { Modal, ModalMenu } from "src/client/components/Modal";
import Headline from "src/client/components/Headline";
import { Selector, SelectorOption } from "src/client/components/Selector";
import { DebugInfo } from "./DebugInfo";
import styles from "./SettingsMenu.module.css";

const clockFormatOptions: SelectorOption<boolean>[] = [
  { value: false, label: "24h" },
  { value: true, label: "12h" }
];

const serverTimeOptions: SelectorOption<boolean>[] = [
  { value: false, label: "Local Time" },
  { value: true, label: "Server Time" }
];

type PageSize = Parameters<typeof setPageSize>[0];
const pageSizeOptions: SelectorOption<PageSize>[] = [
  { value: 10, label: "10" },
  { value: 25, label: "25" },
  { value: 50, label: "50" },
  { value: 100, label: "100" }
];

type Levels = Parameters<typeof setSpoilerLevel>[0];
const spoilerLevelOptions: SelectorOption<Levels>[] = [
  { value: SpoilerLevels.STRICT, label: "None" },
  { value: SpoilerLevels.SOME, label: "Names only" },
  { value: SpoilerLevels.ALL, label: "All" }
];

const autoScrollOptions: SelectorOption<boolean>[] = [
  { value: false, label: "Off" },
  { value: true, label: "On" }
];

export function SettingsMenu() {
  const { settingsMenuOpen } = useStore(uiStore);
  const {
    alternativeClockFormat,
    showServerTimes,
    perPage,
    showSpoiler,
    autoInfiniteScroll
  } = useStore(settingsStore);

  return (
    <>
      {settingsMenuOpen && (
        <Modal labelledBy="header-settings">
          <ModalMenu handleClose={() => setSettingsMenuOpen(false)}>
            <Headline id="header-settings">Settings</Headline>
            <section className={styles.section}>
              <h2>Clock Format</h2>
              <Selector
                options={clockFormatOptions}
                value={alternativeClockFormat}
                onChange={value => toggleClockFormat(value)}
              />
            </section>
            <section className={styles.section}>
              <h2>Times</h2>
              <Selector
                options={serverTimeOptions}
                value={showServerTimes}
                onChange={value => toggleServerTimes(value)}
              />
            </section>
            <section className={styles.section}>
              <h2>Items per Page</h2>
              <Selector
                options={pageSizeOptions}
                value={perPage}
                onChange={value => setPageSize(value)}
              />
            </section>
            <section className={styles.section}>
              <h2>Automatic Infinite Scrolling</h2>
              <Selector
                options={autoScrollOptions}
                value={autoInfiniteScroll}
                onChange={value => toggleInfiniteScrollMode(value)}
              />
            </section>
            <section className={styles.section}>
              <h2>Show Spoilers</h2>
              <Selector
                options={spoilerLevelOptions}
                value={showSpoiler}
                onChange={value => setSpoilerLevel(value)}
              />
            </section>
            <DebugInfo />
          </ModalMenu>
        </Modal>
      )}
    </>
  );
}