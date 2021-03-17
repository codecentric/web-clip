import rdfDereferencer from 'rdf-dereference';
import {
  IndexedFormula,
  isLiteral,
  isNamedNode,
  lit,
  namedNode,
  sym,
} from 'rdflib';

/**
 * Import all data found at the given url to the provided store
 * @param url - The url to fetch and extract data from
 * @param store - The store to add the data to
 */
export async function importToStore(url: string, store: IndexedFormula) {
  const { quads } = await rdfDereferencer.dereference(url);
  await new Promise((resolve, reject) => {
    quads
      .on('data', (quad) => {
        // workarounds for incompatibility between rdflib.js and RDF/JS regarding toCanonical and toNT
        if (quad.object.datatype) {
          quad.object.datatype = sym(quad.object.datatype.value);
        }
        const subject = isNamedNode(quad.subject)
          ? namedNode(quad.subject.value)
          : quad.subject;
        const predicate = isNamedNode(quad.predicate)
          ? namedNode(quad.predicate.value)
          : quad.predicate;
        const object = isNamedNode(quad.object)
          ? namedNode(quad.object.value)
          : isLiteral(quad.object)
          ? lit(quad.object.value, quad.object.lang, quad.object.datatype)
          : quad.object;
        store.add(subject, predicate, object, sym(url));
      })
      .on('error', (error) => reject(error))
      .on('end', resolve);
  });
}
