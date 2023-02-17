//import styles from "./NextLogin.module.css";
import { useRecurringDaily } from "src/client/utils/hooks/useRecurringDaily";
import { DisplayDelta, DisplayDate } from "src/client/components/TimeDisplay";

export default function NextLogin() {
  const next = useRecurringDaily({ hour: 4, tz: "utc" });

  return (
    <p>
      Next Login Bonus Reset:
      <br />
      <DisplayDelta time={next} /> (
      <DisplayDate time={next} format="short" />)
    </p>
  );
}
