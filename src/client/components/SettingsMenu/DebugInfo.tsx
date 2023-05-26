import spacetime from "spacetime";
import type { TimezoneMeta } from "spacetime";
import CollapsableSection from "~/components/CollapsableSection";
import { Global } from "~/types/enum";
import styles from "./DebugInfo.module.css";

function offsetToString(offset: number) {
  return `UTC${offset < 0 ? "" : "+"}${Math.trunc(offset)}:${`${Math.abs(
    (offset * 60) % 60
  )}`.padStart(2, "0")}`;
}

function getDSTState(tz: TimezoneMeta) {
  return tz.hasDst
    ? tz.current.isDST
      ? "Currently has DST"
      : "Currently no DST"
    : "Never has DST";
}

export function DebugInfo() {
  const userTimezone = spacetime.now().timezone();
  const serverTimezone = spacetime.now(Global.SERVER_TZ).timezone();

  return (
    <CollapsableSection background={undefined} summary="Debug Info">
      <table className={styles.table}>
        <tr>
          <th>Detected Timezone</th>
          <td>{userTimezone.name}</td>
        </tr>
        <tr>
          <th>Detected Offset</th>
          <td>{offsetToString(userTimezone.current.offset)}</td>
        </tr>
        <tr>
          <th>Detected DST</th>
          <td>{getDSTState(userTimezone)}</td>
        </tr>
        <tr>
          <th>Server Timezone</th>
          <td>{serverTimezone.name}</td>
        </tr>
        <tr>
          <th>Server Offset</th>
          <td>{offsetToString(serverTimezone.current.offset)}</td>
        </tr>
        <tr>
          <th>Server DST</th>
          <td>{getDSTState(serverTimezone)}</td>
        </tr>
      </table>
    </CollapsableSection>
  );
}
