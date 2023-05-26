import {
  BorderedCEIcon,
  BorderedServantIcon
} from "src/client/components/BorderedIcon";
import {
  Card,
  TimerList,
  TimerListEntities,
  TimerListItem
} from "src/client/components/Card";
import { DisplayDate, DisplayDelta } from "src/client/components/TimeDisplay";
import { useServantMap } from "src/client/contexts";
import { useCurrentTime } from "src/client/utils/hooks/useCurrentTime";
import { useIsClient } from "src/client/utils/hooks/useIsClient";
import { Borders } from "src/types/borders";
import type { BundledEvent } from "src/events/types";
import styles from "./EventBannerCard.module.css";

type EventBanner = NonNullable<BundledEvent["banners"]>[number];

interface EventBannerProps {
  banner: EventBanner;
}

interface ServantDetailProps {
  servants: number[];
}

interface CEDetailProps {
  ces: number[];
}

function TimeDetails({ banner }: Pick<EventBannerProps, "banner">) {
  const isClient = useIsClient();
  const { current } = useCurrentTime();
  const [start, end] = banner.date;
  const hasStarted = current >= start;
  const hasEnded = current >= end;

  return (
    <TimerListItem>
      {isClient && hasEnded && <li data-wide>Has Ended</li>}
      <li>
        <b>Start{isClient && hasStarted ? "ed" : "s"}:</b>{" "}
        <DisplayDate time={start} />
      </li>
      <li>
        <b>End{isClient && hasEnded ? "ed" : "s"}:</b>{" "}
        <DisplayDate time={end} />
      </li>
      {isClient && !hasEnded && (
        <li data-wide>
          <b>{hasStarted ? "End" : "Start"}s in:</b>{" "}
          <DisplayDelta time={hasStarted ? end : start} />
        </li>
      )}
    </TimerListItem>
  );
}

function ServantDetails({ servants }: ServantDetailProps) {
  return (
    <TimerListEntities title="Servants" className={styles.servants}>
      {servants.map(id => (
        <a
          key={id}
          href={`https://apps.atlasacademy.io/db/NA/servant/${id}`}
          target="_blank"
          rel="noreferrer noopener">
          <BorderedServantIcon
            servantId={id}
            showAvailability
            showClass
            showRarity
            disableSpoilers
          />
        </a>
      ))}
    </TimerListEntities>
  );
}

function CEDetails({ ces }: CEDetailProps) {
  return (
    <TimerListEntities title="Craft Essences" className={styles.ces}>
      {ces.map(id => (
        <a
          key={id}
          href={`https://apps.atlasacademy.io/db/NA/craft-essence/${id}`}
          target="_blank"
          rel="noreferrer noopener">
          <BorderedCEIcon
            ceId={id}
            showAvailability
            showRarity
            disableSpoilers
          />
        </a>
      ))}
    </TimerListEntities>
  );
}

export function EventBannerCard({ banner }: EventBannerProps) {
  const servantMap = useServantMap();
  const firstServant = Array.isArray(banner.servants)
    ? servantMap[banner.servants[0]]
    : null;
  const icon = firstServant ? firstServant.icon : "/assets/icon_mm.png";
  const title = firstServant ? firstServant.name : "Summoning Banner";

  return (
    <Card
      icon={icon}
      forceRound={firstServant != null}
      placeholder={title}
      title={title}
      color={Borders.GOLD}>
      <TimerList>
        <TimeDetails banner={banner} />
        {banner.servants && (
          <TimerListItem>
            <ServantDetails servants={banner.servants} />
          </TimerListItem>
        )}
        {banner.ces && (
          <TimerListItem>
            <CEDetails ces={banner.ces} />
          </TimerListItem>
        )}
      </TimerList>
    </Card>
  );
}
