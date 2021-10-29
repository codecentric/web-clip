import {
  fetch as authenticatedFetch,
  login,
  Session,
} from '@inrupt/solid-client-authn-browser';
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
import { PageMetaData } from '../content/usePage';
import { subscribeOption } from '../options/optionsStorageApi';
import { Store } from '../store/Store';
import { generateDatePathForToday } from './generateDatePathForToday';
import { generateUuid } from './generateUuid';
import { now } from './now';

export type SessionInfo = Session['info'];

export interface Profile {
  name: string;
}

export interface Bookmark {
  uri: string;
}

function getIndex(storageUrl: string): NamedNode {
  return sym(urlJoin(storageUrl, 'webclip', 'index.ttl'));
}

export class SolidApi {
  private readonly me: NamedNode;
  private readonly sessionInfo: SessionInfo;
  private readonly store: Store;

  /**
   * @deprecated Use this.store instead
   * @private
   */
  private readonly graph: IndexedFormula;
  private readonly fetcher: Fetcher;
  private readonly updater: UpdateManager;
  private readonly ns: Record<string, (alias: string) => NamedNode>;
  private providerUrl: string;

  constructor(sessionInfo: SessionInfo, store: Store) {
    subscribeOption('providerUrl', (value) => {
      this.providerUrl = value;
    });
    this.sessionInfo = sessionInfo;
    this.me = sessionInfo.isLoggedIn ? sym(sessionInfo.webId) : null;
    this.store = store;
    this.graph = store.getGraph();
    this.fetcher = new Fetcher(this.graph, { fetch: authenticatedFetch });
    this.updater = new UpdateManager(this.graph);
    this.ns = solidNamespace(rdf);
  }

  async login() {
    if (!this.providerUrl) {
      throw new Error('No pod provider URL configured');
    }
    return login({
      oidcIssuer: this.providerUrl,
      redirectUrl: window.location.href,
    });
  }

  async loadProfile(): Promise<Profile> {
    if (!this.me) {
      throw new Error('No user is logged in.');
    }
    await this.fetcher.load(this.me);
    return this.getProfile();
  }

  private getProfile(): Profile {
    const name: string =
      this.graph.anyValue(this.me, this.ns.vcard('fn')) || 'Anonymous';
    return { name };
  }

  async bookmark(page: PageMetaData): Promise<Bookmark> {
    const storageUrl = this.getStorageUrl();

    const clip = sym(
      urlJoin(
        storageUrl,
        'webclip',
        generateDatePathForToday(),
        generateUuid(),
        '#it'
      )
    );

    const index = getIndex(storageUrl);

    await this.savePageData(clip, page);
    await this.updateIndex(index, clip, page);

    return { uri: clip.uri };
  }

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
    const index = getIndex(this.getStorageUrl());
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
