//import { isClamped } from "foxkit/clamp";

import styles from "./SpecialTimer.module.css";
//import { useRecurringDaily } from "@utils/hooks/useRecurringDaily";
import { useFormattedTimestamp } from "@utils/hooks/useFormattedTimestamp";
import { useFormattedDelta } from "@utils/hooks/useFormattedDelta";
import Section from "@components/Section";
// import InlineIcon from "@components/InlineIcon";

export default function SpecialTimer(/*{ endsAt, startsAt }*/) {
  // const nextPayout = useRecurringDaily({ hour: 10 });
  const tz = 1657612800000;
  const date = useFormattedTimestamp(tz, "short");
  const delta = useFormattedDelta(tz);

  return (
    /*isClamped({ value: tz, max: endsAt, min: startsAt }) ?*/ <Section
      className={styles.section}
      background>
      <span>
        FGO Summer Event 2022 - Servant Summer Camp: {delta} ({date})
      </span>
      <img
        src="/assets/events/summer5_logo.png"
        alt="Summer 5"
        title="Summer 5 Event"
        className={styles.icon}
      />
    </Section>
  ); /* : null;*/
}
