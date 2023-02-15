import styles from "./SpecialTimer.module.css";
import Section from "src/client/components/Section";
import { DisplayDate, DisplayDelta } from "src/client/components/TimeDisplay";
import { InlineIcon } from "src/client/components/InlineIcon";

interface SpecialTimerProps {
  startsAt: number;
  text: string;
  icon?: string;
}

export function SpecialTimer({ startsAt, text, icon }: SpecialTimerProps) {
  //const { interval } = useStore(intervalStore);

  return (
    /*isClamped({ value: interval, max: startsAt }) ? */
    <Section className={styles.section} background>
      <span>
        {text}: <DisplayDelta time={startsAt} /> (
        <DisplayDate time={startsAt} format="short" />)
      </span>
      {icon && <InlineIcon icon={icon} title="Icon" className={styles.icon} />}
    </Section> // : null
  );
}
