const dateRegex =
  /(?<date>\d{4}-\d{2}-\d{2}) (?<time>\d{2}:\d{2}) (?<timezone>P[DS]T)/i;
const dateDurationRegex =
  /(\d{4})-(\d{2}-\d{2}) (\d{2}:\d{2}) (?:(P[DS]T) )?(?:- (?:(\d{4})-)?(\d{2}-\d{2}) (\d{2}:\d{2}) )?(P[DS]T)/i;

export function matchDate(dateString, allowDuration = false) {
  if (allowDuration) {
    const [
      ,
      year,
      date,
      time,
      timezone,
      endYear,
      endDate,
      endTime,
      endTimezone
    ] = dateString.match(dateDurationRegex);

    const startsAt = {
      date: `${year}-${date}`,
      time,
      timezone: timezone ?? endTimezone
    };
    const endsAt = {
      date: `${endYear ?? year}-${endDate}`,
      time: endTime,
      timezone: endTimezone
    };

    return [startsAt, endsAt];
  }

  return dateString.match(dateRegex).groups;
}
