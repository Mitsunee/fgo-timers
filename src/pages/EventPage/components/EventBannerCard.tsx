import { BorderedCEIcon, BorderedServantIcon } from "@components/BorderedIcon";
import { Card } from "@components/Card";
import { DisplayDate, DisplayDelta } from "@components/TimeDisplay";
import { useStore } from "@nanostores/react";
import { intervalStore } from "@stores/intervalStore";
import { useIsClient } from "@utils/hooks/useIsClient";
import cc from "classcat";
import type { BundledEvent } from "src/events/types";
import { Borders } from "src/types/borders";
import type { EventPageProps } from "../getStaticProps";
import styles from "./EventBannerCard.module.css";

type EventBanner = Exclude<BundledEvent["banners"], undefined>[number];

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
  const { seconds: current } = useStore(intervalStore);
  const [start, end] = banner.date;
  const hasStarted = current >= start;
  const hasEnded = current >= end;

  return (
    <li>
      <ul style={{ padding: 0 }}>
        {isClient && hasEnded && <li>Has Ended</li>}
        <li>
          <b>Start{isClient && hasStarted ? "ed" : "s"}:</b>{" "}
          <DisplayDate time={start * 1000} />
        </li>
        <li>
          <b>End{isClient && hasEnded ? "ed" : "s"}:</b>{" "}
          <DisplayDate time={end * 1000} />
        </li>
        {!hasEnded && (
          <li className={styles.wide}>
            <b>{hasStarted ? "End" : "Start"}s in:</b>{" "}
            <DisplayDelta time={(hasStarted ? end : start) * 1000} />
          </li>
        )}
      </ul>
    </li>
  );
}

function ServantDetails({ servants, map }: ServantDetailProps) {
  return (
    <li>
      <h2>Servants</h2>
      <div className={cc([styles.entities, styles.servants])}>
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
      </div>
    </li>
  );
}

function CEDetails({ ces, map }: CEDetailProps) {
  return (
    <li>
      <h2>Craft Essences</h2>
      <div className={cc([styles.entities, styles.ces])}>
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
      </div>
    </li>
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
      <ul>
        <TimeDetails banner={banner} />
        {banner.servants && (
          <ServantDetails servants={banner.servants} map={servants} />
        )}
        {banner.ces && <CEDetails ces={banner.ces} map={ces} />}
      </ul>
    </Card>
  );
}
