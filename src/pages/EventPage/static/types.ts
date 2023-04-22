import type { ParsedUrlQuery } from "querystring";
import type { BundledEvent } from "src/events/types";
import type { WithMaps } from "src/client/contexts";

export interface PageContext extends Partial<ParsedUrlQuery> {
  slug: string;
}

export interface EventPageProps extends WithMaps<"servants" | "ces" | "items"> {
  event: BundledEvent;
}

export interface StaticPath {
  params: PageContext;
}
