# Time Formats

There are multiple custom Time formats used in this project

## Dates and Durations

Dates and Durations are based on the format used in official news posts. This allows for simple copypasting of dates when authoring data files.

### Dates

Dates are represented in the following format:

```
YYYY-MM-DD HH:mm (PST|PDT)

Example: 2021-11-17 18:00 PST
```

There are no optional values in this format. Currently only the timezones PST and PDT are supported. The "(GMT-7)" information must be ommitted. Dates are converted to a unix timestamp in seconds during Prebuild. See [zDate](../../src/schema/zDate.ts) and [parseDate](../../src/time/parseDate.ts) for schema and implementation.

### Durations

Similarly to Dates Durations represent a period of time with a start and end date. The following format is used:

```
YYYY-MM-DD HH:mm (PST|PDT)? - YYYY?-MM-DD HH:mm (PST|PDT)

Examples:
2021-11-16 00:00 PST - 2021-11-22 19:59 PST
2021-11-16 00:00 - 11-22 19:59 PST
```

To simplify the format the timezone of the start date and year of the end date may be ommitted. During parsing the ommitted value is taken from the other time in the string (year from start time, timezone from end time). Durations are converted to a Tuple of unix timestamps in seconds during Prebuild. See [zDurationStrict](../../src/schema/zDate.ts) and [parseDuration](../../src/time/parseDate.ts) for schema and implementation.

### Date or Duration

For usecases where both Duration and Date are the [zDuration](../../src/schema/zDate.ts) schema is used. This will result in a union type that can be resolved to a Duration Tuple with [normalizeDate](../../src/time/normalizeDate.ts).

## Delta

Deltas are used in UI to represent the amount of time until a certain event such as the start or end of an Event. [formatDiff](../../src/time/formatDiff.ts) should be used to generate this string based on a Spacetime Diff. Example use in component:

```js
function MyComponent({ targetTime }) {
  const { s } = useCurrentTime();
  const diff = s.diff(spacetime(targetTime));

  return <p>Event in: {formatDiff(diff)}</p>;
}
```
