import type { IDCollection } from "~/prebuild/utils/collectIds";
import type { BundledEvent } from "./types";

type Options = Record<"times" | "schedules" | "banners", boolean>;

export function eventCollectIDs(event: BundledEvent, options?: Options) {
  const collection = {
    servants: new Set(),
    ces: new Set(),
    items: new Set(),
    ccs: new Set(),
    costumes: new Set()
  } satisfies Partial<IDCollection>;

  if (options?.times ?? true) {
    event.times?.forEach(time => {
      time.servants?.forEach(id => collection.servants.add(id));
      time.ces?.forEach(id => collection.ces.add(id));
      time.items?.forEach(id => collection.items.add(id));
      time.ccs?.forEach(id => collection.ccs.add(id));
      time.costumes?.forEach(id => collection.costumes.add(id));
    });
  }

  if (options?.schedules ?? true) {
    event.schedules?.forEach(schedule => {
      schedule.times.forEach(time => {
        time.servants?.forEach(id => collection.servants.add(id));
        time.ces?.forEach(id => collection.ces.add(id));
        time.items?.forEach(id => collection.items.add(id));
        time.ccs?.forEach(id => collection.ccs.add(id));
        time.costumes?.forEach(id => collection.costumes.add(id));
      });
    });
  }

  if (options?.banners ?? true) {
    event.banners?.forEach(banner => {
      banner.servants?.forEach(id => collection.servants.add(id));
      banner.ces?.forEach(id => collection.ces.add(id));
    });
  }

  return collection;
}

export function eventsCollectIDs(events: BundledEvent[]) {
  const collection = {
    servants: new Set(),
    ces: new Set(),
    items: new Set(),
    ccs: new Set(),
    costumes: new Set()
  } satisfies Partial<IDCollection>;

  for (const event of events) {
    event.times?.forEach(time => {
      time.servants?.forEach(id => collection.servants.add(id));
      time.ces?.forEach(id => collection.ces.add(id));
      time.items?.forEach(id => collection.items.add(id));
      time.ccs?.forEach(id => collection.ccs.add(id));
      time.costumes?.forEach(id => collection.costumes.add(id));
    });

    event.schedules?.forEach(schedule => {
      schedule.times.forEach(time => {
        time.servants?.forEach(id => collection.servants.add(id));
        time.ces?.forEach(id => collection.ces.add(id));
        time.items?.forEach(id => collection.items.add(id));
        time.ccs?.forEach(id => collection.ccs.add(id));
        time.costumes?.forEach(id => collection.costumes.add(id));
      });
    });

    event.banners?.forEach(banner => {
      banner.servants?.forEach(id => collection.servants.add(id));
      banner.ces?.forEach(id => collection.ces.add(id));
    });
  }

  return collection;
}
