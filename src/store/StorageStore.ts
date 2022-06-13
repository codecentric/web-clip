import * as rdf from 'rdflib';
import { IndexedFormula, NamedNode, sym } from 'rdflib';
import solidNamespace from 'solid-namespace';
import { Storage } from '../domain/Storage';

export class StorageStore {
  private store: IndexedFormula;
  private ns: Record<string, (alias: string) => NamedNode>;

  constructor(store: IndexedFormula) {
    this.store = store;
    this.ns = solidNamespace(rdf);
  }

  /**
   * Returns any storage linked from the given WebID, or null if none can be found.
   * @param webId
   */
  getStorageForWebId(webId: string): Storage | null {
    const storage = this.store.any(sym(webId), this.ns.space('storage'));
    if (storage) {
      return new Storage(storage.value);
    }
    return null;
  }
}
