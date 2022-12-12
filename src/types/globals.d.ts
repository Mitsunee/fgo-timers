/**
 * Partial Record matches an id to data of type T
 */
type IDMap<T> = Partial<Record<number | `${number}`, T>>;

interface BuildInfo {
  date: number;
  version: string;
}

/**
 * any type that cast safely be casted to string in a template literal
 */
type Stringable = string | number | { toString(): string };

/**
 * Modify type to where selected keys are Partial
 */
type SemiPartial<T, Keys extends keyof T> = Partial<Pick<T, Keys>> &
  Omit<T, Keys>;

/**
 * Modify type to where only selected keys are required, rest are Partial
 */
type SemiRequired<T, Keys extends keyof T> = Partial<Omit<T, Keys>> &
  Pick<T, Keys>;
