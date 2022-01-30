/* parseMasterMission
 * Parses Set of Master Missions
 */

function parseMissionDetail(detail) {
  // /^\[|\]$/g matches square brackets wrapping the entire string
  // ^\[[a-f0-9]{6}\] matches color tags used in game data

  // it is assumed that the string starts with an optional color tag and maybe
  // contains a format clear tag [-]. It is easier to split on format clear tags
  // either way no matter if a color tag exists

  if (!detail.includes("[-]")) return detail.replace(/^\[|\]$/g, "");

  const [tag, ...texts] = detail.split("[-]"); // not sure if rest operator is needed here
  let tmp;
  if (/^\[[a-f0-9]{6}\]/i.test(tag)) {
    // has color
    const [, color, text] = tag.match(/^\[([a-f0-9]{6})\](.*)/);
    tmp = { color, text: `${text.replace(/^\[|\]$/g, "")}: ` };
  } else {
    tmp = `${tag.replace(/^\[|\]$/g, "")}: `;
  }
  let result = [tmp, ...texts.map(text => text.trim())];

  // if all pieces are strings join result
  if (result.every(piece => typeof piece === "string")) {
    result = result.join("");
  }

  return result;
}

const missionProps = new Set(["id", "detail"]);

function parseMissions(missions) {
  const parsedMissions = new Array();
  const missionsSorted = missions.sort((a, b) => a.dispNo - b.dispNo);

  for (const mission of missionsSorted) {
    const parsedMission = new Object();
    for (const prop of missionProps) {
      if (prop === "detail") {
        parsedMission.detail = parseMissionDetail(mission.detail);
        continue;
      }

      parsedMission[prop] = mission[prop];
    }

    parsedMissions.push(parsedMission);
  }

  return parsedMissions;
}

const dataProps = new Set(["id", "endedAt", "missions"]);

export function parseMasterMission(data) {
  const parsedData = new Object();

  for (const prop of dataProps) {
    switch (prop) {
      case "endedAt":
        parsedData.end = data.endedAt;
        break;
      case "missions":
        parsedData.missions = parseMissions(data.missions);
        parsedData.type = data.missions[0].type;
        break;
      default:
        parsedData[prop] = data[prop];
    }
  }

  return parsedData;
}
