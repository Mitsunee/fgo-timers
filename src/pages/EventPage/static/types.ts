import type { ParsedUrlQuery } from "querystring";
import type { WithMaps } from "src/client/contexts";
import type { BundledEvent } from "src/events/types";

export interface PageContext extends Partial<ParsedUrlQuery> {
  slug: string;
}

export interface EventPageProps
  extends WithMaps<"servants" | "ces" | "items" | "ccs"> {
  event: BundledEvent;
}

export interface StaticPath {
  params: PageContext;
}
