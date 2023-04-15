import { List } from "@foxkit/util/object";

type NullableNode<T> = ReturnType<List<T>["getNode"]> | null | undefined;
type Callback<T, R = any> = (val: T) => Promise<R>;

export class Semaphore<T, R = any> {
  private callback: Callback<T, R>;
  private size: number;

  constructor(cb: Callback<T>, size: number) {
    this.callback = cb;
    this.size = size;
  }

  setSize(size: number) {
    this.size = size;
  }

  async run(list: List<T> | Array<T> | Set<T>, sizeOverride?: number) {
    const queue = list instanceof List ? list : List.fromArray([...list]);
    const length = sizeOverride ?? this.size;
    const callback = this.callback;
    const start = { next: queue.getNode(0) } as NullableNode<T>;
    let currentNode: NullableNode<T> = start;
    const results = new Array<R>();

    if (length < 1) throw new Error("Size parameter must be at least 1");

    async function runner(): Promise<void> {
      const node = (currentNode = currentNode?.next);
      if (!node) return;
      const result = await callback(node.value);
      results.push(result);
      return runner();
    }

    try {
      await Promise.all(Array.from({ length }, runner));
      return results;
    } catch (e) {
      currentNode = undefined;
      throw e;
    }
  }
}
