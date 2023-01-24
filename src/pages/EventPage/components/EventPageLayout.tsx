import { useState } from "react";
import Clocks from "src/client/components/Clocks";
import Meta from "src/client/components/Meta";
import { RequiredChildren } from "src/types/ComponentProps";
import type { EventPageProps } from "../static";
import { EventHero } from "./EventHero";
import { EventInfoSection } from "./EventInfoSection";
import { EventNewsModal } from "./EventNewsModal";

interface LayoutProps extends Pick<EventPageProps, "event"> {
  children: RequiredChildren;
  description?: string;
}

export function EventPageLayout({ children, event, description }: LayoutProps) {
  const [showEmbed, setShowEmbed] = useState(false);
  const metaDesc = description || event.description.split("\n")[0];

  return (
    <>
      <Meta
        title={event.title}
        headerTitle="Events"
        image={`/assets/events/${event.banner}`}
        description={
          metaDesc.length > 250 ? `${metaDesc.slice(0, 250)}...` : metaDesc
        }
        headerDescription={`Event Timers for ${event.shortTitle}`}
      />
      <EventHero banner={event.banner} title={event.shortTitle} />
      <EventInfoSection
        title={event.title}
        date={event.date}
        description={event.description}
        requires={event.requires}
        modalCallback={() => setShowEmbed(true)}
      />
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
