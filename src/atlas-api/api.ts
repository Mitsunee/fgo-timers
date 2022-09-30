import { ApiConnector, Language, Region } from "@atlasacademy/api-connector";

export type SupportedRegion = "JP" | "NA";
const language = Language.ENGLISH;

export const atlasNa = new ApiConnector({ region: Region.NA, language });
export const atlasJp = new ApiConnector({ region: Region.JP, language });
export const atlasApi = { NA: atlasNa, JP: atlasJp };
