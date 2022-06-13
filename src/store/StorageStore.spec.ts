import { graph, parse } from 'rdflib';
import { Storage } from '../domain/Storage';
import { StorageStore } from './StorageStore';

describe('StorageStore', () => {
  describe('getStorageForWebId', () => {
    it('does not return storage if store is empty', () => {
      const store = graph();
      const storageStore = new StorageStore(store);
      const storage = storageStore.getStorageForWebId(
        'https://alice.test/profile/card#me'
      );
      expect(storage).toBe(null);
    });

    it('returns storage linked from WebID', () => {
      const store = graph();
      parse(
        `
        @prefix space: <http://www.w3.org/ns/pim/space#> .
        <#me> space:storage </> .
        `,
        store,
        'https://alice.test/profile/card'
      );
      const storageStore = new StorageStore(store);
      const storage = storageStore.getStorageForWebId(
        'https://alice.test/profile/card#me'
      );
      expect(storage).toEqual(new Storage('https://alice.test/'));
    });
  });
});
