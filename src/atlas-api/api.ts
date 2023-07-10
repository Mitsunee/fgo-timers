import { ApiConnector, Language, Region } from "@atlasacademy/api-connector";

const language = Language.ENGLISH;

export const atlasApiNA = new ApiConnector({ region: Region.NA, language });
export const atlasApiJP = new ApiConnector({ region: Region.JP, language });
export const atlasApi = { NA: atlasApiNA, JP: atlasApiJP };
