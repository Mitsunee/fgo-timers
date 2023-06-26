/**
 * Currently supported game regions
 */
type SupportedRegion = "NA" | "JP";

/**
 * Record that matches an id to data of type T
 */
type DataMap<T> = Record<number, T>;

/**
 * Partial Record that matches an id to data of type T
 */
type PartialDataMap<T> = Partial<Record<number, T>>;

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

/**
 * Modify type to where selected keys are required
 */
type NonNullableKey<T, Keys extends keyof T> = Omit<T, Keys> &
  Required<Pick<T, Keys>>;

/**
 * Specifies function parameter that's either a boolean or a callback that gets passed a boolean and must return a boolean
 */
type BooleanOrFn = boolean | ((state: boolean) => boolean);

/**
 * Picks keys that are common (and same of the type) between A and B
 */
type Common<A, B> = Pick<
  A,
  {
    [K in keyof A & keyof B]: A[K] extends B[K]
      ? B[K] extends A[K]
        ? K
        : never
      : never;
  }[keyof A & keyof B]
>;
