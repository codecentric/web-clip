import rdfDereferencer from 'rdf-dereference';
import {
  blankNode,
  IndexedFormula,
  isBlankNode,
  isLiteral,
  isNamedNode,
  lit,
  namedNode,
  sym,
} from 'rdflib';

export async function importToStore(url: string, store: IndexedFormula) {
  const { data } = await rdfDereferencer.dereference(url);
  await new Promise((resolve, reject) => {
    data
      .on('data', (quad) => {
        // workarounds for incompatibility between rdflib.js and RDF/JS regarding toCanonical and toNT
        if (quad.object.datatype) {
          quad.object.datatype = sym(quad.object.datatype.value);
        }
        const subject = makeCompatibleToRdflib(quad.subject);
        const predicate = makeCompatibleToRdflib(quad.predicate);
        const object = makeCompatibleToRdflib(quad.object);
        store.add(subject, predicate, object, sym(url));
      })
      .on('error', (error) => reject(error))
      .on('end', resolve);
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function makeCompatibleToRdflib(term: any) {
  return isNamedNode(term)
    ? namedNode(term.value)
    : isLiteral(term)
    ? lit(term.value, term.language, term.datatype)
    : isBlankNode(term)
    ? blankNode(term.value)
    : term;
}
