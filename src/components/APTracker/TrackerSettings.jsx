import { useState } from "react";
import { useStore } from "nanostores/react";

import styles from "./TrackerSettings.module.css";
import { setApTrackerMenuOpen } from "@stores/uiStore";
import { settingsStore, setUserKey } from "@stores/settingsStore";
import { useInputNumberValue } from "@utils/hooks/useInputNumberValue";
import Modal from "@components/Modal";
import ModalMenu from "@components/ModalMenu";
import Headline from "@components/Headline";
import { Button } from "@components/Button";
import { Select, SelectOption } from "@components/Select";
import InputNumber from "@components/InputNumber";

export default function TrackerSettings() {
  const { userMaxAP, userNodeCost } = useStore(settingsStore);
  const [trackerType, setTrackerType] = useState("byTarget");
  const [notificationGranted, setNotificationGranted] = useState(
    Notification?.permission === "granted" || false
  );
  const [currentAp, setCurrentAp] = useInputNumberValue(0);
  const [apTarget, setApTarget] = useInputNumberValue(1);

  console.log("render TrackerSettings");

  return (
    <Modal labelledBy="tracker-settings">
      <ModalMenu handleClose={() => setApTrackerMenuOpen(false)}>
        <Headline id="tracker-settings">AP Tracker Setup</Headline>
        <form className={styles.formGrid}>
          {typeof Notification !== "undefined" && (
            <div>
              <Button
                disabled={notificationGranted}
                onClick={ev => {
                  ev.preventDefault();
                  Notification.requestPermission().then(permission =>
                    setNotificationGranted(permission === "granted")
                  );
                }}>
                {notificationGranted
                  ? "Notifications Enabled"
                  : "Enable Notifications"}
              </Button>
            </div>
          )}
          <Select
            value={trackerType}
            onChange={(value, event) => {
              setTrackerType(value);
              event.preventDefault();
            }}>
            <SelectOption value="byTarget">To Target</SelectOption>
            <SelectOption value="byNodeCost">By Node Cost</SelectOption>
            <SelectOption value="byMaxAp">To Max AP</SelectOption>
          </Select>
          <label htmlFor="max-ap">Max AP:</label>
          <InputNumber
            id="max-ap"
            value={userMaxAP}
            onChange={ev => setUserKey("userMaxAP", ev.target.value)}
            min={20}
            max={142}
            required
          />
          <label htmlFor="current-ap">Current AP:</label>
          <InputNumber
            id="current-ap"
            value={currentAp}
            onChange={setCurrentAp}
            min={0}
            max={userMaxAP}
            required
          />
          {/* TODO: offsetTime input */}
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
          {trackerType === "byNodeCost" && (
            <>
              <label htmlFor="node-cost">Node Cost:</label>
              <InputNumber
                id="node-cost"
                value={userNodeCost}
                onChange={ev => setUserKey("userNodeCost", ev.target.value)}
                min={3}
                max={40}
              />
            </>
          )}
          <div className={styles.submitWrapper}>
            <Button inputType="submit">Start AP Tracker</Button>
          </div>
        </form>
      </ModalMenu>
    </Modal>
  );
}
