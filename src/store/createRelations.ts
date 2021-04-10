import {
  IndexedFormula,
  isBlankNode,
  NamedNode,
  st,
  Statement,
  sym,
} from 'rdflib';
import { BlankNode } from 'rdflib/lib/tf-types';
import { createAboutStatements } from './createAboutStatements';

export function createRelations(
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
      const types = store.anyValue(
        it.subject,
        sym('http://www.w3.org/1999/02/22-rdf-syntax-ns#type')
      );

      if (!types && it.subject.value !== pageUrl.value) return null;

      const subject = isBlankNode(it.subject)
        ? nodeNameFor(it.subject)
        : it.subject;

      const object = isBlankNode(it.object)
        ? nodeNameFor(it.object)
        : it.object;

      return st(subject, it.predicate, object, targetDocument);
    })
    .filter((it) => it !== null);
}
