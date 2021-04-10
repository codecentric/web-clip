import {
  BlankNode,
  isNamedNode,
  NamedNode,
  st,
  Statement,
  sym,
  Variable,
} from 'rdflib';

function isSameThing(it: BlankNode | NamedNode | Variable, pageUrl: NamedNode) {
  return isNamedNode(it) && it.uri === pageUrl.uri;
}

export function createAboutStatements(
  pageUrl: NamedNode,
  statements: Statement[],
  targetDocument: NamedNode
) {
  const uniqueSubjects = findUniqueSubjects(statements).filter(
    (it) => !isSameThing(it, pageUrl)
  );
  return uniqueSubjects.map((it) =>
    st(pageUrl, sym('http://schema.org/about'), it, targetDocument)
  );
}

function findUniqueSubjects(statements: Statement[]) {
  return Array.from(new Set(statements.map((it) => it.subject)));
}
