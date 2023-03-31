import { useIsClient } from "src/client/utils/hooks/useIsClient";
import { useCurrentTime } from "src/client/utils/hooks/useCurrentTime";
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
import type { BundledEvent } from "src/events/types";
import { Borders } from "src/types/borders";
import type { EventPageProps } from "../static";
import styles from "./EventBannerCard.module.css";

type EventBanner = NonNullable<BundledEvent["banners"]>[number];

interface WithMaps {
  servants: EventPageProps["servants"];
  ces: EventPageProps["ces"];
}

interface EventBannerProps extends WithMaps {
  banner: EventBanner;
}

interface ServantDetailProps {
  servants: number[];
  map: EventPageProps["servants"];
}

interface CEDetailProps {
  ces: number[];
  map: EventPageProps["ces"];
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

function ServantDetails({ servants, map }: ServantDetailProps) {
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
            {...map[id]}
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

function CEDetails({ ces, map }: CEDetailProps) {
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
            {...map[id]}
            showAvailability
            showRarity
            disableSpoilers
          />
        </a>
      ))}
    </TimerListEntities>
  );
}

export function EventBannerCard({ banner, servants, ces }: EventBannerProps) {
  const firstServant = Array.isArray(banner.servants)
    ? servants[banner.servants[0]]
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
            <ServantDetails servants={banner.servants} map={servants} />
          </TimerListItem>
        )}
        {banner.ces && (
          <TimerListItem>
            <CEDetails ces={banner.ces} map={ces} />
          </TimerListItem>
        )}
      </TimerList>
    </Card>
  );
}
