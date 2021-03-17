import { IndexedFormula, NamedNode, st, Statement, sym } from 'rdflib';

export function relatedStatements(
  store: IndexedFormula,
  pageUrl: NamedNode,
  targetDocument: NamedNode
): Statement[] {
  const statements = store
    .statementsMatching(null, null, null, pageUrl)
    .map((it: Statement) => {
      return st(it.subject, it.predicate, it.object, targetDocument);
    });
  if (statements.length === 0) {
    return [];
  }
  return [
    st(
      pageUrl,
      sym('http://schema.org/about'),
      statements[0].subject,
      targetDocument
    ),
    ...statements,
  ];
}
