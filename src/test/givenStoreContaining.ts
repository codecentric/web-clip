import { graph, parse, Store as RdflibStore } from 'rdflib';

export function givenStoreContaining(base: string, turtle: string): MockStore {
  const store = graph() as MockStore;
  parse(turtle, store, base);
  store.and = (base: string, turtle: string) => {
    parse(turtle, store, base);
    return store;
  };
  return store;
}

export interface MockStore extends RdflibStore {
  and: (base: string, turtle: string) => MockStore;
}
