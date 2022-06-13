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
});
