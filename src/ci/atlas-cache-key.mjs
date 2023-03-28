import { ApiConnector, Region } from "@atlasacademy/api-connector";

(async () => {
  const connectorJP = new ApiConnector({ region: Region.JP });
  const connectorNA = new ApiConnector({ region: Region.NA });

  const [infoNA, infoJP] = await Promise.all([
    connectorJP.info(),
    connectorNA.info()
  ]);

  console.log(`ATLAS-CACHE-KEY=atlas-${infoJP.hash}-${infoNA.hash}`);
})();
