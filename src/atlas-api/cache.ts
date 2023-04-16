import { readFileJson, writeFile } from "@foxkit/node-util/fs";
import { join } from "path";
import type {
  Servant,
  ServantBasic
} from "@atlasacademy/api-connector/dist/Schema/Servant";
import type { Item } from "@atlasacademy/api-connector/dist/Schema/Item";
import type { MasterMission } from "@atlasacademy/api-connector/dist/Schema/MasterMission";
import type { War } from "@atlasacademy/api-connector/dist/Schema/War";

import type { SupportedRegion } from "./api";
import { atlasApi } from "./api";
import type { CraftEssenceBasic } from "@atlasacademy/api-connector/dist/Schema/CraftEssence";
import { Semaphore } from "../utils/Semaphore";

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

type CacheQueueNode = [CacheFile, (...args: any) => Promise<any>];
type CacheQueue = CacheQueueNode[];

class AtlasApiCache {
  readonly region: SupportedRegion;
  readonly api: (typeof atlasApi)[SupportedRegion];
  private queue: CacheQueue;
  private servant?: Servant[];
  private servantBasic?: ServantBasic[];
  private item?: Item[];
  private ce?: CraftEssenceBasic[];
  private war?: War[];
  private masterMission?: MasterMission[];

  constructor(region: SupportedRegion) {
    this.region = region;
    const api = atlasApi[region];
    this.api = api;
    this.queue = [
      [CacheFile.SERVANT, api.servantListNice.bind(api)],
      [CacheFile.SERVANT_BASIC, api.servantList.bind(api)],
      [CacheFile.ITEM, api.itemList.bind(api)],
      [CacheFile.CE_BASIC, api.craftEssenceList.bind(api)],
      [CacheFile.WAR, api.warListNice.bind(api)]
    ];

    if (region == "NA") {
      this.queue.push([
        CacheFile.MASTERMISSION,
        api.masterMissionList.bind(api)
      ]);
    }
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
    const handler = async ([filePath, getter]: CacheQueueNode) =>
      getter().then(data => this.writeFile(filePath, data));

    const sem = new Semaphore(handler, 3);
    await sem.run(this.queue);

    this.resetCache();
  }
}

export const atlasCacheNA = new AtlasApiCache("NA");
export const atlasCacheJP = new AtlasApiCache("JP");
export const atlasCache = { NA: atlasCacheNA, JP: atlasCacheJP };
