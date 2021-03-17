import {
  IndexedFormula,
  isBlankNode,
  NamedNode,
  st,
  Statement,
  sym,
} from 'rdflib';
import { BlankNode } from 'rdflib/lib/tf-types';

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
  const ids: { [key: string]: NamedNode } = {};

  function nodeNameFor(blankNode: BlankNode) {
    const value = blankNode.value;
    if (!ids[value]) {
      ids[value] = sym(targetDocument.uri + '#' + count++);
    }
    return ids[value];
  }

  return store
    .statementsMatching(null, null, null, pageUrl)
    .map((it: Statement) => {
      if (isBlankNode(it.subject)) {
        return st(
          nodeNameFor(it.subject),
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
