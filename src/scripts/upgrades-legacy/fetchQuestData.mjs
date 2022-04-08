import { fetchData } from "./fetchData.mjs";
import { ATLAS_API } from "./constants.mjs";
import { die } from "./die.mjs";

const questDataMap = new Map(); // data cache

export async function fetchQuestData(id) {
  let tmp;
  if ((tmp = questDataMap.get(id))) return tmp;

  const [questData, questDataNA] = await fetchData(
    [`${ATLAS_API}nice/JP/quest/${id}`, `${ATLAS_API}nice/NA/quest/${id}`],
    false, // needs defaultValue as NA quest may not exist!
    `Fetching quest: ${id}`
  );
  if (!questData) die(`Error while fetching atlas API for quest ${id}`); // but we need JP to exist

  // save to map
  questDataMap.set(id, [questData, questDataNA]);

  return [questData, questDataNA];
}
