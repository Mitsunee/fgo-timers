import path from "path";
import { getFileName, isFile } from "@foxkit/node-util/fs";
import { eventsCollectIDs } from "~/events/collectIDs";
import { createEventSorter } from "~/events/sortEvents";
import { EventFile } from "~/schema/EventSchema";
import { EventsFile } from "~/static/events";
import { normalizeDate } from "~/time/normalizeDate";
import { Log } from "~/utils/log";
import type { BundledEvent } from "~/events/types";
import { DirectoryBundler } from "../utils/bundlers";

const EventsBundler = new DirectoryBundler({
  name: "Events",
  recursive: true,
  inputFile: EventFile,
  outputFile: EventsFile,
  bundle: async files => {
    let success = true;
    const entries = Object.entries(files);
    const events = entries.flatMap<BundledEvent>(([filePath, res]) => {
      const fileName = getFileName(filePath, true);
      const slug = getFileName(filePath, false);
      if (!res?.success) {
        Log.warn(`Could not parse file '${fileName}'. Skipping...`);
        success = false;
        return [];
      }

      const fileParsed = res.data;

      let hideAt = Array.isArray(fileParsed.date)
        ? fileParsed.date[1]
        : fileParsed.date;

      // browse schedules for later times
      fileParsed.schedules?.forEach(schedule => {
        if (schedule.ends && schedule.ends > hideAt) {
          hideAt = schedule.ends;
        }

        const final = schedule.times[schedule.times.length - 1].date;
        if (final > hideAt) hideAt = final;
      });

      // browse times for later times
      fileParsed.times?.forEach(time => {
        // FIXME: doesn't handle times with no end date
        const ends = normalizeDate(time.date)[1];
        if (ends > hideAt) hideAt = ends;
      });

      // browse banners for later times
      fileParsed.banners?.forEach(banner => {
        if (banner.date[1] > hideAt) hideAt = banner.date[1];
      });

      return Object.assign({}, fileParsed, { slug, hideAt });
    });

    // check banner images
    await Promise.all(
      events.map(async event => {
        const imagePath = path.join(
          process.cwd(),
          "public/assets/events",
          event.banner
        );
        const check = await isFile(imagePath);
        if (!check) {
          Log.error(
            `Could not find event banner image '${event.banner}' in 'public/assets/events'`
          );
          success = false;
        }
      })
    );

    if (!success) throw new Error("Could not parse all event files");
    const ids = eventsCollectIDs(events);

    // sort events
    const sorter = createEventSorter(Date.now());
    events.sort(sorter);

    return { data: events, size: events.length, ids };
  }
});

export const bundleEvents = EventsBundler.processBundle.bind(EventsBundler);
