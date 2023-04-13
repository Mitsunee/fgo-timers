export const enum SpoilerLevels {
  PRERENDER = "ssg",
  STRICT = "strict",
  SOME = "some",
  ALL = "all"
}

export const enum Availability {
  PERMANENT,
  STORYLOCKED,
  LIMITED,
  WELFARE,
  FP_POOL,
  FP_LIMITED,
  FP_LOCKED
}

/**
 * Globally available classNames from app.css
 */
export const enum GlobalStyles {
  BUTTON = "button",
  BUTTON_DECORATED = "button-decorated"
}

export const enum Global {
  UTC_TZ = "etc/utc",
  SERVER_TZ = "America/Los_Angeles"
}

export const enum GlobalNums {
  AP_MIN = 20,
  AP_MAX = 144,
  JP_TO_NA_ESTIMATE = 63133200,
  EXCHANGE_TICKET_DAILY_QUEST_RELEASE = 1722484800,
  SERVER_DAY_LEN = 8640000,
  SERVER_DAY_OFFSET = 3643200,
  SERVER_DAY_ZERO = 1498449600
}
