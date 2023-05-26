import { InlineIcon } from "~/components/InlineIcon";
import Section from "~/components/Section";
import { DisplayDate, DisplayDelta } from "~/components/TimeDisplay";
import styles from "./SpecialTimer.module.css";

interface SpecialTimerProps {
  startsAt: number;
  text: string;
  icon?: string;
}

export function SpecialTimer({ startsAt, text, icon }: SpecialTimerProps) {
  //const { current } = useCurrentTime();

  return (
    /*isClamped({ value: current, max: startsAt }) ? */
    <Section className={styles.section} background>
      <span>
        {text}: <DisplayDelta time={startsAt} /> (
        <DisplayDate time={startsAt} format="short" />)
      </span>
      {icon && <InlineIcon icon={icon} title="Icon" className={styles.icon} />}
    </Section> // : null
  );
}
