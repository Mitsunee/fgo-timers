import { readFileJson, writeFile } from "@foxkit/node-util/fs";
import { join } from "path";
import type {
  Servant,
  ServantBasic
} from "@atlasacademy/api-connector/dist/Schema/Servant";
import type { Item } from "@atlasacademy/api-connector/dist/Schema/Item";
import type { MasterMission } from "@atlasacademy/api-connector/dist/Schema/MasterMission";
import type { War } from "@atlasacademy/api-connector/dist/Schema/War";

import { atlasApi, SupportedRegion } from "./api";
import { CraftEssenceBasic } from "@atlasacademy/api-connector/dist/Schema/CraftEssence";

export const cachePath = ".next/cache/atlasacademy";
export const cacheVersion = "0.3.0"; // NOTE: bump when adding new things to cache

enum CacheFile {
  SERVANT = "nice_servant.json",
  SERVANT_BASIC = "basic_servant.json",
  ITEM = "nice_item.json",
  CE_BASIC = "basic_equip.json",
  WAR = "nice_war.json",
  MASTERMISSION = "nice_master_mission.json"
}

class AtlasApiCache {
  region: SupportedRegion;
  api: typeof atlasApi[SupportedRegion];
  private servant?: Servant[];
  private servantBasic?: ServantBasic[];
  private item?: Item[];
  private ce?: CraftEssenceBasic[];
  private war?: War[];
  private masterMission?: MasterMission[];

  constructor(region: SupportedRegion) {
    this.region = region;
    this.api = atlasApi[region];
  }

  private resetCache() {
    this.servant = undefined;
    this.item = undefined;
    this.masterMission = undefined;
    this.war = undefined;
  }

  private createError(file: CacheFile) {
    return new Error(
      `Could not read ${file} from cache for region ${this.region}`
    );
  }

  private async readFile<T>(file: CacheFile): Promise<T> {
    const data = await readFileJson<T>(join(cachePath, this.region, file));
    if (!data) throw this.createError(file);
    return data;
  }

  private async writeFile<T extends object>(file: CacheFile, data: T) {
    return writeFile(join(cachePath, this.region, file), data);
  }

  async getNiceServant(): Promise<Servant[]> {
    return (this.servant ||= await this.readFile<Servant[]>(CacheFile.SERVANT));
  }

  async getBasicServant(): Promise<ServantBasic[]> {
    return (this.servantBasic ||= await this.readFile<ServantBasic[]>(
      CacheFile.SERVANT_BASIC
    ));
  }

  async getNiceItem(): Promise<Item[]> {
    return (this.item ||= await this.readFile<Item[]>(CacheFile.ITEM));
  }

  async getBasicCE(): Promise<CraftEssenceBasic[]> {
    return (this.ce ||= await this.readFile<CraftEssenceBasic[]>(
      CacheFile.CE_BASIC
    ));
  }

  async getNiceWar(): Promise<War[]> {
    return (this.war ||= await this.readFile<War[]>(CacheFile.WAR));
  }

  async getMasterMissions(): Promise<MasterMission[]> {
    if (this.region != "NA") {
      throw new Error("MasterMissions are currently only cached for NA");
    }

    return (this.masterMission ||= await this.readFile<MasterMission[]>(
      CacheFile.MASTERMISSION
    ));
  }

  async getInfo() {
    const info = await this.api.info();
    return info.timestamp;
  }

  async updateCache() {
    const [servantData, servantDataBasic, itemData, ceData, warData] =
      await Promise.all([
        this.api.servantListNice(),
        this.api.servantList(),
        this.api.itemList(),
        this.api.craftEssenceList(),
        this.api.warListNice()
      ]);

    await Promise.all([
      this.writeFile(CacheFile.SERVANT, servantData),
      this.writeFile(CacheFile.SERVANT_BASIC, servantDataBasic),
      this.writeFile(CacheFile.CE_BASIC, ceData),
      this.writeFile(CacheFile.ITEM, itemData),
      this.writeFile(CacheFile.WAR, warData)
    ]);

    if (this.region == "NA") {
      const masterMissionData = await this.api.masterMissionList();
      await this.writeFile(CacheFile.MASTERMISSION, masterMissionData);
    }

    this.resetCache();
  }
}

export const atlasCacheNA = new AtlasApiCache("NA");
export const atlasCacheJP = new AtlasApiCache("JP");
export const atlasCache = { NA: atlasCacheNA, JP: atlasCacheJP };
