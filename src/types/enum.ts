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
  JP_TO_NA_ESTIMATE = 63133200
}
