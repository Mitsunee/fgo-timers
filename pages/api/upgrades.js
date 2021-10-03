import { sanitize } from "modern-diacritics";
import { matchClassName } from "@utils/matchClassName";

import upgradesData from "../../assets/data/upgrades/upgrades.json";

// prepare data
const dataAsc = upgradesData.sort(
  ({ quest: { open: a } }, { quest: { open: b } }) => a - b
);
const dataDesc = [...dataAsc].reverse(); // needs spread as reverse happens in-place!

// WIP
// TODO: na-only filter
export default async function upgrades(req, res) {
  const {
    page = 0,
    perPage = 25,
    search = "",
    className = "",
    quest = "",
    type = "",
    sortDesc = false
  } = req.query;

  let returnDataSet = (sortDesc ? dataDesc : dataAsc).filter(
    ({ servant, quest: _quest, type: _type }) => {
      // apply search
      if (search && !sanitize(servant.name).includes(sanitize(search))) {
        return false;
      }

      // apply className filter
      if (
        className &&
        !matchClassName(servant.className, className.split(","))
      ) {
        return false;
      }

      // apply quest filter
      if (quest && _quest.type !== quest) return false;

      // apply type filter
      if (type && _type !== type) return false;

      return true;
    }
  );

  const total = returnDataSet.length;
  const pages = Math.ceil(total / perPage);

  const start = Math.min(page * perPage, total - 25);
  const end = Math.min(start + perPage, total);

  res.status(200).json({
    data: returnDataSet.slice(start, end),
    total,
    pages,
    last: page >= pages
  });
}
