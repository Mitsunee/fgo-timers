import { readdir } from "fs/promises";
import { join } from "path";
import { fileExists } from "@foxkit/node-util/fs";
import { readFileYaml } from "@foxkit/node-util/fs-yaml";
import { getFileName } from "@foxkit/node-util/path";
import { createEventSorter } from "../../events/sortEvents";
import { EventSchema } from "../../schema/EventSchema";
import { parseSchema } from "../../schema/verifySchema";
import { normalizeDate } from "../../time/normalizeDate";
import { Log } from "../../utils/log";
import type { BundledEvent } from "../../events/types";
import type { EventDataRaw } from "../../schema/EventSchema";
import type { PrebuildBundler } from "../utils/bundlers";

const eventsDir = join(process.cwd(), "assets/data/events");

export const bundleEvents: PrebuildBundler<BundledEvent[]> = async () => {
  const events = new Array<BundledEvent>();
  const servants = new Set<number>();
  const ces = new Set<number>();
  const items = new Set<number>();
  const ccs = new Set<number>();
  const dir = await readdir(eventsDir);
  const files = dir.filter(file => file.endsWith(".yml"));

  for (const fileName of files) {
    const filePath = join(eventsDir, fileName);
    const slug = getFileName(fileName, false);
    const fileContent = await readFileYaml<EventDataRaw>(filePath);
    if (!fileContent) {
      Log.warn(`Could not parse file '${fileName}'. Skipping...`);
      continue;
    }

    const fileParsed = parseSchema(fileContent, EventSchema, filePath);
    if (!fileParsed) return false;

    const bannerFilePath = join(
      "public",
      "assets",
      "events",
      fileParsed.banner
    );
    if (!(await fileExists(bannerFilePath))) {
      Log.error(`Banner image located at '${bannerFilePath}' was not found`);
      return false;
    }

    let hideAt: number = Array.isArray(fileParsed.date)
      ? fileParsed.date[1]
      : fileParsed.date;

    // browse schedules for later times and used entities
    fileParsed.schedules?.forEach(schedule => {
      if (schedule.ends && schedule.ends > hideAt) {
        hideAt = schedule.ends;
      }

      const final = schedule.times[schedule.times.length - 1].date;
      if (final > hideAt) hideAt = final;
      schedule.times.forEach(time => {
        time.servants?.forEach(servant => servants.add(servant));
        time.ces?.forEach(ce => ces.add(ce));
        time.items?.forEach(item => items.add(item));
        time.ccs?.forEach(cc => ccs.add(cc));
      });
    });

    // browse times for later times and used entities
    fileParsed.times?.forEach(time => {
      const ends = normalizeDate(time.date)[1];
      if (ends > hideAt) hideAt = ends;
      time.servants?.forEach(servant => servants.add(servant));
      time.ces?.forEach(ce => ces.add(ce));
      time.items?.forEach(item => items.add(item));
      time.ccs?.forEach(cc => ccs.add(cc));
    });

    // browse banners for later times and used entities
    fileParsed.banners?.forEach(banner => {
      if (banner.date[1] > hideAt) hideAt = banner.date[1];
      banner.servants?.forEach(servant => servants.add(servant));
      banner.ces?.forEach(ce => ces.add(ce));
    });

    const event: BundledEvent = {
      ...fileParsed,
      slug,
      hideAt
    };

    events.push(event);
  }

  const sorter = createEventSorter(Date.now());
  events.sort(sorter);

  Log.info(`Mapped data for ${events.length} Events`);
  return {
    name: "Events",
    path: "events.json",
    data: events,
    servants,
    ces,
    items,
    ccs
  };
};
