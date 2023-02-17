import { readFileYaml } from "@foxkit/node-util/fs-yaml";
import { verifySchema } from "../schema/verifySchema";
import type { AvailabilityMap } from "../schema/AvailabilityMap";
import { AvailabilityMapSchema } from "../schema/AvailabilityMap";
import { Availability } from "../types/enum";

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

export async function getAvailabilityMap(filePath: string) {
  const data = await readFileYaml<Partial<AvailabilityMap>>(filePath);
  if (!data || !verifySchema(data, AvailabilityMapSchema, filePath)) {
    return false;
  }
  return new AvailabilityMatcher(data);
}
