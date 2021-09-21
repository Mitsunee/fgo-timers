import { useStore } from "nanostores/react";

//import styles from "./APTracker.module.css";
import { apTrackerStore } from "@stores/apTrackerStore";
import { uiStore } from "@stores/uiStore";
import Tracker from "./Tracker";
import TrackerSettings from "./TrackerSettings";

export default function APTracker() {
  const { active } = useStore(apTrackerStore);
  const { apTrackerMenuOpen } = useStore(uiStore);

  return (
    <>
      {active && <Tracker />}
      {apTrackerMenuOpen && <TrackerSettings />}
    </>
  );
}
