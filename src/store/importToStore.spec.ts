import nock from 'nock';
import { BlankNode, graph, isBlankNode, sym } from 'rdflib';
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
});
