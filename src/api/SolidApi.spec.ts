import {
  fetch as authenticatedFetch,
  login,
} from '@inrupt/solid-client-authn-browser';
import { graph, parse, Store as RdflibStore } from 'rdflib';
import { subscribeOption } from '../options/optionsStorageApi';
import { Store } from '../store/Store';
import { Bookmark, SessionInfo, SolidApi } from './SolidApi';
import { Parser as SparqlParser, Update } from 'sparqljs';
import { generateUuid } from './generateUuid';
import { now } from './now';

jest.mock('@inrupt/solid-client-authn-browser');
jest.mock('./generateUuid');
jest.mock('./now');
jest.mock('../options/optionsStorageApi');

interface MockStore extends RdflibStore {
  and: (base: string, turtle: string) => MockStore;
}

describe('SolidApi', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('login', () => {
    it('logs in against the configured provider url', async () => {
      givenMyPodProviderIs('https://pod.provider.example');
      // when I log in
      const solidApi = new SolidApi(
        {
          isLoggedIn: false,
        } as SessionInfo,
        new Store()
      );
      await solidApi.login();
      // then I can log in at that pod provider and am redirected to the current page after that
      expect(login).toHaveBeenCalledWith({
        oidcIssuer: 'https://pod.provider.example',
        redirectUrl: 'http://localhost/',
      });
    });

    it('login fails if provider url is not present yet', async () => {
      givenMyPodProviderIs(undefined);
      // when I try to log in
      const solidApi = new SolidApi(
        {
          isLoggedIn: false,
        } as SessionInfo,
        new Store()
      );
      // then I see this error
      await expect(() => solidApi.login()).rejects.toEqual(
        new Error('No pod provider URL configured')
      );
    });
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
          new Store()
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
          new Store()
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
        new Store()
      );

      await expect(solidApi.loadProfile()).rejects.toThrow(
        'No user is logged in.'
      );
    });
  });

  function givenStoreContaining(base: string, turtle: string): MockStore {
    const store = graph() as MockStore;
    parse(turtle, store, base);
    store.and = (base: string, turtle: string) => {
      parse(turtle, store, base);
      return store;
    };
    return store;
  }

  describe('bookmark', () => {
    it("stores a bookmark in the user's pod when storage is available", async () => {
      mockFetchWithResponse('');
      givenGeneratedUuidWillBe('some-uuid');
      givenNowIs(Date.UTC(2021, 2, 12, 9, 10, 11, 12));

      const store = givenStoreContaining(
        'https://pod.example/',
        `
          <#me>
            <http://www.w3.org/ns/pim/space#storage> <https://storage.example/> .
          `
      );

      const solidApi = new SolidApi(
        {
          webId: 'https://pod.example/#me',
          isLoggedIn: true,
        } as SessionInfo,
        new Store(store)
      );

      await solidApi.bookmark({
        type: 'WebPage',
        url: 'https://myfavouriteurl.example',
        name: 'I love this page',
      });

      thenSparqlUpdateIsSentToUrl(
        'https://storage.example/webclip/2021/03/12/some-uuid',
        `
      INSERT DATA {
        <https://storage.example/webclip/2021/03/12/some-uuid#it>
          a <http://schema.org/BookmarkAction> ;
          <http://schema.org/startTime> "2021-03-12T09:10:11.012Z"^^<http://schema.org/DateTime> ;
          <http://schema.org/object> <https://myfavouriteurl.example>
        .
        <https://myfavouriteurl.example>
          a <http://schema.org/WebPage> ;
          <http://schema.org/url> <https://myfavouriteurl.example> ;
          <http://schema.org/name> "I love this page" ;
        .
      }`
      );
    });

    it('adds the bookmark to the webclip index', async () => {
      mockFetchWithResponse('');
      givenNowIs(Date.UTC(2021, 2, 12, 9, 10, 11, 12));
      givenGeneratedUuidWillBe('some-uuid');

      const store = givenStoreContaining(
        'https://pod.example/',
        `
          <#me>
            <http://www.w3.org/ns/pim/space#storage> <https://storage.example/> .
          `
      );

      const solidApi = new SolidApi(
        {
          webId: 'https://pod.example/#me',
          isLoggedIn: true,
        } as SessionInfo,
        new Store(store)
      );

      await solidApi.bookmark({
        type: 'WebPage',
        url: 'https://myfavouriteurl.example',
        name: 'I love this page',
      });

      thenSparqlUpdateIsSentToUrl(
        'https://storage.example/webclip/index.ttl',
        `
      INSERT DATA {
        <https://storage.example/webclip/2021/03/12/some-uuid#it>
          a <http://schema.org/BookmarkAction> ;
          <http://schema.org/object> <https://myfavouriteurl.example>
        .
      }`
      );
    });

    it('throws an exception if no storage is available', async () => {
      mockFetchWithResponse('');
      (generateUuid as jest.Mock).mockReturnValue('some-uuid');

      const store = new Store();

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

    it('relates the bookmarked page to named node found on that page', async () => {
      mockFetchWithResponse('');
      givenGeneratedUuidWillBe('some-uuid');
      givenNowIs(Date.UTC(2021, 2, 12, 9, 10, 11, 12));

      const store = givenStoreContaining(
        'https://pod.example/',
        `
                @prefix space: <http://www.w3.org/ns/pim/space#> .
                <#me> space:storage <https://storage.example/>.
                `
      ).and(
        'https://shop.example/product/0815.html',
        `
          @prefix schema: <http://schema.org/> .
          <#0815> a schema:Product ;
             schema:name "WiFi cable" .
        `
      );

      const solidApi = new SolidApi(
        {
          webId: 'https://pod.example/#me',
          isLoggedIn: true,
        } as SessionInfo,
        new Store(store)
      );

      await solidApi.bookmark({
        type: 'WebPage',
        url: 'https://shop.example/product/0815.html',
        name: 'WiFi cable at Example Shop - Product Details',
      });

      thenSparqlUpdateIsSentToUrl(
        'https://storage.example/webclip/2021/03/12/some-uuid',
        `
      INSERT DATA {
        <https://storage.example/webclip/2021/03/12/some-uuid#it>
          a <http://schema.org/BookmarkAction> ;
          <http://schema.org/startTime> "2021-03-12T09:10:11.012Z"^^<http://schema.org/DateTime> ;
          <http://schema.org/object> <https://shop.example/product/0815.html>
        .
        <https://shop.example/product/0815.html>
          a <http://schema.org/WebPage> ;
          <http://schema.org/url> <https://shop.example/product/0815.html> ;
          <http://schema.org/name> "WiFi cable at Example Shop - Product Details" ;
          <http://schema.org/about> <https://shop.example/product/0815.html#0815>
        .
        <https://shop.example/product/0815.html#0815>
          a <http://schema.org/Product> ;
          <http://schema.org/name> "WiFi cable"
        .
      }`
      );
    });

    it('returns the uri for the bookmark action', async () => {
      mockFetchWithResponse('');
      givenGeneratedUuidWillBe('some-uuid');
      givenNowIs(Date.UTC(2021, 2, 12, 9, 10, 11, 12));

      const store = givenStoreContaining(
        'https://pod.example/',
        `
          <#me>
            <http://www.w3.org/ns/pim/space#storage> <https://storage.example/> .
          `
      );

      const solidApi = new SolidApi(
        {
          webId: 'https://pod.example/#me',
          isLoggedIn: true,
        } as SessionInfo,
        new Store(store)
      );

      const result = await solidApi.bookmark({
        type: 'WebPage',
        url: 'https://myfavouriteurl.example',
        name: 'I love this page',
      });

      expect(result).toEqual({
        uri: 'https://storage.example/webclip/2021/03/12/some-uuid#it',
      });
    });
  });

  describe('load bookmark', () => {
    describe('when no index is found', () => {
      let result: Bookmark;
      beforeEach(async () => {
        (authenticatedFetch as jest.Mock).mockResolvedValue({
          ok: true,
          headers: new Headers({
            'Content-Type': 'text/plain',
            'wac-allow': 'user="read write append control",public=""',
            'ms-author-via': 'SPARQL',
          }),
          status: 404,
          statusText: 'Not Found',
          text: async () => 'Cannot find requested file',
        });

        const store = givenStoreContaining(
          'https://pod.example/',
          `
          <#me>
            <http://www.w3.org/ns/pim/space#storage> <https://storage.example/> .
          `
        );

        const solidApi = new SolidApi(
          {
            webId: 'https://pod.example/#me',
            isLoggedIn: true,
          } as SessionInfo,
          new Store(store)
        );

        result = await solidApi.loadBookmark({
          type: 'WebPage',
          url: 'https://myfavouriteurl.example',
          name: 'I love this page',
        });
      });

      it('it returns null', async () => {
        expect(result).toEqual(null);
      });

      it('has tried to load the index document', () => {
        expect(authenticatedFetch).toHaveBeenCalledWith(
          'https://storage.example/webclip/index.ttl',
          expect.anything()
        );
      });
    });

    describe('when page is not found at the index', () => {
      let result: Bookmark;
      beforeEach(async () => {
        mockFetchWithResponse(`
          @prefix schema: <http://schema.org/> .
          
          <http://storage.example/webclip/irrelevant#it> schema:object <https://irrelevant.example> .
        `);

        const store = givenStoreContaining(
          'https://pod.example/',
          `
          <#me>
            <http://www.w3.org/ns/pim/space#storage> <https://storage.example/> .
          `
        );

        const solidApi = new SolidApi(
          {
            webId: 'https://pod.example/#me',
            isLoggedIn: true,
          } as SessionInfo,
          new Store(store)
        );

        result = await solidApi.loadBookmark({
          type: 'WebPage',
          url: 'https://myfavouriteurl.example',
          name: 'I love this page',
        });
      });

      it('it returns null', async () => {
        expect(result).toEqual(null);
      });

      it('has tried to load the index document', () => {
        expect(authenticatedFetch).toHaveBeenCalledWith(
          'https://storage.example/webclip/index.ttl',
          expect.anything()
        );
      });
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

function givenMyPodProviderIs(example: string) {
  (subscribeOption as jest.Mock).mockImplementation((key, callback) => {
    expect(key).toBe('providerUrl');
    callback(example);
  });
}

function givenGeneratedUuidWillBe(value: string) {
  (generateUuid as jest.Mock).mockReturnValue(value);
}

function givenNowIs(timestamp: number) {
  (now as jest.Mock).mockReturnValue(new Date(timestamp));
}

function thenSparqlUpdateIsSentToUrl(url: string, query: string) {
  expect(authenticatedFetch).toHaveBeenCalled();

  const parser = new SparqlParser();

  const calls = (authenticatedFetch as jest.Mock).mock.calls;
  const sparqlUpdateCall = calls.find(
    (it) => it[0] === url && it[1].method === 'PATCH'
  );

  expect(sparqlUpdateCall).toBeDefined();

  const body = sparqlUpdateCall[1].body;
  const actualQuery = parser.parse(body) as Update;
  const expectedQuery = parser.parse(query) as Update;
  expect(actualQuery).toEqual(expectedQuery);
}
