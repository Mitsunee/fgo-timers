import { z } from "zod";

const _zIdArray = z.array(z.number().gt(100000));
export const ServantAvailabilitySchema = z.object({
  storylocked: _zIdArray,
  fp_pool: _zIdArray,
  limited: _zIdArray,
  welfare: _zIdArray,
  fp_limited: _zIdArray,
  fp_storylocked: _zIdArray
});

export type ServantAvailabilityMap = z.infer<typeof ServantAvailabilitySchema>;
