export function parseMissionDetail(detail) {
  if (!/\[.*\]/.test(detail)) return detail; // return as string if no tokens found

  let result = new Array();
  let tmp = "";

  for (let i = 0; i < detail.length; i++) {
    const currentChar = detail[i];
    let isAtStart = result.length === 0;

    // check if start of a token
    if (currentChar === "[" && detail.slice(i + 1).includes("]")) {
      // push current string in tmp
      if (tmp) {
        result.push(tmp);
        tmp = "";
        isAtStart = false;
      }

      // check if start of a color token
      if (/^\[[a-fA-F0-9]{6}\]/.test(detail.slice(i))) {
        const color = detail.slice(i + 1, i + 7);
        let text;
        const end = detail.slice(i + 8).indexOf("[-]");

        // if no end tag just color the rest of the detail
        if (end < 0) {
          text = detail.slice(i + 8).replace(/\[|\]/g, "");
          i = detail.length;
          result.push({ color, text });
          continue;
        }

        // with end tag find all text inside the color tag
        text = detail.slice(i + 8, i + 8 + end);

        // handle leading name token
        if (isAtStart && text.startsWith("[") && text.slice(1).includes("]")) {
          const nameEnd = text.indexOf("]");
          text = `${text.slice(1, nameEnd)}: ${text.slice(1 + nameEnd).trim()}`;
        }

        text = text.replace(/\[|\]/g, "");
        i += 8 + end + 2;
        result.push({ color, text });
        continue;
      }

      // handle stray clear token
      if (detail.slice(i).startsWith("[-]")) {
        i += 2;
        continue;
      }

      const nameEnd = detail.slice(i).indexOf("]");
      let text = detail.slice(i + 1, i + nameEnd).replace(/\[|\]/g, "");
      if (isAtStart) text += ": ";
      i += nameEnd;
      result.push(text);
      continue;
    }

    // prevent double whitespace after name tag
    if (!tmp && currentChar === " " && result.length > 0) {
      const previousResult = result[result.length - 1];
      const text =
        typeof previousResult === "object"
          ? previousResult.text
          : previousResult;
      if (text.endsWith(" ")) continue;
    }

    // continue as string
    tmp += currentChar;
  }

  // push remaining text
  if (tmp) {
    result.push(tmp);
  }

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
