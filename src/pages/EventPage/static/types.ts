import type { ParsedUrlQuery } from "querystring";
import type { BundledEvent } from "src/events/types";
import type { BundledCE } from "src/items/types";
import type { BundledServant } from "src/servants/types";

export interface PageContext extends Partial<ParsedUrlQuery> {
  slug: string;
}

export interface PageProps {
  event: BundledEvent;
  servants: Record<number, BundledServant>;
  ces: Record<number, BundledCE>;
}

export interface StaticPath {
  params: PageContext;
}
