import type { IDCollection } from "~/prebuild/utils/collectIds";
import type { BundledEvent } from "./types";

export function eventCollectIDs(event: BundledEvent) {
  const collection = {
    servants: new Set(),
    ces: new Set(),
    items: new Set(),
    ccs: new Set()
  } satisfies Partial<IDCollection>;

  event.times?.forEach(time => {
    time.servants?.forEach(id => collection.servants.add(id));
    time.ces?.forEach(id => collection.ces.add(id));
    time.items?.forEach(id => collection.items.add(id));
    time.ccs?.forEach(id => collection.ccs.add(id));
  });

  event.schedules?.forEach(schedule => {
    schedule.times.forEach(time => {
      time.servants?.forEach(id => collection.servants.add(id));
      time.ces?.forEach(id => collection.ces.add(id));
      time.items?.forEach(id => collection.items.add(id));
      time.ccs?.forEach(id => collection.ccs.add(id));
    });
  });

  event.banners?.forEach(banner => {
    banner.servants?.forEach(id => collection.servants.add(id));
    banner.ces?.forEach(id => collection.ces.add(id));
  });

  return collection;
}

export function eventsCollectIDs(events: BundledEvent[]) {
  const collection = {
    servants: new Set(),
    ces: new Set(),
    items: new Set(),
    ccs: new Set()
  } satisfies Partial<IDCollection>;

  for (const event of events) {
    event.times?.forEach(time => {
      time.servants?.forEach(id => collection.servants.add(id));
      time.ces?.forEach(id => collection.ces.add(id));
      time.items?.forEach(id => collection.items.add(id));
      time.ccs?.forEach(id => collection.ccs.add(id));
    });

    event.schedules?.forEach(schedule => {
      schedule.times.forEach(time => {
        time.servants?.forEach(id => collection.servants.add(id));
        time.ces?.forEach(id => collection.ces.add(id));
        time.items?.forEach(id => collection.items.add(id));
        time.ccs?.forEach(id => collection.ccs.add(id));
      });
    });

    event.banners?.forEach(banner => {
      banner.servants?.forEach(id => collection.servants.add(id));
      banner.ces?.forEach(id => collection.ces.add(id));
    });
  }

  return collection;
}
