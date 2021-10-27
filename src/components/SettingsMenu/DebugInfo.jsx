import spacetime from "spacetime";

import styles from "./DebugInfo.module.css";
import CollapsableSection from "@components/CollapsableSection";

export default function DebugInfo() {
  const userTimezone = spacetime.now().timezone();
  const { offset } = userTimezone.current;
  const offsetTime = `UTC${offset < 0 ? "" : "+"}${Math.trunc(
    offset
  )}:${`${Math.abs((offset * 60) % 60)}`.padStart(2, "0")}`;

  return (
    <CollapsableSection summary="Debug Info">
      <div className={styles.infoGrid}>
        <span>
          <b>Detected Timezone</b>
        </span>
        <span>{userTimezone.name}</span>
        <span>
          <b>Detected Offset</b>
        </span>
        <span>{offsetTime}</span>
        <span>
          <b>DST</b>
        </span>
        <span>
          {userTimezone.hasDst
            ? userTimezone.current.isDST
              ? "Currently has DST"
              : "Currently no DST"
            : "Never has DST"}
        </span>
      </div>
    </CollapsableSection>
  );
}
