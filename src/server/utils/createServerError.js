/* createServerError
 * Creates Error with message and optional parent
 */

export function createServerError(message, parent = null) {
  return new Error(`${message}${parent ? ` in '${parent}'` : ""}`);
}
