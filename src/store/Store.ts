import { graph, IndexedFormula, NamedNode, Statement } from 'rdflib';
import { createRelations } from './createRelations';
import { importToStore } from './importToStore';

export class Store {
  private readonly graph: IndexedFormula;
  constructor(store?: IndexedFormula) {
    this.graph = store ?? graph();
  }

  /**
   * Import all data found at the given url to the store
   * @param url - The url to fetch and extract data from
   */
  public importFromUrl(url: string) {
    return importToStore(url, this.graph);
  }

  /**
   * Copy all statements found in the source document to the target document and
   * create a http://schema.org/about link from source document to every subject found at that source
   * @param sourceDocument
   * @param targetDocument
   */
  public createRelations(
    sourceDocument: NamedNode,
    targetDocument: NamedNode
  ): Statement[] {
    return createRelations(this.graph, sourceDocument, targetDocument);
  }

  /**
   * @deprecated
   */
  getGraph() {
    return this.graph;
  }
}
