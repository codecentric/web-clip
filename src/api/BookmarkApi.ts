import * as rdf from 'rdflib';
import {
  Fetcher,
  IndexedFormula,
  lit,
  NamedNode,
  st,
  Statement,
  sym,
  UpdateManager,
} from 'rdflib';
import solidNamespace from 'solid-namespace';
import urlJoin from 'url-join';
import { Bookmark } from '../domain/Bookmark';
import { PageMetaData } from '../domain/PageMetaData';
import { OptionsStorage } from '../options/OptionsStorage';
import { BookmarkStore } from '../store/BookmarkStore';
import { generateDatePathForToday } from './generateDatePathForToday';
import { generateUuid } from './generateUuid';
import { now } from './now';
import { SolidSession } from './SolidSession';

export interface Profile {
  name: string;
}

function getIndex(containerUrl: string): NamedNode {
  return sym(urlJoin(containerUrl, 'index.ttl'));
}

export class BookmarkApi {
  private readonly me: NamedNode;
  private readonly store: BookmarkStore;

  /**
   * @deprecated Use this.store instead
   * @private
   */
  private readonly graph: IndexedFormula;
  private readonly fetcher: Fetcher;
  private readonly updater: UpdateManager;
  private readonly ns: Record<string, (alias: string) => NamedNode>;

  private readonly optionsStorage: OptionsStorage;

  constructor(
    session: SolidSession,
    store: BookmarkStore,
    optionsStorage: OptionsStorage
  ) {
    this.me = session.info.isLoggedIn ? sym(session.info.webId) : null;
    this.store = store;
    this.graph = store.getGraph();
    this.fetcher = new Fetcher(this.graph, { fetch: session.fetch });
    this.updater = new UpdateManager(this.graph);
    this.ns = solidNamespace(rdf);
    this.optionsStorage = optionsStorage;
  }

  /**
   * @deprecated TODO: move to ProfileApi
   */
  async loadProfile(): Promise<Profile> {
    if (!this.me) {
      throw new Error('No user is logged in.');
    }
    await this.fetcher.load(this.me);
    return this.getProfile();
  }

  /**
   * @deprecated TODO: move to ProfileApi
   */
  private getProfile(): Profile {
    const name: string =
      this.graph.anyValue(this.me, this.ns.vcard('fn')) || 'Anonymous';
    return { name };
  }

  async bookmark(page: PageMetaData, existing?: Bookmark): Promise<Bookmark> {
    const containerUrl = this.getContainerUrl();

    const clip = existing
      ? sym(existing.uri)
      : sym(
          urlJoin(
            containerUrl,
            generateDatePathForToday(),
            generateUuid(),
            '#it'
          )
        );

    await this.savePageData(clip, page);

    if (!existing) {
      const index = getIndex(containerUrl);
      await this.updateIndex(index, clip, page);
    }

    return { uri: clip.uri };
  }

  private getContainerUrl() {
    const { containerUrl } = this.optionsStorage.getOptions();
    if (!containerUrl) {
      const storageUrl = this.getStorageUrl();
      return urlJoin(storageUrl, 'webclip');
    }
    return containerUrl;
  }

  /**
   * @deprecated legacy method to determine storage,
   * if no container url has been configured during setup
   */
  private getStorageUrl() {
    const storageUrl = this.graph.anyValue(this.me, this.ns.space('storage'));
    if (!storageUrl) {
      throw new Error('No storage available.');
    }
    return storageUrl;
  }

  private async savePageData(clip: NamedNode, page: PageMetaData) {
    const a = this.ns.rdf('type');
    const BookmarkAction = this.ns.schema('BookmarkAction');
    const pageUrl = sym(page.url);
    const document = clip.doc();
    const WebPage = this.ns.schema('WebPage');
    const about: Statement[] = this.store.createRelations(pageUrl, document);

    const insertions = [
      st(clip, a, BookmarkAction, document),
      st(clip, this.ns.schema('startTime'), schemaDateTime(now()), document),
      st(clip, this.ns.schema('object'), pageUrl, document),
      st(pageUrl, a, WebPage, document),
      st(pageUrl, this.ns.schema('url'), pageUrl, document),
      st(pageUrl, this.ns.schema('name'), lit(page.name), document),
      ...about,
    ];

    await this.updater.update([], insertions);
  }

  private async updateIndex(
    index: NamedNode,
    it: NamedNode,
    page: PageMetaData
  ) {
    const a = this.ns.rdf('type');
    const BookmarkAction = this.ns.schema('BookmarkAction');
    const pageUrl = sym(page.url);

    const indexUpdate = [
      st(it, a, BookmarkAction, index),
      st(it, this.ns.schema('object'), pageUrl, index),
    ];

    await this.updater.update([], indexUpdate);
  }

  async loadBookmark(page: PageMetaData): Promise<Bookmark> {
    const index = getIndex(this.getContainerUrl());
    try {
      await this.fetcher.load(index);
    } catch (err) {
      // no index found, that's ok
    }
    const bookmarkNode = this.store.getIndexedBookmark(sym(page.url), index);
    return bookmarkNode ? { uri: bookmarkNode.value } : null;
  }
}

function schemaDateTime(date: Date) {
  return lit(date.toISOString(), null, sym('http://schema.org/DateTime'));
}
