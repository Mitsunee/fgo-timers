#!/usr/bin/env node
import { join } from "path";
import { z } from "zod";
import picocolors from "picocolors";
import { CondType } from "@atlasacademy/api-connector";
import { readFileYaml } from "@foxkit/node-util/fs-yaml";
import { atlasApiNA } from "../atlas-api/api";
import { EventAssetsDir } from "../pages/EventPage/constants";
import { EventSchema } from "../schema/EventSchema";
import { parseSchema } from "../schema/verifySchema";
import { Log } from "../utils/log";

const ArgsSchema = z.tuple([
  z.string(),
  z
    .string()
    .regex(/^\d+$/, "ID must be numeric")
    .transform(arg => Number(arg))
]);

type Args = z.output<typeof ArgsSchema>;
type Main = (...args: Args) => Promise<any>;

async function getEventBySlug(slug: string) {
  const filePath = join(EventAssetsDir, `${slug}.yml`);
  const fileContent = await readFileYaml<z.input<typeof EventSchema>>(filePath);
  if (!fileContent) {
    Log.error(`Could not read EventFile at '${filePath}'`);
    return false;
  }

  const data = parseSchema(fileContent, EventSchema, filePath);
  if (!data) {
    Log.error(`Error parsing EventFile at '${filePath}'`);
    return false;
  }

  return data;
}

async function getEventNA(id: number) {
  try {
    return await atlasApiNA.event(id);
  } catch {
    Log.error(`Could not find event '${id}'`);
    return;
  }
}

async function getWarNA(id: number) {
  try {
    return await atlasApiNA.war(id);
  } catch {
    Log.error(`Could not find war '${id}'`);
    return;
  }
}

function validateWarsArray(
  arr: Awaited<ReturnType<typeof getWarNA>>[]
): arr is NonNullable<Awaited<ReturnType<typeof getWarNA>>>[] {
  return !arr.some(war => !war);
}

const missedPrefix = `${picocolors.magenta("missed")} -`;
function printMissedTimestamp(time: number, location: string) {
  console.log(`${missedPrefix} Found missing timestamp ${time} at ${location}`);
}

const main: Main = async (slug, id) => {
  const [bundledEvent, eventData] = await Promise.all([
    getEventBySlug(slug),
    getEventNA(id)
  ]);
  const timestampsKnown = new Set<number>();

  function checkTime(time: number, location: string) {
    if (timestampsKnown.has(time)) return;
    printMissedTimestamp(time, location);
  }

  if (!bundledEvent || !eventData) {
    process.exit(1);
  }

  const wars = await Promise.all(
    eventData.warIds.map(warId => getWarNA(warId))
  );

  if (!validateWarsArray(wars)) {
    process.exit(1);
  }

  // Collect known timestamps
  if (Array.isArray(bundledEvent.date)) {
    timestampsKnown.add(bundledEvent.date[0]);
    timestampsKnown.add(bundledEvent.date[1]);
  } else {
    timestampsKnown.add(bundledEvent.date);
  }
  bundledEvent.times?.forEach(time => {
    if (Array.isArray(time.date)) {
      timestampsKnown.add(time.date[0]);
      timestampsKnown.add(time.date[1]);
    } else {
      timestampsKnown.add(time.date);
    }
  });
  bundledEvent.schedules?.forEach(schedule => {
    if (schedule.ends) timestampsKnown.add(schedule.ends);
    schedule.times.forEach(time => {
      timestampsKnown.add(time.date);
    });
  });

  // scan event for missed timestamps
  checkTime(eventData.startedAt, `event.startedAt`);
  checkTime(eventData.endedAt, `event.endedAt`);
  eventData.missions.forEach(mission => {
    const cond = mission.conds.find(cond => cond.condType == CondType.DATE);
    if (!cond) return;
    checkTime(cond.targetNum, `event.missions{dispNo:${mission.dispNo}}`);
  });

  // scan wars for missed timestamps
  wars.forEach(war =>
    war.spots.forEach(spot =>
      spot.quests.forEach(quest =>
        checkTime(
          quest.openedAt,
          `war{name:"${quest.warLongName}"}.spot{name:"${quest.spotName}"}.quest{name:"${quest.name}"}.openedAt`
        )
      )
    )
  );
};

(async (argv: z.input<typeof ArgsSchema>) => {
  const args = parseSchema(argv, ArgsSchema, argv.join(" "));
  if (!args) {
    console.log("\n  Usage: check-event [slug] [id]\n");
    process.exit(1);
  }

  return main(...args);
})(process.argv.slice(2, 4) as z.input<typeof ArgsSchema>);
