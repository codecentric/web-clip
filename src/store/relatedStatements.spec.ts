import { graph, lit, parse, st, sym } from 'rdflib';
import {
  Quad_Graph,
  Quad_Object,
  Quad_Predicate,
  Quad_Subject,
} from 'rdflib/lib/tf-types';
import { relatedStatements } from './relatedStatements';

describe('relatedStatements', () => {
  it('nothing is found in empty store', () => {
    const store = graph();
    const related = relatedStatements(
      store,
      sym('https://page.example/'),
      sym('https://pod.example/')
    );
    expect(related).toHaveLength(0);
  });
  it('nothing is found for the page in question', () => {
    const store = graph();
    parse(
      `
        <#it> a <http://schema.org/Product> .
        `,
      store,
      'https://other-page.example/'
    );
    const related = relatedStatements(
      store,
      sym('https://page.example/'),
      sym('https://pod.example/')
    );
    expect(related).toHaveLength(0);
  });

  it('all statements from page in question are found and linked via schema:about', () => {
    const store = graph();
    parse(
      `
        <#it> a <http://schema.org/Product> ;
              <http://schema.org/name> "Some product" .
        `,
      store,
      'https://page.example/'
    );
    parse(
      `
        <#it> a <http://schema.org/Hotel> .
        `,
      store,
      'https://other-page.example/'
    );
    const targetDocument = sym('https://pod.example/');
    const related = relatedStatements(
      store,
      sym('https://page.example/'),
      targetDocument
    );
    expect(related).toEqual(
      expect.arrayContaining([
        st(
          sym('https://page.example/'),
          sym('http://schema.org/about'),
          sym('https://page.example/#it'),
          targetDocument
        ),
        st(
          sym('https://page.example/#it'),
          sym('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
          sym('http://schema.org/Product'),
          targetDocument
        ),
        st(
          sym('https://page.example/#it'),
          sym('http://schema.org/name'),
          lit('Some product'),
          targetDocument
        ),
      ])
    );
    expect(related).toHaveLength(3);
  });

  it('find all related nodes in page and relate them via schema:about', () => {
    const store = graph();
    parse(
      `
        <#product> a <http://schema.org/Product> .
        <#hotel> a <http://schema.org/Hotel> .
        `,
      store,
      'https://page.example/'
    );

    const targetDocument = sym('https://pod.example/');
    const related = relatedStatements(
      store,
      sym('https://page.example/'),
      targetDocument
    );
    expect(related).toEqual(
      containingStatement(
        sym('https://page.example/#product'),
        sym('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        sym('http://schema.org/Product'),
        targetDocument
      )
    );
    expect(related).toEqual(
      containingStatement(
        sym('https://page.example/'),
        sym('http://schema.org/about'),
        sym('https://page.example/#product'),
        targetDocument
      )
    );
    expect(related).toEqual(
      containingStatement(
        sym('https://page.example/#hotel'),
        sym('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        sym('http://schema.org/Hotel'),
        targetDocument
      )
    );
    expect(related).toEqual(
      containingStatement(
        sym('https://page.example/'),
        sym('http://schema.org/about'),
        sym('https://page.example/#hotel'),
        targetDocument
      )
    );
    expect(related).toHaveLength(4);
  });

  it('generates a relative uri for every blank node', () => {
    const store = graph();
    parse(
      `
        [] a <http://schema.org/Product> .
        [] a <http://schema.org/Hotel> .
        `,
      store,
      'https://page.example/'
    );
    const targetDocument = sym('https://pod.example/');
    const related = relatedStatements(
      store,
      sym('https://page.example/'),
      targetDocument
    );
    expect(related).toEqual(
      containingStatement(
        sym('https://pod.example/#1'),
        sym('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        sym('http://schema.org/Product'),
        targetDocument
      )
    );
    expect(related).toEqual(
      containingStatement(
        sym('https://page.example/'),
        sym('http://schema.org/about'),
        sym('https://pod.example/#1'),
        targetDocument
      )
    );
    expect(related).toEqual(
      containingStatement(
        sym('https://pod.example/#2'),
        sym('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        sym('http://schema.org/Hotel'),
        targetDocument
      )
    );
    expect(related).toEqual(
      containingStatement(
        sym('https://page.example/'),
        sym('http://schema.org/about'),
        sym('https://pod.example/#2'),
        targetDocument
      )
    );
    expect(related).toHaveLength(4);
  });
});

function containingStatement(
  s: Quad_Subject,
  p: Quad_Predicate,
  o: Quad_Object,
  g: Quad_Graph
) {
  return expect.arrayContaining([st(s, p, o, g)]);
}
