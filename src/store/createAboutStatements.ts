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
  const topLevelSubjects = findTopLevelSubject(pageUrl, statements);
  return topLevelSubjects.map((it) =>
    st(pageUrl, sym('http://schema.org/about'), it, targetDocument)
  );
}

function findTopLevelSubject(pageUrl: NamedNode, statements: Statement[]) {
  const uniqueSubjects = findUniqueThings(pageUrl, statements);
  const referencedThings = findThingsReferencedByOthers(statements);
  return uniqueSubjects.filter(
    (subject) => !referencedThings.includes(subject)
  );
}

function findUniqueThings(pageUrl: NamedNode, statements: Statement[]) {
  return Array.from(new Set(statements.map((it) => it.subject))).filter(
    (it) => !isSameThing(it, pageUrl)
  );
}

function findThingsReferencedByOthers(statements: Statement[]) {
  return Array.from(new Set(statements.map((it) => it.object)));
}
