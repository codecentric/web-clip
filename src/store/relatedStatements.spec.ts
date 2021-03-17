import { graph, lit, parse, st, sym } from 'rdflib';
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

  it('all statements from page in question are found', () => {
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
    expect(related).toHaveLength(2);
  });
});
