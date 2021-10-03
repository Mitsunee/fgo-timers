import { sanitize } from "modern-diacritics";
import { matchClassName } from "@utils/matchClassName";

import upgradesData from "../../assets/data/upgrades/upgrades.json";

// prepare data
const dataAsc = upgradesData.sort(
  ({ quest: { open: a } }, { quest: { open: b } }) => a - b
);
const dataDesc = [...dataAsc].reverse(); // needs spread as reverse happens in-place!

export default async function upgrades(req, res) {
  const {
    page = 0,
    perPage = 25,
    search = "",
    className = "",
    type = "",
    target = "",
    na = null,
    sortDesc = false
  } = req.query;

  let returnDataSet = (sortDesc ? dataDesc : dataAsc).filter(upgrade => {
    const { servant } = upgrade;

    // apply quest type filter (interlude, rankup)
    if (type && upgrade.quest.type !== type) return false;

    // apply target filter (np, skill, sq)
    if (target && upgrade.target !== target) return false;

    // apply region filter (null, true, false) based on quest.na (undefined, true)
    if (
      (na === false && upgrade.quest.na) ||
      (na === true && !upgrade.quest.na)
    ) {
      return false;
    }

    // apply className filter
    if (className && !matchClassName(servant.className, className.split(","))) {
      return false;
    }

    // apply servant name search
    if (
      search &&
      !sanitize(servant.name.toLowerCase()).includes(
        sanitize(search.toLowerCase())
      )
    ) {
      return false;
    }

    return true; // passed all filters
  });

  const total = returnDataSet.length;
  const pages = Math.ceil(total / perPage);

  const start = Math.min(page * perPage, total - 25);
  const end = Math.min(start + perPage, total);

  res.status(200).json({
    total,
    pages,
    last: page >= pages,
    data: returnDataSet.slice(start, end)
  });
}
