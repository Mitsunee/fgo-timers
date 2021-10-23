import { cloneElement } from "react";

export function withAddedProps(subject, { props, propsFn, keyFn }) {
  if (subject instanceof Array) {
    // backup key indexer
    let i = 0;
    const nextKey = () => {
      const r = i;
      i++;
      return r;
    };

    // recursively map with key applied
    return subject.map(child =>
      withAddedProps(child, {
        props: {
          ...(props || {}),
          key: keyFn ? keyFn(child) : nextKey()
        },
        propsFn
      })
    );
  }

  // return cloned element with props and propsFn applied
  return cloneElement(subject, {
    ...(props || {}),
    ...(propsFn ? propsFn(subject) : {})
  });
}
