import fetch from "node-fetch";

import { die } from "./die.mjs";

export async function fetchData(url, defaultValue) {
  const _fetch = async (url, defaultValue) => {
    try {
      const res = await fetch(url, { cache: "no-cache" });
      if (!res.ok) {
        if (defaultValue === undefined) {
          die(`error while fetching '${url}'`);
        }

        return defaultValue;
      }
      return await res.json();
    } catch (e) {
      if (defaultValue === undefined) {
        die(`received invalid data from '${url}'`);
      }

      return defaultValue;
    }
  };

  let res;
  if (url instanceof Array) {
    res = await Promise.all(
      url.map(async item => await _fetch(item, defaultValue))
    );
  } else {
    res = await _fetch(url, defaultValue);
  }

  return res;
}
