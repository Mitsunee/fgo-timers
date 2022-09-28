//import { readFileJson } from "@foxkit/node-util/fs";

//import { JP_TO_NA_ESTIMATE } from "@utils/globals";

// TODO: Rewrite to use API Route and redis
export async function getStaticProps() {
  const upgradesData = []; //await readFileJson("assets/data/upgrades/upgrades.json");
  console.warn("UpgradesPage rendering empty as legacy data was removed");

  return {
    props: {
      upgradesData /*: upgradesData
        // filter out main quests
        .filter(upgrade => upgrade.target)
        // apply magic number to JP quest to estimate NA release date
        .map(upgrade => {
          if (upgrade.quest.na) return upgrade;
          return {
            ...upgrade,
            quest: {
              ...upgrade.quest,
              open: upgrade.quest.open + JP_TO_NA_ESTIMATE
            }
          };
        })*/
    }
  };
}
