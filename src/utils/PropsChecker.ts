import { Log } from "./log";

type Hook = (args: { prop: string; value: any; parent: string }) => boolean;
type Props = [string, string | Hook][];

export class PropsChecker<T extends { [key: string]: any }> {
  private requiredProps: Props = new Array();
  private optionalProps: Props = new Array();
  lastParent?: string;

  private checkProp(
    prop: string,
    value: any,
    expectedType: string | Hook,
    parent: string
  ): boolean {
    if (typeof expectedType == "function") {
      return expectedType({ value, prop, parent });
    }

    return typeof value == expectedType;
  }

  private logError(prop: string, expectedType: string | Hook, parent: string) {
    if (typeof expectedType == "function") return;
    Log.error(
      `Expected property '${prop}' of type '${expectedType}' ${Log.styleParent(
        parent
      )}`
    );
  }

  private checkRequired(data: Partial<T>, parent: string): boolean {
    for (const [prop, expectedType] of this.requiredProps) {
      if (!this.checkProp(prop, data[prop], expectedType, parent)) {
        this.logError(prop, expectedType, parent);
        return false;
      }
    }
    return true;
  }

  private checkOptional(data: Partial<T>, parent: string): boolean {
    for (const [prop, expectedType] of this.optionalProps) {
      if (typeof data[prop] == "undefined") continue;
      if (!this.checkProp(prop, data[prop], expectedType, parent)) {
        this.logError(prop, expectedType, parent);
        return false;
      }
    }
    return true;
  }

  public check(data: Partial<T>, parent: string): data is T {
    this.lastParent = parent;
    return this.checkRequired(data, parent) && this.checkOptional(data, parent);
  }

  public addRequiredProp(key: string, expectedType: string | Hook) {
    this.requiredProps.push([key, expectedType]);
    return this;
  }

  public addOptionalProp(key: string, expectedType: string | Hook) {
    this.optionalProps.push([key, expectedType]);
    return this;
  }
}
