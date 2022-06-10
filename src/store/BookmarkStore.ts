import * as rdf from 'rdflib';
import { graph, IndexedFormula, NamedNode, Statement } from 'rdflib';
import solidNamespace from 'solid-namespace';
import { createRelations } from './createRelations';
import { importToStore } from './importToStore';

export class BookmarkStore {
  private readonly graph: IndexedFormula;
  private ns: Record<string, (alias: string) => NamedNode>;

  constructor(store?: IndexedFormula) {
    this.graph = store ?? graph();
    this.ns = solidNamespace(rdf);
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

  getIndexedBookmark(bookmarkedObject: NamedNode, index: NamedNode) {
    const matchingSubject = this.graph.any(
      null,
      this.ns.schema('object'),
      bookmarkedObject,
      index
    );
    const isBookmark = this.graph.holds(
      matchingSubject,
      this.ns.rdf('type'),
      this.ns.schema('BookmarkAction'),
      index
    );
    return isBookmark ? matchingSubject : null;
  }
}
