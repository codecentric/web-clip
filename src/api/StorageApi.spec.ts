import { when } from 'jest-when';
import { Fetcher, graph, LiveStore, UpdateManager } from 'rdflib';
import { Storage } from '../domain/Storage';
import {
  thenNoSparqlUpdateIsSentToUrl,
  thenSparqlUpdateIsSentToUrl,
} from '../test/thenSparqlUpdateIsSentToUrl';
import {
  containerResponse,
  storageResponse,
  turtleResponse,
} from '../test/turtleResponse';
import { StorageApi } from './StorageApi';

describe('StorageApi', () => {
  describe('findStorage', () => {
    it('finds a storage in the user profile', async () => {
      const fetchMock = jest.fn();
      when(fetchMock)
        .calledWith('https://alice.test/profile/card', expect.anything())
        .mockResolvedValue(
          turtleResponse(`
          @prefix space: <http://www.w3.org/ns/pim/space#> .
          <https://alice.test/profile/card#me> space:storage </> .
          `)
        );
      const store = graph();
      new Fetcher(store, { fetch: fetchMock });
      const api = new StorageApi(
        'https://alice.test/profile/card#me',
        store as LiveStore
      );
      const storage = await api.findStorage();
      expect(storage).toEqual(new Storage('https://alice.test/'));
    });

    it('finds a storage searching upwards from the WebID profile', async () => {
      const fetchMock = jest.fn();
      when(fetchMock)
        .calledWith(
          'https://provider.test/alice/profile/card',
          expect.anything()
        )
        .mockResolvedValue(turtleResponse(''));
      when(fetchMock)
        .calledWith('https://provider.test/alice/profile/', expect.anything())
        .mockResolvedValue(containerResponse());
      when(fetchMock)
        .calledWith('https://provider.test/alice/', expect.anything())
        .mockResolvedValue(storageResponse());

      const store = graph();
      new Fetcher(store, { fetch: fetchMock });
      const api = new StorageApi(
        'https://provider.test/alice/profile/card#me',
        store as LiveStore
      );
      const storage = await api.findStorage();
      expect(storage).toEqual(new Storage('https://provider.test/alice/'));
    });

    it('returns null if nothing can be found search the hierarchy', async () => {
      const fetchMock = jest.fn();
      when(fetchMock)
        .calledWith(
          'https://provider.test/alice/profile/card',
          expect.anything()
        )
        .mockResolvedValue(turtleResponse(''));
      when(fetchMock)
        .calledWith('https://provider.test/alice/profile/', expect.anything())
        .mockResolvedValue(containerResponse());
      when(fetchMock)
        .calledWith('https://provider.test/alice/', expect.anything())
        .mockResolvedValue(containerResponse());
      when(fetchMock)
        .calledWith('https://provider.test/', expect.anything())
        .mockResolvedValue(containerResponse());

      const store = graph();
      new Fetcher(store, { fetch: fetchMock });
      const api = new StorageApi(
        'https://provider.test/alice/profile/card#me',
        store as LiveStore
      );
      const storage = await api.findStorage();
      expect(storage).toEqual(null);
    });

    it('returns null if an error occurs', async () => {
      const fetchMock = jest.fn();
      when(fetchMock)
        .calledWith(
          'https://provider.test/alice/profile/card',
          expect.anything()
        )
        .mockResolvedValue(turtleResponse(''));
      when(fetchMock)
        .calledWith('https://provider.test/alice/profile/', expect.anything())
        .mockResolvedValue(containerResponse());
      when(fetchMock)
        .calledWith('https://provider.test/alice/', expect.anything())
        .mockResolvedValue({
          ok: false,
          status: 500,
          headers: new Headers({
            'Content-Type': 'text/plain',
          }),
          statusText: 'Fake Error',
          text: async () => 'Fake Error',
        });

      const store = graph();
      new Fetcher(store, { fetch: fetchMock });
      const api = new StorageApi(
        'https://provider.test/alice/profile/card#me',
        store as LiveStore
      );
      const storage = await api.findStorage();
      expect(storage).toEqual(null);
    });
  });

  describe('validateIfContainer', () => {
    it('is valid if it is an editable container', async () => {
      const fetchMock = jest.fn();
      when(fetchMock)
        .calledWith('https://alice.test/public/', expect.anything())
        .mockResolvedValue(
          turtleResponse(
            `
          @prefix ldp: <http://www.w3.org/ns/ldp#> .
          <> a ldp:Container .
          `,
            'read write append'
          )
        );
      const store = graph();
      new Fetcher(store, { fetch: fetchMock });
      new UpdateManager(store);
      const api = new StorageApi(
        'https://alice.test/profile/card#me',
        store as LiveStore
      );
      const result = await api.ensureValidContainer(
        'https://alice.test/public/'
      );
      expect(result).toBe(true);
    });

    it('is not valid if it is an read-only container', async () => {
      const fetchMock = jest.fn();
      when(fetchMock)
        .calledWith('https://alice.test/public/', expect.anything())
        .mockResolvedValue(
          turtleResponse(
            `
          @prefix ldp: <http://www.w3.org/ns/ldp#> .
          <> a ldp:Container .
          `,
            'read'
          )
        );
      const store = graph();
      new Fetcher(store, { fetch: fetchMock });
      new UpdateManager(store);
      const api = new StorageApi(
        'https://alice.test/profile/card#me',
        store as LiveStore
      );
      const result = await api.ensureValidContainer(
        'https://alice.test/public/'
      );
      expect(result).toBe(false);
    });

    it('is not valid if it is not a container', async () => {
      const fetchMock = jest.fn();
      when(fetchMock)
        .calledWith('https://alice.test/profile/card', expect.anything())
        .mockResolvedValue(
          turtleResponse(`
          @prefix ldp: <http://www.w3.org/ns/ldp#> .
          <> a ldp:Resource .
          `)
        );
      const store = graph();
      new Fetcher(store, { fetch: fetchMock });
      const api = new StorageApi(
        'https://alice.test/profile/card#me',
        store as LiveStore
      );
      const result = await api.ensureValidContainer(
        'https://alice.test/profile/card'
      );
      expect(result).toBe(false);
    });

    it('is valid, if not found, but can be created', async () => {
      const fetchMock = jest.fn();

      when(fetchMock)
        .calledWith(
          'https://alice.test/existing/non-existing/',
          expect.anything()
        )
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
          headers: new Headers({
            'Content-Type': 'text/plain',
            'accept-patch': 'application/sparql-update',
          }),
          statusText: 'Not Found',
          text: async () => 'Not Found',
        });

      when(fetchMock)
        .calledWith(
          'https://alice.test/existing/non-existing/',
          expect.anything()
        )
        .mockResolvedValueOnce(
          turtleResponse(
            `
          @prefix ldp: <http://www.w3.org/ns/ldp#> .
          <> a ldp:Container .
          `,
            'read write append'
          )
        );

      when(fetchMock)
        .calledWith('https://alice.test/existing/', expect.anything())
        .mockResolvedValueOnce(
          turtleResponse(
            `
          @prefix ldp: <http://www.w3.org/ns/ldp#> .
          <> a ldp:Container .
          `,
            'read write append'
          )
        );

      when(fetchMock)
        .calledWith(
          'https://alice.test/existing/non-existing/index.ttl',
          expect.anything()
        )
        .mockResolvedValue({
          ok: true,
          status: 201,
          headers: new Headers({
            'Content-Type': 'text/plain',
            'accept-patch': 'application/sparql-update',
          }),
          statusText: 'Created',
          text: async () => 'Created',
        });

      const store = graph();
      new Fetcher(store, { fetch: fetchMock });
      new UpdateManager(store);

      const api = new StorageApi(
        'https://alice.test/profile/card#me',
        store as LiveStore
      );
      const result = await api.ensureValidContainer(
        'https://alice.test/existing/non-existing/'
      );
      thenSparqlUpdateIsSentToUrl(
        fetchMock,
        'https://alice.test/existing/non-existing/index.ttl',
        `
      INSERT DATA {
        <https://alice.test/existing/non-existing/index.ttl>
          a <http://www.w3.org/ns/ldp#Resource> .
      }`
      );
      expect(result).toBe(true);
    });

    it('is not valid, and does not try to create a container, if user has no permission', async () => {
      const fetchMock = jest.fn();

      when(fetchMock)
        .calledWith('https://alice.test/no-permission/', expect.anything())
        .mockResolvedValue({
          ok: false,
          status: 403,
          headers: new Headers({
            'Content-Type': 'text/plain',
            'accept-patch': 'application/sparql-update',
          }),
          statusText: 'Not Found',
          text: async () => 'Not Found',
        });

      const store = graph();
      new Fetcher(store, { fetch: fetchMock });
      new UpdateManager(store);

      const api = new StorageApi(
        'https://alice.test/profile/card#me',
        store as LiveStore
      );
      const result = await api.ensureValidContainer(
        'https://alice.test/no-permission/'
      );
      thenNoSparqlUpdateIsSentToUrl(
        fetchMock,
        'https://alice.test/no-permission/'
      );
      expect(result).toBe(false);
    });

    it('is not valid, if not found, and also cannot be created', async () => {
      const fetchMock = jest.fn();

      when(fetchMock)
        .calledWith(
          'https://alice.test/no-permission/non-existing/',
          expect.anything()
        )
        .mockResolvedValue({
          ok: false,
          status: 404,
          headers: new Headers({
            'Content-Type': 'text/plain',
            'accept-patch': 'application/sparql-update',
          }),
          statusText: 'Not Found',
          text: async () => 'Not Found',
        });

      when(fetchMock)
        .calledWith('https://alice.test/no-permission/', expect.anything())
        .mockResolvedValue({
          ok: false,
          status: 403,
          headers: new Headers({
            'Content-Type': 'text/plain',
            'accept-patch': 'application/sparql-update',
          }),
          statusText: 'Not allowed',
          text: async () => 'Not allowed',
        });

      when(fetchMock)
        .calledWith(
          'https://alice.test/no-permission/non-existing/index.ttl',
          expect.anything()
        )
        .mockResolvedValue({
          ok: false,
          status: 404,
          headers: new Headers({
            'Content-Type': 'text/plain',
            'accept-patch': 'application/sparql-update',
          }),
          statusText: 'Not Found',
          text: async () => 'Not Found',
        });

      const store = graph();
      new Fetcher(store, { fetch: fetchMock });
      new UpdateManager(store);

      const api = new StorageApi(
        'https://alice.test/profile/card#me',
        store as LiveStore
      );
      const result = await api.ensureValidContainer(
        'https://alice.test/no-permission/non-existing/'
      );
      thenSparqlUpdateIsSentToUrl(
        fetchMock,
        'https://alice.test/no-permission/non-existing/index.ttl',
        `
      INSERT DATA {
        <https://alice.test/no-permission/non-existing/index.ttl>
          a <http://www.w3.org/ns/ldp#Resource> .
      }`
      );
      expect(result).toBe(false);
    });
  });
});
