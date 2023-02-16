import { useMemo, useState, useEffect } from "react";
import Meta from "src/client/components/Meta";
import { Tabber } from "src/client/components/Tabber";
import type { Tabs } from "src/client/components/Tabber";
import type { RequiredChildren } from "src/types/ComponentProps";
import type { BundledEvent } from "src/events/types";
import type { EventPageProps } from "../static";
import { EventHero } from "./EventHero";
import { EventInfoSection } from "./EventInfoSection";
import { EventNewsModal } from "./EventNewsModal";

const RouteTabs = [
  { path: "/events/[slug]", label: "Timers" },
  { path: "/events/[slug]/banners", label: "Banners" },
  { path: "/events/[slug]/upgrades", label: "Upgrades" }
] as const;

function checkArr<T = unknown>(arr?: Array<T>): arr is Array<T> {
  if (!arr) return false;
  return arr.length > 0;
}

function mapRouteTabs(event: BundledEvent): Tabs {
  function mapPath(path: string): string {
    return path.replace("[slug]", event.slug);
  }

  return RouteTabs.map(({ path, label }) => {
    switch (label) {
      case "Timers":
        return {
          label,
          path: mapPath(path),
          enabled: true
        };
      case "Banners":
        return {
          label,
          path: mapPath(path),
          enabled: checkArr(event.banners)
        };
      case "Upgrades":
        return {
          label,
          path: mapPath(path),
          enabled: checkArr(event.upgrades)
        };
    }
  });
}

interface LayoutProps extends Pick<EventPageProps, "event"> {
  children: RequiredChildren;
  current: (typeof RouteTabs)[number]["label"];
  description?: string;
}

export function EventPageLayout({
  children,
  event,
  current,
  description
}: LayoutProps) {
  const [showEmbed, setShowEmbed] = useState(false);
  const metaDesc = description || event.description.split("\n")[0];
  const tabs = useMemo<Tabs>(() => mapRouteTabs(event), [event]);

  useEffect(() => {
    if (typeof window == "undefined") return;
    if (window.location.hash == "#tabs") {
      document.getElementById("tabs")?.scrollIntoView();
    }
  }, []);

  return (
    <>
      <Meta
        title={`${event.title} | ${current}`}
        headerTitle="Events"
        image={`/assets/events/${event.banner}`}
        description={
          metaDesc.length > 250 ? `${metaDesc.slice(0, 250)}...` : metaDesc
        }
        headerDescription={description || `Event Timers for ${event.title}`}
      />
      <EventHero banner={event.banner} title={event.shortTitle} />
      <EventInfoSection
        title={event.title}
        date={event.date}
        description={event.description}
        url={event.url}
        requires={event.requires}
        modalCallback={() => setShowEmbed(true)}
      />
      <Tabber tabs={tabs} current={current} id="tabs" />
      {children}
      {showEmbed && (
        <EventNewsModal
          url={event.url}
          closeCallback={() => setShowEmbed(false)}
        />
      )}
    </>
  );
}
