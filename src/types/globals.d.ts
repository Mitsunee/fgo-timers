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
 * Picks keys that are common (and same of the type) between A and B.
 * Usually used for HTML Properties of components that can result in one of
 * multiple types (such as a Button that is either `<a>` or `<button>`)
 */
// prettier-ignore
type Common<A, B> = Pick<A, {
  [K in keyof A & keyof B]: 
    A[K] extends B[K]
      ? B[K] extends A[K] ? K : never
      : never;
}[keyof A & keyof B]>;

/**
 * Finds keys that are shared between `A` and `B`
 */
type SharedKeys<A extends {}, B extends {}> = Extract<keyof A, keyof B>;

/**
 * Finds keys that are not shared between `A` and `B`
 */
type NotSharedKeys<A extends {}, B extends {}> =
  | Exclude<keyof A, keyof B>
  | Exclude<keyof B, keyof A>;

/**
 * Prettyprint complex mapped types
 */
type Pretty<T> = { [K in keyof T]: T[K] };

/**
 * Utility for Merge and PartialMerge. Gets all keys of `A` and `B` that include
 * `undefined` in both. These keys are assumed to be optional.
 */
type SharedOptionalKeys<A extends {}, B extends {}> = SharedKeys<
  Pick<A, { [K in keyof A]-?: undefined extends A[K] ? K : never }[keyof A]>,
  Pick<B, { [K in keyof B]-?: undefined extends B[K] ? K : never }[keyof B]>
>;

/**
 * Merges two object types such that all values are required, unless optional
 * and not shared
 */
// prettier-ignore
type Merge<A extends {}, B extends {}> = Pretty<{
  // for all keys Shared between both types, except the keys that are optional
  // on both set the union of its values with `undefined` excluded
  [K in Exclude<SharedKeys<A, B>, SharedOptionalKeys<A, B>>]: 
    Exclude<A[K] | B[K], undefined>;
} & {
  // for all keys where both values are optional set optional union of values
  [K in SharedOptionalKeys<A, B>]?: A[K] | B[K];
} // Pick the keys that are not shared between the two types
  & Pick<A, Exclude<keyof A, keyof B>> 
  & Pick<B, Exclude<keyof B, keyof A>>
>;

/**
 * Merges two object types where all shared values are required, not shared
 * values are optional, values optional on both remain optional
 */
// prettier-ignore
type PartialMerge<A extends {}, B extends {}> = Pretty<{
  // for all keys Shared between both types, except the keys that are optional
  // on both set the union of its values with `undefined` excluded
  [K in Exclude<SharedKeys<A, B>, SharedOptionalKeys<A, B>>]: 
    Exclude<A[K] | B[K], undefined>;
} & {
  // for all keys where both values are optional set optional union of values
  [K in SharedOptionalKeys<A, B>]?: A[K] | B[K];
} & {
  // for all keys not shared between the two types set optional value picked
  // from the type that has the key
  [K in NotSharedKeys<A, B>]?: 
    K extends keyof A ? A[K]: K extends keyof B ? B[K] : never;
}>;
