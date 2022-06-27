import { when } from 'jest-when';
import { Fetcher, graph, LiveStore, UpdateManager } from 'rdflib';
import { Storage } from '../domain/Storage';
import {
  thenNoSparqlUpdateIsSentToUrl,
  thenSparqlUpdateIsSentToUrl,
} from '../test/thenSparqlUpdateIsSentToUrl';
import { turtleResponse } from '../test/turtleResponse';
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
      const result = await api.validateIfContainer(
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
      const result = await api.validateIfContainer(
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
      const result = await api.validateIfContainer(
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
            'ms-author-via': 'SPARQL',
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

      const store = graph();
      new Fetcher(store, { fetch: fetchMock });
      new UpdateManager(store);

      const api = new StorageApi(
        'https://alice.test/profile/card#me',
        store as LiveStore
      );
      const result = await api.validateIfContainer(
        'https://alice.test/existing/non-existing/'
      );
      thenSparqlUpdateIsSentToUrl(
        fetchMock,
        'https://alice.test/existing/non-existing/',
        `
      INSERT DATA {
        <https://alice.test/existing/non-existing/>
          a <http://www.w3.org/ns/ldp#Container> .
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
            'ms-author-via': 'SPARQL',
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
      const result = await api.validateIfContainer(
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
            'ms-author-via': 'SPARQL',
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
            'ms-author-via': 'SPARQL',
          }),
          statusText: 'Not allowed',
          text: async () => 'Not allowed',
        });

      const store = graph();
      new Fetcher(store, { fetch: fetchMock });
      new UpdateManager(store);

      const api = new StorageApi(
        'https://alice.test/profile/card#me',
        store as LiveStore
      );
      const result = await api.validateIfContainer(
        'https://alice.test/no-permission/non-existing/'
      );
      thenSparqlUpdateIsSentToUrl(
        fetchMock,
        'https://alice.test/no-permission/non-existing/',
        `
      INSERT DATA {
        <https://alice.test/no-permission/non-existing/>
          a <http://www.w3.org/ns/ldp#Container> .
      }`
      );
      expect(result).toBe(false);
    });
  });
});
