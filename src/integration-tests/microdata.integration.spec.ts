import rdfDereferencer from 'rdf-dereference';
import { graph, Store, sym } from 'rdflib';
import nock from 'nock';

describe('extract data from html page', () => {
  let store: Store;
  beforeEach(() => {
    store = graph();
  });

  // TODO: move from test to production code
  async function importToStore(url: string) {
    const { quads } = await rdfDereferencer.dereference(url);
    await new Promise((resolve) => {
      quads
        .on('data', (quad) => {
          if (quad.object.datatype) {
            // workaround for incompatiblility between rdflib.js and RDF/JS regarding toCanonical
            quad.object.datatype.toCanonical = function () {
              return sym(this.value).toCanonical();
            };
          }
          store.add(quad);
        })
        .on('error', (error) => fail(error))
        .on('end', resolve);
    });
  }

  it('import JSON-LD to rdflib store', async () => {
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
                    <title>Document</title>
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
    await importToStore('https://shop.example/product/0816.html');
    expect(store.statements.length).toEqual(3);
    const product = store.anyStatementMatching(
      null,
      sym('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
      sym('http://schema.org/Product')
    ).subject;
    expect(product).not.toBeNull();
    expect(product.termType).toEqual('BlankNode');
    const name = store.anyValue(product, sym('http://schema.org/name'));
    expect(name).toEqual('WiFi cable');
    const description = store.anyValue(
      product,
      sym('http://schema.org/description')
    );
    expect(description).toEqual(
      'Increase your WiFi range with this 10m thin-air cable'
    );
  });
});
