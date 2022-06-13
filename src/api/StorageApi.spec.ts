import { when } from 'jest-when';
import { Fetcher, graph, LiveStore } from 'rdflib';
import { Storage } from '../domain/Storage';
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
    it('is valid if it is a container', async () => {
      const fetchMock = jest.fn();
      when(fetchMock)
        .calledWith('https://alice.test/public/', expect.anything())
        .mockResolvedValue(
          turtleResponse(`
          @prefix ldp: <http://www.w3.org/ns/ldp#> .
          <> a ldp:Container .
          `)
        );
      const store = graph();
      new Fetcher(store, { fetch: fetchMock });
      const api = new StorageApi(
        'https://alice.test/profile/card#me',
        store as LiveStore
      );
      const result = await api.validateIfContainer(
        'https://alice.test/public/'
      );
      expect(result).toBe(true);
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
  });
});
