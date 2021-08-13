import { fetch as authenticatedFetch } from '@inrupt/solid-client-authn-browser';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import nock from 'nock';
import React from 'react';
import { Parser as SparqlParser, Update } from 'sparqljs';
import { generateDatePathForToday } from '../api/generateDatePathForToday';
import { generateUuid } from '../api/generateUuid';
import { now } from '../api/now';
import { SessionInfo } from '../api/SolidApi';
import { PageContent } from '../content/PageContent';

jest.mock('@inrupt/solid-client-authn-browser');
jest.mock('../api/generateUuid');
jest.mock('../api/generateDatePathForToday');
jest.mock('../api/now');
jest.mock('../options/optionsStorageApi');

describe('bookmarking an html page with embedded data', () => {
  const { location } = window;

  beforeEach(() => {
    jest.resetAllMocks();
    delete window.location;
    window.location = { ...location };
    window.location.href = '';
    window.document.title = '';
  });

  afterEach(() => {
    window.location = location;
  });

  it('copies all data found on the page to the pod', async () => {
    window.location.href = 'https://shop.example/product/0816.html';
    window.document.title = 'Shop Example - WiFi cable - Product page';
    (generateUuid as jest.Mock).mockReturnValue('some-uuid');
    (generateDatePathForToday as jest.Mock).mockReturnValue('/2021/03/12');
    (now as jest.Mock).mockReturnValue(
      new Date(Date.UTC(2021, 2, 12, 9, 10, 11, 12))
    );
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

    mockFetchWithResponse(`
                <https://pod.example/#me>
                <http://www.w3.org/ns/pim/space#storage>
                <https://storage.example/> .
            `);

    await act(async () => {
      await render(
        <PageContent
          close={() => null}
          sessionInfo={
            {
              isLoggedIn: true,
              webId: 'https://pod.example/#me',
            } as SessionInfo
          }
        />
      );
    });

    const clipItButton = await screen.findByText('Clip it!');

    await act(async () => {
      await userEvent.click(clipItButton);
    });

    // when the page is bookmarked

    // then the stored data is stored in the Pod
    expect(authenticatedFetch).toHaveBeenCalled();
    const parser = new SparqlParser();

    const calls = (authenticatedFetch as jest.Mock).mock.calls;

    const sparqlUpdateCall = calls[2];

    const uri = sparqlUpdateCall[0];
    expect(uri).toBe('https://storage.example/webclip/2021/03/12/some-uuid');

    const body = sparqlUpdateCall[1].body;
    expect(body).toBeDefined();
    const actualQuery = parser.parse(body) as Update;
    const expectedQuery = parser.parse(`
           INSERT DATA {
                <https://storage.example/webclip/2021/03/12/some-uuid#it>
                    a <http://schema.org/BookmarkAction> ;
                    <http://schema.org/startTime> "2021-03-12T09:10:11.012Z"^^<http://schema.org/DateTime> ;
                    <http://schema.org/object> <https://shop.example/product/0816.html> .
                <https://shop.example/product/0816.html> a <http://schema.org/WebPage> ;
                    <http://schema.org/url> <https://shop.example/product/0816.html> ;
                    <http://schema.org/name> "Shop Example - WiFi cable - Product page" ;
                    <http://schema.org/about> <https://storage.example/webclip/2021/03/12/some-uuid#1> .
                    <https://storage.example/webclip/2021/03/12/some-uuid#1> a <http://schema.org/Product> ;
                      <http://schema.org/name> "WiFi cable" ;
                      <http://schema.org/description> "Increase your WiFi range with this 10m thin-air cable" ;
                    .
            }`) as Update;
    expect(actualQuery).toEqual(expectedQuery);
  });
});

function mockFetchWithResponse(bodyText: string) {
  (authenticatedFetch as jest.Mock).mockResolvedValue({
    ok: true,
    headers: new Headers({
      'Content-Type': 'text/turtle',
      'wac-allow': 'user="read write append control",public=""',
      'ms-author-via': 'SPARQL',
    }),
    status: 200,
    statusText: 'OK',
    text: async () => bodyText,
  });
}
