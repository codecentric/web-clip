import { graph, lit, parse, st, sym } from 'rdflib';
import { containingStatement } from '../test/expect';
import { createRelations } from './createRelations';

describe('create relations', () => {
  it('nothing is found in empty store', () => {
    const store = graph();
    const related = createRelations(
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
    const related = createRelations(
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
    const related = createRelations(
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

  it('nodes without a rdf or ogp type are not included', () => {
    const store = graph();
    parse(
      `
        [] <http://schema.org/name> "not interesting" .
        `,
      store,
      'https://page.example/'
    );
    const targetDocument = sym('https://pod.example/');
    const related = createRelations(
      store,
      sym('https://page.example/'),
      targetDocument
    );
    expect(related).toHaveLength(0);
  });

  it('nodes with ogp type are included', () => {
    const store = graph();
    parse(
      `
        <#it> <https://ogp.me/ns#type> "article" .
        `,
      store,
      'https://page.example/'
    );
    const targetDocument = sym('https://pod.example/');
    const related = createRelations(
      store,
      sym('https://page.example/'),
      targetDocument
    );
    expect(related).toEqual(
      expect.arrayContaining([
        st(
          sym('https://page.example/#it'),
          sym('https://ogp.me/ns#type'),
          lit('article'),
          targetDocument
        ),
        st(
          sym('https://page.example/'),
          sym('http://schema.org/about'),
          sym('https://page.example/#it'),
          targetDocument
        ),
      ])
    );
    expect(related).toHaveLength(2);
  });

  it('statements about the page are included, even if the page does not have an explicit type', () => {
    const store = graph();
    parse(
      `
        <> <http://schema.org/name> "Page name" .
        `,
      store,
      'https://page.example/'
    );
    const targetDocument = sym('https://pod.example/');
    const related = createRelations(
      store,
      sym('https://page.example/'),
      targetDocument
    );
    expect(related).toEqual(
      expect.arrayContaining([
        st(
          sym('https://page.example/'),
          sym('http://schema.org/name'),
          lit('Page name'),
          targetDocument
        ),
      ])
    );
    expect(related).toHaveLength(1);
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
    const related = createRelations(
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
        [] a <http://schema.org/Product> ;
           <http://schema.org/provider> [
             a <http://schema.org/Organization>
           ] .
        [] a <http://schema.org/Hotel> .
        `,
      store,
      'https://page.example/'
    );
    const targetDocument = sym('https://pod.example/');
    const related = createRelations(
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
        sym('https://pod.example/#1'),
        sym('http://schema.org/provider'),
        sym('https://pod.example/#2'),
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
        sym('http://schema.org/Organization'),
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
    expect(related).toEqual(
      containingStatement(
        sym('https://pod.example/#3'),
        sym('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        sym('http://schema.org/Hotel'),
        targetDocument
      )
    );
    expect(related).toEqual(
      containingStatement(
        sym('https://page.example/'),
        sym('http://schema.org/about'),
        sym('https://pod.example/#3'),
        targetDocument
      )
    );
    expect(related).toHaveLength(7);
  });

  it('only generate one uri per blank node', () => {
    const store = graph();
    parse(
      `
        [] a <http://schema.org/Product> ;
           <http://schema.org/name> "Some Product" .
        `,
      store,
      'https://page.example/'
    );
    const targetDocument = sym('https://pod.example/');
    const related = createRelations(
      store,
      sym('https://page.example/'),
      targetDocument
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
        sym('https://pod.example/#1'),
        sym('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        sym('http://schema.org/Product'),
        targetDocument
      )
    );
    expect(related).toEqual(
      containingStatement(
        sym('https://pod.example/#1'),
        sym('http://schema.org/name'),
        lit('Some Product'),
        targetDocument
      )
    );
    expect(related).toHaveLength(3);
  });
});
