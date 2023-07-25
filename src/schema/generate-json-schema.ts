import { writeFile } from "fs/promises";
import { join } from "path";
import { zodToJsonSchema } from "zod-to-json-schema";
import { Log } from "~/utils/log";
import { AvailabilityMapSchema } from "./AvailabilityMap";
import { CustomItemSchema } from "./CustomItem";
import { EventSchema } from "./EventSchema";
import { QuestOpenOverridesSchema } from "./QuestOpenOverrides";
import { ServantNameOverridesSchema } from "./ServantNameOverrides";
import { ShopSchema } from "./ShopSchema";

const AvailabilityMapJsonSchema = zodToJsonSchema(AvailabilityMapSchema);
const CustomItemJsonSchema = zodToJsonSchema(CustomItemSchema);
const EventJsonSchema = zodToJsonSchema(EventSchema);
const QuestOpenOverridesJsonSchema = zodToJsonSchema(QuestOpenOverridesSchema);
const ServantNameOverridesJsonSchema = zodToJsonSchema(
  ServantNameOverridesSchema
);
const ShopJsonSchema = zodToJsonSchema(ShopSchema);

async function writeSchema(
  fileName: string,
  schema: ReturnType<typeof zodToJsonSchema>
) {
  const filePath = join(process.cwd(), "src/schema/json", fileName);
  return writeFile(filePath, JSON.stringify(schema, null, 2));
}

Promise.all([
  writeSchema("availability-map-schema.json", AvailabilityMapJsonSchema),
  writeSchema("custom-item-schema.json", CustomItemJsonSchema),
  writeSchema("event-schema.json", EventJsonSchema),
  writeSchema("quest-open-schema.json", QuestOpenOverridesJsonSchema),
  writeSchema("servant-name-schema.json", ServantNameOverridesJsonSchema),
  writeSchema("shop-schema.json", ShopJsonSchema)
]).then(() => {
  Log.ready("Generated JSON Schemas");
});
