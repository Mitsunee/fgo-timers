import { ApiConnector, Language, Region } from "@atlasacademy/api-connector";

export type SupportedRegion = Region.JP | Region.NA;
const language = Language.ENGLISH;

//const basePath = "https://api.atlasacademy.io";

// nice endpoints
export const atlasNa = new ApiConnector({ region: Region.NA, language });
export const atlasJp = new ApiConnector({ region: Region.JP, language });
export const atlasApi = {
  [Region.NA]: atlasNa,
  [Region.JP]: atlasJp
};

// basic endpoints
//export const atlasBasicNa = createApi(`${basePath}/basic/NA`);
//export const atlasBasicJp = createApi(`${basePath}/basic/JP`);

// exports endpoints
//export const atlasExport = {
//    [Region.NA]: atlasNa.
//}
