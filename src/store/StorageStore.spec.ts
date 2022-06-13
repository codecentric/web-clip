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
  describe('isContainer', () => {
    it('returns false if store is empty', () => {
      const store = graph();
      const storageStore = new StorageStore(store);
      const result = storageStore.isContainer('https://alice.test/public/');
      expect(result).toBe(false);
    });
    it('returns true if url identifies a container', () => {
      const store = graph();
      parse(
        `
         @prefix ldp: <http://www.w3.org/ns/ldp#> .
          <> a ldp:Container .
        `,
        store,
        'https://alice.test/public/'
      );
      const storageStore = new StorageStore(store);
      const result = storageStore.isContainer('https://alice.test/public/');
      expect(result).toBe(true);
    });
  });
});
