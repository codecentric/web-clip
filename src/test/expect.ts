import { st } from 'rdflib';
import {
  Quad_Graph,
  Quad_Object,
  Quad_Predicate,
  Quad_Subject,
} from 'rdflib/lib/tf-types';

export function containingStatement(
  s: Quad_Subject,
  p: Quad_Predicate,
  o: Quad_Object,
  g: Quad_Graph
) {
  return expect.arrayContaining([st(s, p, o, g)]);
}
