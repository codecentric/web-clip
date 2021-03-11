declare module 'solid-namespace' {
  import { NamedNode } from 'rdflib';

  export default function vocab(rdf: {
    namedNode: (term: string) => NamedNode;
  }): Record<string, (alias: string) => NamedNode>;
}
