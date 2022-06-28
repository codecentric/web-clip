import { Session } from '@inrupt/solid-client-authn-browser';
import { when } from 'jest-when';
import { graph } from 'rdflib';
import { Bookmark } from '../domain/Bookmark';
import { OptionsStorage } from '../options/OptionsStorage';
import { Options } from '../options/optionsStorageApi';
import { BookmarkStore } from '../store/BookmarkStore';
import { givenStoreContaining } from '../test/givenStoreContaining';
import {
  thenNoSparqlUpdateIsSentToUrl,
  thenSparqlUpdateIsSentToUrl,
} from '../test/thenSparqlUpdateIsSentToUrl';
import { BookmarkApi } from './BookmarkApi';
import { generateUuid } from './generateUuid';
import { now } from './now';

jest.mock('@inrupt/solid-client-authn-browser');
jest.mock('./generateUuid');
jest.mock('./now');
jest.mock('../options/optionsStorageApi');

describe('SolidApi', () => {
  let optionsStorage: OptionsStorage;

  beforeEach(() => {
    jest.resetAllMocks();
    optionsStorage = {
      getOptions: jest.fn().mockReturnValue({}),
    } as unknown as OptionsStorage;
  });

  describe('loadProfile', () => {
    describe('profile can be read after being loaded', () => {
      it('name is Nameless, when profile contains no name', async () => {
        const authenticatedFetch = mockFetchWithResponse('');
        const api = new BookmarkApi(
          {
            info: {
              webId: 'https://pod.example/#me',
              isLoggedIn: true,
            },
            fetch: authenticatedFetch,
          } as unknown as Session,
          new BookmarkStore(),
          optionsStorage
        );

        const result = await api.loadProfile();

        expect(authenticatedFetch).toHaveBeenCalledWith(
          'https://pod.example/',
          expect.anything()
        );

        expect(result).toEqual({
          webId: 'https://pod.example/#me',
          name: 'Nameless',
        });
      });

      it('name is read from vcard:fn', async () => {
        const authenticatedFetch = mockFetchWithResponse(`
          <https://pod.example/#me>
            <http://www.w3.org/2006/vcard/ns#fn> "Solid User" .
          `);

        const api = new BookmarkApi(
          {
            info: {
              webId: 'https://pod.example/#me',
              isLoggedIn: true,
            },
            fetch: authenticatedFetch,
          } as unknown as Session,
          new BookmarkStore(),
          optionsStorage
        );

        const result = await api.loadProfile();

        expect(authenticatedFetch).toHaveBeenCalledWith(
          'https://pod.example/',
          expect.anything()
        );

        expect(result).toEqual({
          webId: 'https://pod.example/#me',
          name: 'Solid User',
        });
      });
    });
    it('profile cannot be loaded, when no-one is logged in', async () => {
      const api = new BookmarkApi(
        { info: { isLoggedIn: false } } as Session,
        new BookmarkStore(),
        optionsStorage
      );

      await expect(api.loadProfile()).rejects.toThrow('No user is logged in.');
    });
  });

  describe('bookmark', () => {
    describe('with legacy storage determination', () => {
      it("stores a bookmark in the user's pod when storage is available", async () => {
        const authenticatedFetch = mockFetchWithResponse('');
        givenGeneratedUuidWillBe('some-uuid');
        givenNowIs(Date.UTC(2021, 2, 12, 9, 10, 11, 12));

        const store = givenStoreContaining(
          'https://pod.example/',
          `
          <#me>
            <http://www.w3.org/ns/pim/space#storage> <https://storage.example/> .
          `
        );

        const api = new BookmarkApi(
          {
            info: {
              webId: 'https://pod.example/#me',
              isLoggedIn: true,
            },
            fetch: authenticatedFetch,
          } as unknown as Session,
          new BookmarkStore(store),
          optionsStorage
        );

        await api.bookmark({
          type: 'WebPage',
          url: 'https://myfavouriteurl.example',
          name: 'I love this page',
        });

        thenSparqlUpdateIsSentToUrl(
          authenticatedFetch,
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
        const authenticatedFetch = mockFetchWithResponse('');
        givenNowIs(Date.UTC(2021, 2, 12, 9, 10, 11, 12));
        givenGeneratedUuidWillBe('some-uuid');

        const store = givenStoreContaining(
          'https://pod.example/',
          `
          <#me>
            <http://www.w3.org/ns/pim/space#storage> <https://storage.example/> .
          `
        );

        const api = new BookmarkApi(
          {
            info: {
              webId: 'https://pod.example/#me',
              isLoggedIn: true,
            },
            fetch: authenticatedFetch,
          } as unknown as Session,
          new BookmarkStore(store),
          optionsStorage
        );

        await api.bookmark({
          type: 'WebPage',
          url: 'https://myfavouriteurl.example',
          name: 'I love this page',
        });

        thenSparqlUpdateIsSentToUrl(
          authenticatedFetch,
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
        const authenticatedFetch = mockFetchWithResponse('');
        (generateUuid as jest.Mock).mockReturnValue('some-uuid');

        const store = new BookmarkStore();

        const api = new BookmarkApi(
          {
            info: {
              webId: 'https://pod.example/#me',
              isLoggedIn: true,
            },
            fetch: authenticatedFetch,
          } as unknown as Session,
          store,
          optionsStorage
        );

        await expect(
          api.bookmark({
            type: 'WebPage',
            url: 'https://myfavouriteurl.example',
            name: 'I love this page',
          })
        ).rejects.toThrow('No storage available.');
      });
    });

    describe('with a container url chosen during setup', () => {
      it("stores a bookmark in the user's pod at the chosen container", async () => {
        const authenticatedFetch = mockFetchWithResponse('');
        givenGeneratedUuidWillBe('some-uuid');
        givenNowIs(Date.UTC(2021, 2, 12, 9, 10, 11, 12));

        when(optionsStorage.getOptions).mockReturnValue({
          containerUrl: 'https://storage.example/my-bookmarks/',
        } as Options);
        const store = graph();

        const api = new BookmarkApi(
          {
            info: {
              webId: 'https://pod.example/#me',
              isLoggedIn: true,
            },
            fetch: authenticatedFetch,
          } as unknown as Session,
          new BookmarkStore(store),
          optionsStorage
        );

        await api.bookmark({
          type: 'WebPage',
          url: 'https://myfavouriteurl.example',
          name: 'I love this page',
        });

        thenSparqlUpdateIsSentToUrl(
          authenticatedFetch,
          'https://storage.example/my-bookmarks/2021/03/12/some-uuid',
          `
      INSERT DATA {
        <https://storage.example/my-bookmarks/2021/03/12/some-uuid#it>
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
        const authenticatedFetch = mockFetchWithResponse('');
        givenNowIs(Date.UTC(2021, 2, 12, 9, 10, 11, 12));
        givenGeneratedUuidWillBe('some-uuid');

        when(optionsStorage.getOptions).mockReturnValue({
          containerUrl: 'https://storage.example/my-bookmarks/',
        } as Options);
        const store = graph();

        const api = new BookmarkApi(
          {
            info: {
              webId: 'https://pod.example/#me',
              isLoggedIn: true,
            },
            fetch: authenticatedFetch,
          } as unknown as Session,
          new BookmarkStore(store),
          optionsStorage
        );

        await api.bookmark({
          type: 'WebPage',
          url: 'https://myfavouriteurl.example',
          name: 'I love this page',
        });

        thenSparqlUpdateIsSentToUrl(
          authenticatedFetch,
          'https://storage.example/my-bookmarks/index.ttl',
          `
      INSERT DATA {
        <https://storage.example/my-bookmarks/2021/03/12/some-uuid#it>
          a <http://schema.org/BookmarkAction> ;
          <http://schema.org/object> <https://myfavouriteurl.example>
        .
      }`
        );
      });
    });

    it('relates the bookmarked page to named node found on that page', async () => {
      const authenticatedFetch = mockFetchWithResponse('');
      givenGeneratedUuidWillBe('some-uuid');
      givenNowIs(Date.UTC(2021, 2, 12, 9, 10, 11, 12));

      when(optionsStorage.getOptions).mockReturnValue({
        containerUrl: 'https://storage.example/webclip/',
      } as Options);
      const store = givenStoreContaining(
        'https://shop.example/product/0815.html',
        `
          @prefix schema: <http://schema.org/> .
          <#0815> a schema:Product ;
             schema:name "WiFi cable" .
        `
      );

      const api = new BookmarkApi(
        {
          info: {
            webId: 'https://pod.example/#me',
            isLoggedIn: true,
          },
          fetch: authenticatedFetch,
        } as unknown as Session,
        new BookmarkStore(store),
        optionsStorage
      );

      await api.bookmark({
        type: 'WebPage',
        url: 'https://shop.example/product/0815.html',
        name: 'WiFi cable at Example Shop - Product Details',
      });

      thenSparqlUpdateIsSentToUrl(
        authenticatedFetch,
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
      const authenticatedFetch = mockFetchWithResponse('');
      givenGeneratedUuidWillBe('some-uuid');
      givenNowIs(Date.UTC(2021, 2, 12, 9, 10, 11, 12));

      when(optionsStorage.getOptions).mockReturnValue({
        containerUrl: 'https://storage.example/webclip/',
      } as Options);
      const store = graph();

      const api = new BookmarkApi(
        {
          info: {
            webId: 'https://pod.example/#me',
            isLoggedIn: true,
          },
          fetch: authenticatedFetch,
        } as unknown as Session,
        new BookmarkStore(store),
        optionsStorage
      );

      const result = await api.bookmark({
        type: 'WebPage',
        url: 'https://myfavouriteurl.example',
        name: 'I love this page',
      });

      expect(result).toEqual({
        uri: 'https://storage.example/webclip/2021/03/12/some-uuid#it',
      });
    });

    it('updates an existing bookmark, instead of creating a new one', async () => {
      const authenticatedFetch = mockFetchWithResponse('');
      givenGeneratedUuidWillBe('some-uuid');
      givenNowIs(Date.UTC(2021, 2, 12, 9, 10, 11, 12));

      const store = givenStoreContaining(
        'https://pod.example/',
        `
          <#me>
            <http://www.w3.org/ns/pim/space#storage> <https://storage.example/> .
          `
      );

      const api = new BookmarkApi(
        {
          info: {
            webId: 'https://pod.example/#me',
            isLoggedIn: true,
          },
          fetch: authenticatedFetch,
        } as unknown as Session,
        new BookmarkStore(store),
        optionsStorage
      );

      await api.bookmark(
        {
          type: 'WebPage',
          url: 'https://myfavouriteurl.example',
          name: 'I love this page',
        },
        {
          uri: 'https://storage.example/existing/bookmark#it',
        }
      );

      thenSparqlUpdateIsSentToUrl(
        authenticatedFetch,
        'https://storage.example/existing/bookmark',
        `
      INSERT DATA {
        <https://storage.example/existing/bookmark#it>
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

    it('does not update the index, since it already exists for existing bookmark', async () => {
      const authenticatedFetch = mockFetchWithResponse('');
      givenNowIs(Date.UTC(2021, 2, 12, 9, 10, 11, 12));
      givenGeneratedUuidWillBe('some-uuid');

      const store = givenStoreContaining(
        'https://pod.example/',
        `
          <#me>
            <http://www.w3.org/ns/pim/space#storage> <https://storage.example/> .
          `
      );

      const api = new BookmarkApi(
        {
          info: {
            webId: 'https://pod.example/#me',
            isLoggedIn: true,
          },
          fetch: authenticatedFetch,
        } as unknown as Session,
        new BookmarkStore(store),
        optionsStorage
      );

      await api.bookmark(
        {
          type: 'WebPage',
          url: 'https://myfavouriteurl.example',
          name: 'I love this page',
        },
        {
          uri: 'https://storage.example/existing/bookmark#it',
        }
      );

      thenNoSparqlUpdateIsSentToUrl(
        authenticatedFetch,
        'https://storage.example/webclip/index.ttl'
      );
    });
  });

  describe('load bookmark', () => {
    beforeEach(() => {
      when(optionsStorage.getOptions).mockReturnValue({
        containerUrl: 'https://storage.example/webclip/',
      } as Options);
    });

    describe('when no index is found', () => {
      let result: Bookmark;
      let authenticatedFetch: jest.Mock;
      beforeEach(async () => {
        authenticatedFetch = jest.fn();
        authenticatedFetch.mockResolvedValue({
          ok: true,
          headers: new Headers({
            'Content-Type': 'text/plain',
            'wac-allow': 'user="read write append control",public=""',
            'accept-patch': 'application/sparql-update',
          }),
          status: 404,
          statusText: 'Not Found',
          text: async () => 'Cannot find requested file',
        });

        const store = graph();

        const api = new BookmarkApi(
          {
            info: {
              webId: 'https://pod.example/#me',
              isLoggedIn: true,
            },
            fetch: authenticatedFetch,
          } as unknown as Session,
          new BookmarkStore(store),
          optionsStorage
        );

        result = await api.loadBookmark({
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
      let authenticatedFetch: jest.Mock;
      beforeEach(async () => {
        authenticatedFetch = mockFetchWithResponse(`
          @prefix schema: <http://schema.org/> .
          
          <http://storage.example/webclip/irrelevant#it> a schema:BookmarkAction; schema:object <https://irrelevant.example> .
        `);

        const store = graph();

        const api = new BookmarkApi(
          {
            info: {
              webId: 'https://pod.example/#me',
              isLoggedIn: true,
            },
            fetch: authenticatedFetch,
          } as unknown as Session,
          new BookmarkStore(store),
          optionsStorage
        );

        result = await api.loadBookmark({
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

    describe('when page is found at the index', () => {
      let result: Bookmark;
      let authenticatedFetch: jest.Mock;
      beforeEach(async () => {
        authenticatedFetch = mockFetchWithResponse(`
          @prefix schema: <http://schema.org/> .
          
          <http://storage.example/webclip/relevant#it> a schema:BookmarkAction; schema:object <https://myfavouriteurl.example> .
        `);

        const store = graph();

        const api = new BookmarkApi(
          {
            info: {
              webId: 'https://pod.example/#me',
              isLoggedIn: true,
            },
            fetch: authenticatedFetch,
          } as unknown as Session,
          new BookmarkStore(store),
          optionsStorage
        );

        result = await api.loadBookmark({
          type: 'WebPage',
          url: 'https://myfavouriteurl.example',
          name: 'I love this page',
        });
      });

      it('it returns the existing bookmark', async () => {
        expect(result).toEqual({
          uri: 'http://storage.example/webclip/relevant#it',
        });
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
  const authenticatedFetch = jest.fn();
  authenticatedFetch.mockResolvedValue({
    ok: true,
    headers: new Headers({
      'Content-Type': 'text/turtle',
      'wac-allow': 'user="read write append control",public=""',
      'accept-patch': 'application/sparql-update',
    }),
    status: 200,
    statusText: 'OK',
    text: async () => bodyText,
  });
  return authenticatedFetch;
}

function givenGeneratedUuidWillBe(value: string) {
  (generateUuid as jest.Mock).mockReturnValue(value);
}

function givenNowIs(timestamp: number) {
  (now as jest.Mock).mockReturnValue(new Date(timestamp));
}
