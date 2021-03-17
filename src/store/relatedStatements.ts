import { IndexedFormula, NamedNode, st, Statement } from 'rdflib';

export function relatedStatements(
  store: IndexedFormula,
  pageUrl: NamedNode,
  targetDocument: NamedNode
): Statement[] {
  return store
    .statementsMatching(null, null, null, pageUrl)
    .map((it: Statement) => {
      return st(it.subject, it.predicate, it.object, targetDocument);
    });
}
