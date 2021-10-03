import { createStore, getValue } from "nanostores";

let abortController;

export const upgradesPageStore = createStore(() => {
  setVal(
    {
      page: 0,
      search: "",
      classFilters: [],
      type: "",
      target: "",
      isDescOrder: false,
      na: null,
      data: {},
      pending: true
    },
    false
  );

  return () => {
    abortController?.signal?.aborted === false && abortController.abort();
  };
});

function setVal(value, spread = true) {
  // get new store value
  const oldValue = getValue(upgradesPageStore);
  const newValue = spread // false only used by initial setter
    ? {
        ...oldValue,
        ...value,
        pending: true
      }
    : { ...value, pending: true };

  // set value
  upgradesPageStore.set(newValue);

  // schedule update
  scheduleUpdate(newValue, oldValue.search === newValue.search ? 1000 : 5000);
}

function buildQueryBody(value) {
  const query = {};
  if (value.page > 0) query.page = value.page;
  if (value.search) query.search = value.search;
  if (value.classFilters.length > 0) {
    query.className = value.classFilters.join(",");
  }
  if (value.type) query.type = value.type;
  if (value.target) query.target = value.target;
  if (value.isDescOrder) query.sortDesc = true;
  if (value.na !== null) query.na = value.na;
  return JSON.stringify(query);
}

function scheduleUpdate(value, time) {
  // destroy and replace previous AbortController
  if (abortController?.signal?.aborted === false) abortController.abort();
  const controllerMemo = new AbortController();
  abortController = controllerMemo; // save in global

  // build fetch request options
  const options = {
    method: "post",
    signal: controllerMemo.signal,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: buildQueryBody(value)
  };

  // schedule fetch request
  setTimeout(() => {
    // send request
    fetch("/api/upgrades", options)
      .catch(() => console.log("request aborted"))
      .then(res => res.ok && res.json())
      .then(data => {
        upgradesPageStore.set({ ...value, pending: false, data });
      });
  }, time);
}

/* TODO: setters for:
 *
 * page: 0,
 * search: "",
 * classFilters: [],
 * type: "",
 * target: "",
 * isDescOrder: false,
 * na: null,
 *
 */
