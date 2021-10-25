import { createSpinner } from "nanospinner";
import fetch from "node-fetch";

export async function fetchData(url, defaultValue, message = "Fetching Data") {
  const spinner = createSpinner(message);
  const _fetch = async (url, defaultValue) => {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        if (defaultValue === undefined) {
          spinner.error(`error while fetching '${url}'`);
          process.exit(2);
        }

        return defaultValue;
      }
      return await res.json();
    } catch (e) {
      if (defaultValue === undefined) {
        spinner.error(`received invalid data from '${url}'`);
        process.exit(2);
      }

      return defaultValue;
    }
  };

  let res;
  spinner.start();
  if (url instanceof Array) {
    res = await Promise.all(
      url.map(async item => await _fetch(item, defaultValue))
    );
  } else {
    res = await _fetch(url, defaultValue);
  }
  spinner.success();

  return res;
}
