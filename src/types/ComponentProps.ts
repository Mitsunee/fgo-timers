import type { Class } from "classcat";
import type {
  ComponentProps,
  ComponentPropsWithRef,
  JSXElementConstructor,
  PropsWithChildren
} from "react";

export type CC = { className?: Class };

export type ComponentPropsCC<
  T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>
> = Omit<ComponentProps<T>, "className"> & CC;

export type ComponentWithRefCC<
  T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>
> = Omit<ComponentPropsWithRef<T>, "className"> & CC;

export type RequiredChildren = Exclude<
  PropsWithChildren["children"],
  undefined | boolean | null
>;
