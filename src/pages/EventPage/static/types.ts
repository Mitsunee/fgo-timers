import type { ParsedUrlQuery } from "querystring";
import type { WithMaps } from "~/client/contexts";
import type { BundledEvent } from "~/events/types";

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
