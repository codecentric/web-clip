import nock from 'nock';
import {
  BlankNode,
  NamedNode,
  graph,
  isBlankNode,
  sym,
  isNamedNode,
  Literal,
} from 'rdflib';
import { importToStore } from './importToStore';

describe('importToStore', () => {
  it('imports json-ld blank node', async () => {
    const store = graph();
    nock('https://shop.example').get('/product/0816.html').reply(
      200,
      `
                <!doctype html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport"
                          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
                    <meta http-equiv="X-UA-Compatible" content="ie=edge">
                    <title>Shop Example - WiFi cable - Product page</title>
                    <script type="application/ld+json">
                    {
                      "@context": "https://schema.org/",
                      "@type": "Product",
                      "name": "WiFi cable",
                      "description": "Increase your WiFi range with this 10m thin-air cable",
                    }
                    
                    </script>
                </head>
                <body>
                </body>
                </html>
            `,
      {
        'Content-Type': 'text/html',
      }
    );
    await importToStore('https://shop.example/product/0816.html', store);

    // then 3 statements from this document can be found
    const document = sym('https://shop.example/product/0816.html');
    const statements = store.statementsMatching(null, null, null, document);
    expect(statements.length).toBe(3);

    // and the product can be found as a blank node
    const product: BlankNode = store.any(
      null,
      sym('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
      sym('http://schema.org/Product')
    ) as BlankNode;
    expect(isBlankNode(product)).toBe(true);

    // and the product has the correct name and description
    const name = store.anyValue(product, sym('http://schema.org/name'));
    expect(name).toBe('WiFi cable');
    const description = store.anyValue(
      product,
      sym('http://schema.org/description')
    );
    expect(description).toBe(
      'Increase your WiFi range with this 10m thin-air cable'
    );
  });

  it('imports json-ld named node', async () => {
    const store = graph();
    nock('https://shop.example').get('/product/0816.html').reply(
      200,
      `
                <!doctype html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport"
                          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
                    <meta http-equiv="X-UA-Compatible" content="ie=edge">
                    <title>Shop Example - WiFi cable - Product page</title>
                    <script type="application/ld+json">
                    {
                      "@context": "https://schema.org/",
                      "@id": "#123",
                      "@type": "Product",
                      "name": "WiFi cable",
                      "description": "Increase your WiFi range with this 10m thin-air cable",
                    }
                    
                    </script>
                </head>
                <body>
                </body>
                </html>
            `,
      {
        'Content-Type': 'text/html',
      }
    );
    await importToStore('https://shop.example/product/0816.html', store);

    // then 3 statements from this document can be found
    const document = sym('https://shop.example/product/0816.html');
    const statements = store.statementsMatching(null, null, null, document);
    expect(statements.length).toBe(3);

    // and the product can be found as a blank node
    const product: NamedNode = store.any(
      null,
      sym('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
      sym('http://schema.org/Product')
    ) as NamedNode;
    expect(isNamedNode(product)).toBe(true);
    expect(product.uri).toBe('https://shop.example/product/0816.html#123');

    // and the product has the correct name and description
    const name = store.anyValue(product, sym('http://schema.org/name'));
    expect(name).toBe('WiFi cable');
    const description = store.anyValue(
      product,
      sym('http://schema.org/description')
    );
    expect(description).toBe(
      'Increase your WiFi range with this 10m thin-air cable'
    );
  });

  it('can import data types other then string', async () => {
    const store = graph();
    nock('https://shop.example').get('/product/0816.html').reply(
      200,
      `
                <!doctype html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport"
                          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
                    <meta http-equiv="X-UA-Compatible" content="ie=edge">
                    <title>Shop Example - WiFi cable - Product page</title>
                    <script type="application/ld+json">
                    {
                      "@context": "https://schema.org/",
                      "@type": "Thing",
                      "value": 42,
                      "startDate": {
                        "@type": "http://schema.org/DateTime",
                        "@value": "2011-04-09T20:00:00Z"
                      }
                    }
                    </script>
                </head>
                <body>
                </body>
                </html>
            `,
      {
        'Content-Type': 'text/html',
      }
    );
    await importToStore('https://shop.example/product/0816.html', store);

    // then 3 statements from this document can be found
    const document = sym('https://shop.example/product/0816.html');
    const statements = store.statementsMatching(null, null, null, document);
    expect(statements.length).toBe(3);

    // and the thing can be found as a blank node
    const thing: BlankNode = store.any(
      null,
      sym('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
      sym('http://schema.org/Thing')
    ) as BlankNode;
    expect(isBlankNode(thing)).toBe(true);

    // and the thing has the correct value and startDate
    const value: Literal = store.any(
      thing,
      sym('http://schema.org/value')
    ) as Literal;
    expect(value.value).toBe('42');
    expect(value.datatype).toEqual(
      sym('http://www.w3.org/2001/XMLSchema#integer')
    );
    const startDate: Literal = store.any(
      thing,
      sym('http://schema.org/startDate')
    ) as Literal;
    expect(startDate.value).toBe('2011-04-09T20:00:00Z');
    expect(startDate.datatype).toEqual(sym('http://schema.org/DateTime'));
  });

  it('all nodes have toNT and toCanonical methods', async () => {
    const store = graph();
    nock('https://shop.example').get('/product/0816.html').reply(
      200,
      `
                <!doctype html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport"
                          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
                    <meta http-equiv="X-UA-Compatible" content="ie=edge">
                    <title>Shop Example - WiFi cable - Product page</title>
                    <script type="application/ld+json">
                    {
                      "@context": "http://schema.org",
                      "@type": "WebSite",
                      "name": "BestShop",
                      "url": "https://shop.example",
                      "publisher": {
                        "@type": "Organization",
                        "name": "BestShop"
                      }
                    }
                    </script>
                </head>
                <body>
                </body>
                </html>
            `,
      {
        'Content-Type': 'text/html',
      }
    );
    await importToStore('https://shop.example/product/0816.html', store);

    const document = sym('https://shop.example/product/0816.html');
    const statements = store.statementsMatching(null, null, null, document);
    expect(statements.length).toBe(6);

    statements.forEach((it) => {
      expect(it.subject.toNT).toBeDefined();
      expect(it.object.toNT).toBeDefined();
      expect(it.predicate.toNT).toBeDefined();
      expect(it.subject.toCanonical).toBeDefined();
      expect(it.object.toCanonical).toBeDefined();
      expect(it.predicate.toCanonical).toBeDefined();
    });
  });
});
