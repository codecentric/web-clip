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
  const uniqueSubjects = Array.from(
    new Set(statements.map((it) => it.subject))
  );
  const about = uniqueSubjects.map((it) =>
    st(pageUrl, sym('http://schema.org/about'), it, targetDocument)
  );
  return [...about, ...statements];
}
