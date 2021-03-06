import * as rdf from 'rdflib';
import { IndexedFormula, NamedNode, st, Statement, sym } from 'rdflib';
import solidNamespace from 'solid-namespace';
import urljoin from 'url-join';
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

  isContainer(containerUrl: string) {
    return this.store.holds(
      sym(containerUrl),
      this.ns.rdf('type'),
      this.ns.ldp('Container')
    );
  }

  isStorage(url: string) {
    return this.store.holds(
      sym(url),
      this.ns.rdf('type'),
      this.ns.space('Storage')
    );
  }

  createIndexDocumentStatement(containerUrl: string): Statement[] {
    const index = sym(urljoin(containerUrl, 'index.ttl'));
    return [st(index, this.ns.rdf('type'), this.ns.ldp('Resource'), index)];
  }
}
