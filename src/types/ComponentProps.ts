import type { Class } from "classcat";
import type { ComponentProps, JSXElementConstructor } from "react";

export type ComponentPropsCC<
  T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>
> = Omit<ComponentProps<T>, "className"> & { className?: Class };
