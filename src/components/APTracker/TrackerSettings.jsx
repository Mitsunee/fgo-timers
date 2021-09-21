import { useState } from "react";
import { useStore } from "nanostores/react";

import styles from "./TrackerSettings.module.css";
import { setApTrackerMenuOpen } from "@stores/uiStore";
import { settingsStore } from "@stores/settingsStore";
import { useNumberInputValue } from "@utils/hooks/useNumberInputValue";
import Modal from "@components/Modal";
import ModalMenu from "@components/ModalMenu";
import Headline from "@components/Headline";
import { Button } from "@components/Button";
import { Select, SelectOption } from "@components/Select";
import InputNumber from "@components/InputNumber";

export default function TrackerSettings() {
  const { userMaxAP } = useStore(settingsStore);
  const [trackerType, setTrackerType] = useState("byTarget");
  const [apTarget, setApTarget] = useNumberInputValue(currentAp);

  return (
    <Modal labelledBy="tracker-settings">
      <ModalMenu handleClose={() => setApTrackerMenuOpen(false)}>
        <Headline id="tracker-settings">AP Tracker</Headline>
        {typeof Notification !== "undefined" && (
          <Button disabled={Notification.permission === "granted"}>
            Enable Notifications
          </Button>
        )}
        <Select value={trackerType} onChange={value => setTrackerType(value)}>
          <SelectOption value="byTarget">To Target</SelectOption>
          <SelectOption value="byNodeCost">By Node Cost</SelectOption>
          <SelectOption value="byMaxAp">To Max AP</SelectOption>
        </Select>
        <form className={styles.formGrid}>
          {trackerType === "byTarget" && (
            <>
              <label htmlFor="ap-target">Target AP:</label>
              <InputNumber
                id="ap-target"
                value={apTarget}
                onChange={setApTarget}
                min={currentAp}
                max={userMaxAP}
                required
              />
            </>
          )}
        </form>
      </ModalMenu>
    </Modal>
  );
}
