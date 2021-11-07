//import styles from "./NextLogin.module.css";
import { useRecurringDaily } from "@utils/hooks/useRecurringDaily";
import { useFormattedTimestamp } from "@utils/hooks/useFormattedTimestamp";
import { useFormattedDelta } from "@utils/hooks/useFormattedDelta";

export default function NextLogin() {
  const next = useRecurringDaily({ hour: 4, tz: "utc" });
  const date = useFormattedTimestamp(next, "short");
  const delta = useFormattedDelta(next);

  return (
    <p>
      Next Login Bonus Reset:
      <br />
      {delta} ({date})
    </p>
  );
}
