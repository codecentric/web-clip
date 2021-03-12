import { fetch as authenticatedFetch } from '@inrupt/solid-client-authn-browser';
import { graph, parse } from 'rdflib';
import { SessionInfo, SolidApi } from './SolidApi';
import { Parser as SparqlParser, Update } from 'sparqljs';
import { generateUuid } from './generateUuid';
import { generateDatePathForToday } from './generateDatePathForToday';
import { now } from './now';

jest.mock('@inrupt/solid-client-authn-browser');
jest.mock('./generateUuid');
jest.mock('./generateDatePathForToday');
jest.mock('./now');

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
      (generateUuid as jest.Mock).mockReturnValue('some-uuid');
      (generateDatePathForToday as jest.Mock).mockReturnValue('/2021/03/12');
      (now as jest.Mock).mockReturnValue(
        new Date(Date.UTC(2021, 2, 12, 9, 10, 11, 12))
      );

      const store = graph();
      parse(
        `
          <https://pod.example/#me>
            <http://www.w3.org/ns/pim/space#storage> <https://storage.example/> .
          `,
        store,
        'https://pod.example/'
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

      const parser = new SparqlParser();

      const sparqlUpdateCall = (authenticatedFetch as jest.Mock).mock.calls[1];

      const uri = sparqlUpdateCall[0];
      expect(uri).toBe('https://storage.example/webclip/2021/03/12/some-uuid');

      const body = sparqlUpdateCall[1].body;
      const actualQuery = parser.parse(body) as Update;
      const expectedQuery = parser.parse(`
      INSERT DATA {
        <https://storage.example/webclip/2021/03/12/some-uuid#it>
          a <http://schema.org/BookmarkAction> ;
          <http://schema.org/startTime> "2021-03-12T09:10:11.012Z"^^<http://schema.org/DateTime> ;
          <http://schema.org/object> <https://storage.example/webclip/2021/03/12/some-uuid#object>
        .
        <https://storage.example/webclip/2021/03/12/some-uuid#object>
          a <http://schema.org/WebPage> ;
          <http://schema.org/url> <https://myfavouriteurl.example>
        .
      }`) as Update;
      expect(actualQuery).toEqual(expectedQuery);
    });

    it('throws an exception if no storage is available', async () => {
      mockFetchWithResponse('');
      (generateUuid as jest.Mock).mockReturnValue('some-uuid');
      (generateDatePathForToday as jest.Mock).mockReturnValue('/2021/03/12');

      const store = graph();

      const solidApi = new SolidApi(
        {
          webId: 'https://pod.example/#me',
          isLoggedIn: true,
        } as SessionInfo,
        store
      );

      await expect(
        solidApi.bookmark({
          type: 'WebPage',
          url: 'https://myfavouriteurl.example',
          name: 'I love this page',
        })
      ).rejects.toThrow('No storage available.');
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
