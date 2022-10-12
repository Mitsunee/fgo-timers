import picocolors from "picocolors";
import { typeOf } from "@foxkit/util/typeOf";

type Colour =
  | Exclude<
      keyof ReturnType<typeof picocolors["createColors"]>,
      "isColorSupported"
    >
  | false;
type Prefix = "log" | "debug" | "info" | "warn" | "error" | "ready";
type LogLevel = "log" | "warn" | "error";

function isObject(val: any): val is object {
  return val !== null && typeof val == "object";
}

export class Log {
  private static isSilent: boolean = false;

  private static format(
    prefix: Prefix,
    colour: Colour,
    ...messages: any[]
  ): string {
    const paddedPrefix = prefix.padEnd(5, " ");
    const formattedPrefix = colour
      ? picocolors[colour](paddedPrefix)
      : paddedPrefix;
    const formattedMessage = messages
      .map(message => {
        if (isObject(message)) {
          return `${JSON.stringify(message, null, 2)}`;
        }
        return `${message}`;
      })
      .join("\n");
    return `${formattedPrefix}${
      isObject(messages[0]) ? "\n" : " - "
    }${formattedMessage}`;
  }

  static styleParent(parent: string): string {
    return picocolors.gray(`in '${parent}'`);
  }

  private static console(
    level: LogLevel,
    prefix: Prefix,
    colour: Colour,
    ...messages: any[]
  ) {
    if (this.isSilent) return;
    const message = this.format(prefix, colour, ...messages);
    console[level](message);
  }

  static log(...messages: any[]) {
    this.console("log", "log", false, ...messages);
  }

  static debug(...messages: any[]) {
    this.console("log", "debug", false, ...messages);
  }

  static info(...messages: any[]) {
    this.console("log", "info", "cyan", ...messages);
  }

  static warn(...messages: any[]) {
    this.console("warn", "warn", "yellow", ...messages);
  }

  static error(...messages: any[]) {
    if (messages[0] instanceof Error) {
      this.console(
        "error",
        "error",
        "red",
        messages[0].message,
        ...messages.slice(1)
      );
      return;
    }
    this.console("error", "error", "red", ...messages);
  }

  static ready(...messages: any[]) {
    this.console("log", "ready", "green", ...messages);
  }

  static table(
    data: { [key: string]: any },
    title: string = "",
    prefix: Prefix = "debug",
    colour: Colour = false
  ) {
    const dataFlattened = Object.fromEntries(
      Object.entries(data).map(([key, val]) => {
        if (val !== null && typeof val == "object") {
          return [key, typeOf(val)];
        }
        if (typeof val == "function") return [key, "function"];
        return [key, val];
      })
    );

    if (title) this.console("log", prefix, colour, title);
    console.table(dataFlattened);
  }

  static toggleSilent(state?: boolean) {
    this.isSilent = state ?? !this.isSilent;
  }
}
