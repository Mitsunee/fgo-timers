/**
 * Formats day of month as number to string with proper grammar
 * @param day Day of month 1-indexed
 * @returns Formatted day of month as string
 */
export function formatDayOfMonth(day: number) {
  switch (day) {
    case 1:
      return "1st";
    case 2:
      return "2nd";
    case 3:
      return "3rd";
    default:
      return `${day}th`;
  }
}
