import { writeFile } from "fs/promises";
import { join } from "path";
import { zodToJsonSchema } from "zod-to-json-schema";
import { Log } from "~/utils/log";
import { AvailabilityMapSchema } from "./AvailabilityMap";
import { CustomItemSchema } from "./CustomItem";
import { EventSchema } from "./EventSchema";
import { QuestOpenOverridesSchema } from "./QuestOpenOverrides";
import { ShopSchema } from "./ShopSchema";

const AvailabilityMapJsonSchema = zodToJsonSchema(AvailabilityMapSchema);
const EventJsonSchema = zodToJsonSchema(EventSchema);
const CustomItemJsonSchema = zodToJsonSchema(CustomItemSchema);
const QuestOpenOverridesJsonSchema = zodToJsonSchema(QuestOpenOverridesSchema);
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
  writeSchema("event-schema.json", EventJsonSchema),
  writeSchema("custom-item-schema.json", CustomItemJsonSchema),
  writeSchema("shop-schema.json", ShopJsonSchema),
  writeSchema("quest-open-override-schema.json", QuestOpenOverridesJsonSchema)
]).then(() => {
  Log.ready("Generated JSON Schemas");
});
