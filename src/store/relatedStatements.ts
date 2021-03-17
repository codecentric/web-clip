import {
  IndexedFormula,
  isBlankNode,
  NamedNode,
  st,
  Statement,
  sym,
} from 'rdflib';

export function relatedStatements(
  store: IndexedFormula,
  pageUrl: NamedNode,
  targetDocument: NamedNode
): Statement[] {
  const related = mapPageStatementsToTargetDocument(
    store,
    pageUrl,
    targetDocument
  );

  const about = createAboutStatements(pageUrl, related, targetDocument);
  return [...about, ...related];
}

function mapPageStatementsToTargetDocument(
  store: IndexedFormula,
  pageUrl: NamedNode,
  targetDocument: NamedNode
) {
  let count = 1;
  return store
    .statementsMatching(null, null, null, pageUrl)
    .map((it: Statement) => {
      if (isBlankNode(it.subject)) {
        return st(
          sym(targetDocument.uri + '#' + count++),
          it.predicate,
          it.object,
          targetDocument
        );
      }
      return st(it.subject, it.predicate, it.object, targetDocument);
    });
}

function createAboutStatements(
  pageUrl: NamedNode,
  statements: Statement[],
  targetDocument: NamedNode
) {
  const uniqueSubjects = findUniqueSubjects(statements);
  return uniqueSubjects.map((it) =>
    st(pageUrl, sym('http://schema.org/about'), it, targetDocument)
  );
}

function findUniqueSubjects(statements: Statement[]) {
  return Array.from(new Set(statements.map((it) => it.subject)));
}
