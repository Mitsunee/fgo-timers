#!/usr/bin/env node
/**
 * Script to find timestamps in atlasacademy API that don't appear in given event file
 * @argument slug slug matching name of event file to reference
 * @argument id event id to reference from atlasacademy API
 */
import { join } from "path";
import { CondType } from "@atlasacademy/api-connector";
import { readFileYaml } from "@foxkit/node-util/fs-yaml";
import picocolors from "picocolors";
import { z } from "zod";
import { atlasApiNA } from "~/atlas-api/api";
import { EventSchema } from "~/schema/EventSchema";
import { parseSchema } from "~/schema/verifySchema";
import { Log } from "~/utils/log";

const ArgsSchema = z.tuple([
  z.string(),
  z
    .string()
    .regex(/^\d+$/, "ID must be numeric")
    .transform(arg => Number(arg))
]);

type Args = z.output<typeof ArgsSchema>;
type Main = (...args: Args) => Promise<any>;

/**
 * Reads and parses event file by slug
 * @param slug slug matching name of event file to reference
 * @returns Result of parsing event file with EventSchema. `false` if file not found.
 */
async function getEventBySlug(slug: string) {
  const filePath = join("assets/data/events", `${slug}.yml`);
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

/**
 * Get Event from atlasacademy API by id
 * @param id id of event
 * @returns Event or void if not found
 */
async function getEventNA(id: number) {
  try {
    return await atlasApiNA.event(id);
  } catch {
    Log.error(`Could not find event '${id}'`);
    return;
  }
}

/**
 * Get War from atlasacademy API by id
 * @param id id of war
 * @returns War or void if not found
 */
async function getWarNA(id: number) {
  try {
    return await atlasApiNA.war(id);
  } catch {
    Log.error(`Could not find war '${id}'`);
    return;
  }
}

/**
 * Confirms all Wars in array have been found
 * @param arr Array of Wars (results of getWarNA calls)
 * @returns same array (typeguarded)
 */
function validateWarsArray(
  arr: Awaited<ReturnType<typeof getWarNA>>[]
): arr is NonNullable<Awaited<ReturnType<typeof getWarNA>>>[] {
  return !arr.some(war => !war);
}

const missedPrefix = `${picocolors.magenta("missed")} -`;
/**
 * Logs missed timestamp to console
 * @param time timestamp of event in seconds
 * @param location description of location in datastructure
 */
function printMissedTimestamp(time: number, location: string) {
  console.log(`${missedPrefix} Found missing timestamp ${time} at ${location}`);
}

const main: Main = async (slug, id) => {
  const [bundledEvent, eventData] = await Promise.all([
    getEventBySlug(slug),
    getEventNA(id)
  ]);
  const timestampsKnown = new Set<number>();

  /**
   * Checks whether timestamp is known and logs to console if not known.
   * @param time  timestamp of event in seconds
   * @param location  description of location in datastructure
   */
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
