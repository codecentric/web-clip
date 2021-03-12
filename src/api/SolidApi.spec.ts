import {
  fetch as authenticatedFetch,
  login,
} from '@inrupt/solid-client-authn-browser';
import { graph, parse } from 'rdflib';
import { SessionInfo, SolidApi } from './SolidApi';
import { Parser as SparqlParser, Update } from 'sparqljs';

jest.mock('@inrupt/solid-client-authn-browser');

describe('SolidApi', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('loadProfile', () => {
    describe('profile can be read after being loaded', () => {
      it('name is Anonymous, when profile contains no name', async () => {
        mockFetchWithResponse('');

        const solidApi = new SolidApi(
          {
            webId: 'https://pod.example/#me',
            isLoggedIn: true,
          } as SessionInfo,
          graph()
        );

        const result = await solidApi.loadProfile();

        expect(authenticatedFetch).toHaveBeenCalledWith(
          'https://pod.example/',
          expect.anything()
        );

        expect(result).toEqual({
          name: 'Anonymous',
        });
      });

      it('name is read from vcard:fn', async () => {
        mockFetchWithResponse(`
          <https://pod.example/#me>
            <http://www.w3.org/2006/vcard/ns#fn> "Solid User" .
          `);

        const solidApi = new SolidApi(
          {
            webId: 'https://pod.example/#me',
            isLoggedIn: true,
          } as SessionInfo,
          graph()
        );

        const result = await solidApi.loadProfile();

        expect(authenticatedFetch).toHaveBeenCalledWith(
          'https://pod.example/',
          expect.anything()
        );

        expect(result).toEqual({
          name: 'Solid User',
        });
      });
    });
    it('profile cannot be loaded, when noone is logged in', async () => {
      const solidApi = new SolidApi(
        {
          isLoggedIn: false,
        } as SessionInfo,
        graph()
      );

      await expect(solidApi.loadProfile()).rejects.toThrow(
        'No user is logged in.'
      );
    });
  });

  describe('bookmark', () => {
    it("stores a bookmark in the user's pod when storage is available", async () => {
      mockFetchWithResponse('');

      const store = graph();
      parse(
        `
          <#me>
            <https://www.w3.org/ns/pim/space#storage> <https://storage.example/> .
          `,
        store,
        'https://pod.example'
      );

      const solidApi = new SolidApi(
        {
          webId: 'https://pod.example/#me',
          isLoggedIn: true,
        } as SessionInfo,
        store
      );

      await solidApi.bookmark({
        type: 'WebPage',
        url: 'https://myfavouriteurl.example',
        name: 'I love this page',
      });

      expect(authenticatedFetch).toHaveBeenCalled();

      var parser = new SparqlParser();
      const sparqlUpdateCall = (authenticatedFetch as jest.Mock).mock.calls[1];
      const body = sparqlUpdateCall[1].body;
      const actualQuery = parser.parse(body) as Update;
      const expectedQuery = parser.parse(`
      INSERT DATA {
        <https://storage.example/webclip/2021/03/12/ee4fc42e-9d84-46f5-a3c1-3f9ef0f6faea#it> a <http://schema.org/BookmarkAction> .
      }
`) as Update;
      expect(actualQuery).toEqual(expectedQuery);
    });
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
