import { isClamped } from "foxkit/clamp";

import styles from "./SpecialTimer.module.css";
import { useRecurringDaily } from "@utils/hooks/useRecurringDaily";
import { useFormattedTimestamp } from "@utils/hooks/useFormattedTimestamp";
import { useFormattedDelta } from "@utils/hooks/useFormattedDelta";
import Section from "@components/Section";
import InlineIcon from "@components/InlineIcon";

export default function SpecialTimer({ endsAt, startsAt }) {
  const nextPayout = useRecurringDaily({ hour: 10 });
  const date = useFormattedTimestamp(nextPayout, "short");
  const delta = useFormattedDelta(nextPayout);

  return isClamped({ value: nextPayout, max: endsAt, min: startsAt }) ? (
    <Section className={styles.section} background>
      <span>
        Next Payout in: {delta} ({date})
      </span>
      <InlineIcon className={styles.icon} icon="/assets/icon_enmapoints.png" />
    </Section>
  ) : null;
}
