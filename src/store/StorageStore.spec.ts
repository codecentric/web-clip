import { graph, parse, st, sym } from 'rdflib';
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

  describe('isStorage', () => {
    it('returns false if store is empty', () => {
      const store = graph();
      const storageStore = new StorageStore(store);
      const result = storageStore.isStorage('https://alice.test/public/');
      expect(result).toBe(false);
    });
    it('returns true if url identifies a storage', () => {
      const store = graph();
      parse(
        `
         @prefix space: <http://www.w3.org/ns/pim/space#> .
          <> a space:Storage .
        `,
        store,
        'https://alice.test/public/'
      );
      const storageStore = new StorageStore(store);
      const result = storageStore.isStorage('https://alice.test/public/');
      expect(result).toBe(true);
    });
  });
  describe('createIndexDocumentStatement', () => {
    it('creates a single statement to describe the index document', () => {
      const store = graph();
      const storageStore = new StorageStore(store);
      const result = storageStore.createIndexDocumentStatement(
        'https://alice.test/public/'
      );
      expect(result).toEqual([
        st(
          sym('https://alice.test/public/index.ttl'),
          sym('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
          sym('http://www.w3.org/ns/ldp#Resource'),
          sym('https://alice.test/public/index.ttl')
        ),
      ]);
    });
  });
});
