import type { Class } from "classcat";

export type CC = { className?: Class };

export type ComponentPropsCC<
  T extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>
> = Omit<React.ComponentProps<T>, "className"> & CC;

export type ComponentWithRefCC<
  T extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>
> = Omit<React.ComponentPropsWithRef<T>, "className"> & CC;

export type RequiredChildren = Exclude<
  React.PropsWithChildren["children"],
  undefined | boolean | null
>;
