import { createDerived } from "nanostores";
import { createPersistentMap } from "@nanostores/persistent";
import { nanoid } from "nanoid";

/*
 * This store uses persistence which requires all values to be string.
 * A derived store that converts types automatically is provided.
 */

// main store [key] => string
export const apTrackerMap = createPersistentMap("fgoToolsAP:", {
  active: "false",
  trackerId: "default", // random string
  type: "null", // "null" | "byNodeCost" | "byTarget"
  target: "1",
  nodeCost: "1",
  apAtStart: "0",
  offsetTime: "0", // seconds to subtract based on timer to next ap
  startTime: "0"
});

export const apTrackerStore = createDerived(apTrackerMap, store => ({
  active: store.active === "true",
  trackerId: store.trackerId,
  type: store.type === null ? null : store.type,
  target: +store.target,
  nodeCost: store.type === "byNodeCost" ? +store.nodeCost : null,
  apAtStart: +store.apAtStart,
  offsetTime: +store.offsetTime,
  startTime: +store.startTime
}));

export function startApTracker(
  { type, target, nodeCost, apAtStart, mins, secs },
  interval
) {
  const offsetTime = 300 - mins * 60 - secs;
  apTrackerMap.set({
    active: "true",
    trackerId: nanoid(),
    type,
    target: `${target}`,
    nodeCost: `${nodeCost}`,
    apAtStart: `${apAtStart}`,
    offsetTime: `${offsetTime}`,
    startTime: `${Math.floor(interval / 1000)}`
  });
}

let notification = null;

export function resetApTracker() {
  apTrackerMap.setKey("active", "false");
  notification?.close(); // close notification if any
  notification = null; // clear global
}

const notify = body => {
  notification?.close(); // close previous notification

  if (Notification?.permission === "granted") {
    // send new notification and attach events
    notification = new Notification("FGO Tools AP Tracker", {
      body,
      icon: "/icon-192.png",
      requireInteraction: true
    });
    notification.addEventListener("click", () => {
      window?.focus();
    });
  }
};

export function triggerApNotification({ type, target, nodeCost }) {
  const message = `You hit your AP target of ${target} AP!${
    type === "byNodeCost" ? ` (${Math.round(target / nodeCost)} runs)` : ""
  }`;

  notify(message);
}

export function triggerApMaxNotification(max) {
  notify(`You hit your AP cap (${max} AP)!`);
}
