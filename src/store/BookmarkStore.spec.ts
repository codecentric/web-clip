import { graph, sym } from 'rdflib';
import { givenStoreContaining } from '../test/givenStoreContaining';
import { BookmarkStore } from './BookmarkStore';

describe('BookmarkStore', () => {
  describe('getIndexedBookmark', () => {
    it('does not find index bookmark in empty store', () => {
      const store = new BookmarkStore(graph());
      const result = store.getIndexedBookmark(
        sym('https://page.test'),
        sym('https://pod.example/webclip/index.ttl')
      );
      expect(result).toBeNull();
    });

    it('does not find bookmark, if it is not present in index', () => {
      const rdfGraph = givenStoreContaining(
        'https://pod.example/webclip/index.ttl',
        `
          @prefix schema: <http://schema.org/> .
          
          <http://storage.example/webclip/irrelevant#it> a schema:BookmarkAction; schema:object <https://irrelevant.example> .
        `
      );
      const store = new BookmarkStore(rdfGraph);
      const result = store.getIndexedBookmark(
        sym('https://page.test'),
        sym('https://pod.example/webclip/index.ttl')
      );
      expect(result).toBeNull();
    });

    it('finds the bookmark, if it is present in index', () => {
      const rdfGraph = givenStoreContaining(
        'https://pod.example/webclip/index.ttl',
        `
          @prefix schema: <http://schema.org/> .
          
          <http://storage.example/webclip/relevant#it> a schema:BookmarkAction; schema:object <https://page.test> .
        `
      );
      const store = new BookmarkStore(rdfGraph);
      const result = store.getIndexedBookmark(
        sym('https://page.test'),
        sym('https://pod.example/webclip/index.ttl')
      );
      expect(result).toEqual(sym('http://storage.example/webclip/relevant#it'));
    });

    it('does not find bookmark, if the page is not linked by schema:object', () => {
      const rdfGraph = givenStoreContaining(
        'https://pod.example/webclip/index.ttl',
        `
          @prefix schema: <http://schema.org/> .
          
          <http://storage.example/webclip/irrelevant#it> a schema:BookmarkAction; schema:irrelevant <https://page.test> .
        `
      );
      const store = new BookmarkStore(rdfGraph);
      const result = store.getIndexedBookmark(
        sym('https://page.test'),
        sym('https://pod.example/webclip/index.ttl')
      );
      expect(result).toBeNull();
    });

    it('only finds bookmarks within index document', () => {
      const rdfGraph = givenStoreContaining(
        'https://pod.example/somewhere/else.ttl',
        `
          @prefix schema: <http://schema.org/> .
          
          <http://storage.example/webclip/irrelevant#it> a schema:BookmarkAction; schema:object <https://page.test> .
        `
      );
      const store = new BookmarkStore(rdfGraph);
      const result = store.getIndexedBookmark(
        sym('https://page.test'),
        sym('https://pod.example/webclip/index.ttl')
      );
      expect(result).toBeNull();
    });
  });

  it('does not find bookmark, if it is not a schema:BookmarkAction', () => {
    const rdfGraph = givenStoreContaining(
      'https://pod.example/webclip/index.ttl',
      `
          @prefix schema: <http://schema.org/> .
          
          <http://storage.example/webclip/irrelevant#it> a schema:WatchAction; schema:object <https://page.test> .
        `
    );
    const store = new BookmarkStore(rdfGraph);
    const result = store.getIndexedBookmark(
      sym('https://page.test'),
      sym('https://pod.example/webclip/index.ttl')
    );
    expect(result).toBeNull();
  });
});
