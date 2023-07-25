import path from "path";
import { z } from "zod";
import { ParsedYaml } from "~/schema/ParsedYaml";
import { Availability } from "~/types/enum";

const _zIdArray = z.array(z.number().gt(100000)).optional();

export const AvailabilityMapSchema = z.object({
  storylocked: _zIdArray,
  fp_pool: _zIdArray,
  limited: _zIdArray,
  welfare: _zIdArray,
  fp_limited: _zIdArray,
  fp_storylocked: _zIdArray
});

type AvailabilityMap = z.infer<typeof AvailabilityMapSchema>;

class AvailabilityMatcher {
  map: AvailabilityMap;
  constructor(map: AvailabilityMap) {
    this.map = map;
  }

  match(id: number): Availability | false {
    if (this.map.storylocked?.includes(id)) {
      return Availability.STORYLOCKED;
    } else if (this.map.limited?.includes(id)) {
      return Availability.LIMITED;
    } else if (this.map.welfare?.includes(id)) {
      return Availability.WELFARE;
    } else if (this.map.fp_pool?.includes(id)) {
      return Availability.FP_POOL;
    } else if (this.map.fp_limited?.includes(id)) {
      return Availability.FP_LIMITED;
    } else if (this.map.fp_storylocked?.includes(id)) {
      return Availability.FP_LOCKED;
    }
    return false;
  }
}

export type { AvailabilityMatcher };

export const AvailabilityFile = new ParsedYaml({
  schema: AvailabilityMapSchema,
  transform: value => new AvailabilityMatcher(value),
  limitPath: path.join(process.cwd(), "assets/data/availability")
});

/**
 * Get Availability Map as AvailabilityMatcher
 * @param filePath path to map file
 * @throws If file could not be parsed
 * @returns AvailabilityMatcher
 */
export async function getAvailabilityMap(filePath: string) {
  const res = await AvailabilityFile.readFile(filePath);
  if (!res.success) throw res.error;
  return res.data;
}
