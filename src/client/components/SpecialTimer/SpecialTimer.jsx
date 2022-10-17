//import { isClamped } from "foxkit/clamp";
//import { useStore } from "@nanostores/react";

import styles from "./SpecialTimer.module.css";
//import { useRecurringDaily } from "@utils/hooks/useRecurringDaily";
//import { intervalStore } from "@stores/intervalStore";
import { useFormattedTimestamp } from "@utils/hooks/useFormattedTimestamp";
import { useFormattedDelta } from "@utils/hooks/useFormattedDelta";
import Section from "@components/Section";
// import InlineIcon from "@components/InlineIcon";

export default function SpecialTimer({
  /*endsAt, */ startsAt,
  text,
  icon = false
}) {
  //const { interval } = useStore(intervalStore);
  const date = useFormattedTimestamp(startsAt, "short");
  const delta = useFormattedDelta(startsAt);

  return (
    /*isClamped({ value: interval, max: startsAt }) ? */
    <Section className={styles.section} background>
      <span>
        {text}: {delta} ({date})
      </span>
      {icon && <img src={icon} alt="Icon" className={styles.icon} />}
    </Section> /* : null*/
    /*: null*/
    /*: null*/
   /*: null*/);
}
