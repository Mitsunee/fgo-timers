import readline from "readline";
import { dedent } from "@foxkit/util/dedent";
import type { Servant } from "@atlasacademy/api-connector/dist/Schema/Servant";
import type { CraftEssenceBasic } from "@atlasacademy/api-connector/dist/Schema/CraftEssence";
import type { Item } from "@atlasacademy/api-connector/dist/Schema/Item";
import type { CommandCodeBasic } from "@atlasacademy/api-connector/dist/Schema/CommandCode";
import type { MysticCodeBasic } from "@atlasacademy/api-connector/dist/Schema/MysticCode";
import picocolors from "picocolors";
import { Searcher } from "fast-fuzzy";
import type { MatchData } from "fast-fuzzy";
import { prepareCache } from "../atlas-api/prepare";
import { atlasCacheJP } from "../atlas-api/cache";
import type { BundledItem } from "../items/types";
import { Log } from "./log";
import { getCustomItems } from "./getBundles";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const dd = dedent({ tabWidth: 4, trim: true, useTabs: false });

function readlinePrompt(prompt: string): Promise<string> {
  return new Promise(resolve => {
    rl.question(`${prompt}: `, answer => {
      console.log();
      resolve(answer);
    });
  });
}

function prettyprintMatch(match: MatchData<any>) {
  const text = match.original;
  const { index, length } = match.match;
  const end = index + length;
  const before = text.slice(0, index);
  const matched = text.slice(index, end);
  const after = text.substring(end);

  return `${before}${picocolors.bold(matched)}${after}`;
}

enum Menu {
  SELECT = 1,
  SERVANT,
  CRAFT_ESSENCE,
  ITEM,
  ITEM_CUSTOM,
  COMMAND_CODE,
  MYSTIC_CODE
}

type MenuFn = () => Promise<boolean>;
type SearcherOpts<T> = {
  keySelector: (candidate: T) => string;
  returnMatchData: true;
  threshold?: number;
};

async function menuSelectMenu(): Promise<false | Menu> {
  console.log(
    dd(`
      Select Entity Type:
        1) Servant
        2) Craft Essence
        3) Item
        4) Custom Item
        5) Command Code
        6) Mystic Code
    `)
  );
  const input = await readlinePrompt("Option (1-6)");
  switch (input) {
    case "1":
      return Menu.SERVANT;
    case "2":
      return Menu.CRAFT_ESSENCE;
    case "3":
      return Menu.ITEM;
    case "4":
      return Menu.ITEM_CUSTOM;
    case "5":
      return Menu.COMMAND_CODE;
    case "6":
      return Menu.MYSTIC_CODE;
    default:
      return false;
  }
}

const menuFindServant: MenuFn = (() => {
  let cache: Servant[];
  let searcher: Searcher<Servant, SearcherOpts<Servant>>;

  return async function menuFindServant() {
    cache ??= await atlasCacheJP.getNiceServant();
    searcher ??= new Searcher(cache, {
      keySelector: candidate => candidate.name,
      returnMatchData: true,
      threshold: 0.7
    });

    const input = await readlinePrompt("Search Servant by Name");
    if (!input) return false;

    const results = searcher.search(input);
    for (const result of results) {
      const name = prettyprintMatch(result);
      console.log(
        `  - [${result.item.id}]: ${name} (${result.item.rarity}* ${result.item.className})`
      );
    }

    console.log();
    return true;
  };
})();

const menuFindCraftEssence: MenuFn = (() => {
  let cache: CraftEssenceBasic[];
  let searcher: Searcher<CraftEssenceBasic, SearcherOpts<CraftEssenceBasic>>;

  return async function menuFindCraftEssence() {
    cache ??= await atlasCacheJP.getBasicCE();
    searcher = new Searcher(cache, {
      keySelector: candidate => candidate.name,
      returnMatchData: true,
      threshold: 0.75
    });

    const input = await readlinePrompt("Search CE by Name");
    if (!input) return false;

    const results = searcher.search(input);
    for (const result of results) {
      const name = prettyprintMatch(result);
      console.log(`  - [${result.item.id}]: ${name}`);
    }

    console.log();
    return true;
  };
})();

const menuFindItem: MenuFn = (() => {
  let cache: Item[];
  let searcher: Searcher<Item, SearcherOpts<Item>>;

  return async function menuFindItem() {
    cache ??= await atlasCacheJP.getNiceItem();
    searcher ??= new Searcher(cache, {
      keySelector: candidate => candidate.name,
      returnMatchData: true,
      threshold: 0.75
    });

    const input = await readlinePrompt("Search Item by Name");
    if (!input) return false;

    const results = searcher.search(input);
    for (const result of results) {
      const name = prettyprintMatch(result);
      console.log(`  - [${result.item.id}]: ${name}`);
    }

    console.log();
    return true;
  };
})();

const menuFindCustomItem: MenuFn = (() => {
  let cache: Array<BundledItem & { id: number }>;
  let searcher: Searcher<
    (typeof cache)[number],
    SearcherOpts<(typeof cache)[number]>
  >;

  async function getCache() {
    const map = await getCustomItems();
    const entries = Object.entries(map) as [
      `${number}`,
      NonNullable<(typeof map)[number]>
    ][];
    const list = entries.map(([id, vals]) => ({ ...vals, id: +id }));
    return list;
  }

  return async function menuFindCustomItem() {
    cache ??= await getCache();
    searcher ??= new Searcher(cache, {
      keySelector: candidate => candidate.name,
      returnMatchData: true,
      threshold: 0.85
    });

    const input = await readlinePrompt("Search Custom Item by Name");
    if (!input) return false;

    const results = searcher.search(input);
    for (const result of results) {
      const name = prettyprintMatch(result);
      console.log(`  - [${result.item.id}]: ${name}`);
    }

    console.log();
    return true;
  };
})();

const menuFindCommandCode: MenuFn = (() => {
  let cache: CommandCodeBasic[];
  let searcher: Searcher<CommandCodeBasic, SearcherOpts<CommandCodeBasic>>;

  return async function menuFindCommandCode() {
    cache ??= await atlasCacheJP.getCommandCodes();
    searcher ??= new Searcher(cache, {
      keySelector: candidate => candidate.name,
      returnMatchData: true,
      threshold: 0.75
    });

    const input = await readlinePrompt("Search CC by Name");
    if (!input) return false;

    const results = searcher.search(input);
    for (const result of results) {
      const name = prettyprintMatch(result);
      console.log(`  - [${result.item.id}]: ${name} (${result.item.rarity})`);
    }

    console.log();
    return true;
  };
})();

const menuFindMysticCode: MenuFn = (() => {
  let cache: MysticCodeBasic[];
  let searcher: Searcher<MysticCodeBasic, SearcherOpts<MysticCodeBasic>>;

  return async function menuFindMysticCode() {
    cache ??= await atlasCacheJP.getMysticCodes();
    searcher ??= new Searcher(cache, {
      keySelector: candidate => candidate.name,
      returnMatchData: true,
      threshold: 0.85
    });

    const input = await readlinePrompt("Search Mystic Code by Name");
    if (!input) return false;

    const results = searcher.search(input);
    for (const result of results) {
      const name = prettyprintMatch(result);
      console.log(`  - [${result.item.id}]: ${name}`);
    }

    console.log();
    return true;
  };
})();

async function main() {
  let menu: Menu | false = Menu.SELECT;
  let res = true;

  while (menu) {
    switch (menu) {
      case Menu.SELECT: {
        menu = await menuSelectMenu();
        res = true; // set res true to prevent menu from being set again
        break;
      }
      // the following cases are all menus. res should be set false to continue to Menu.SELECT
      case Menu.SERVANT: {
        res = await menuFindServant();
        break;
      }
      case Menu.CRAFT_ESSENCE: {
        res = await menuFindCraftEssence();
        break;
      }
      case Menu.ITEM: {
        res = await menuFindItem();
        break;
      }
      case Menu.ITEM_CUSTOM: {
        res = await menuFindCustomItem();
        break;
      }
      case Menu.COMMAND_CODE: {
        res = await menuFindCommandCode();
        break;
      }
      case Menu.MYSTIC_CODE: {
        res = await menuFindMysticCode();
        break;
      }
      // in case of an invalid valid print error and quit
      default: {
        Log.error("Unknown menu selected");
        return false;
      }
    }

    // if res is false return to select menu
    if (!res) menu = Menu.SELECT;
  }
}

(async () => {
  let status: 0 | 1 = 0;
  try {
    await prepareCache();
    const res: any = await main();
    if (res === false) status = 1;
    if (res instanceof Error) {
      Log.error(res);
      status = 1;
    }
  } catch (e) {
    Log.error(e);
    status = 1;
  } finally {
    rl.close();
    process.exit(status);
  }
})();
