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
import { generateDatePathForToday } from './generateDatePathForToday';
import { generateUuid } from './generateUuid';
import { now } from './now';
import { relatedStatements } from '../store/relatedStatements';

export type SessionInfo = Session['info'];

export interface Profile {
  name: string;
}

export class SolidApi {
  private readonly me: NamedNode;
  private readonly sessionInfo: SessionInfo;
  private readonly store: IndexedFormula;
  private readonly fetcher: Fetcher;
  private readonly updater: UpdateManager;
  private readonly ns: Record<string, (alias: string) => NamedNode>;
  private providerUrl: string;

  constructor(sessionInfo: SessionInfo, store: IndexedFormula) {
    subscribeOption('providerUrl', (value) => {
      this.providerUrl = value;
    });
    this.sessionInfo = sessionInfo;
    this.me = sessionInfo.isLoggedIn ? sym(sessionInfo.webId) : null;
    this.store = store;
    this.fetcher = new Fetcher(this.store, { fetch: authenticatedFetch });
    this.updater = new UpdateManager(this.store);
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
      this.store.anyValue(this.me, this.ns.vcard('fn')) || 'Anonymous';
    return { name };
  }

  async bookmark(page: PageMetaData) {
    const storageUrl = this.store.anyValue(this.me, this.ns.space('storage'));

    if (!storageUrl) {
      throw new Error('No storage available.');
    }

    const it = sym(
      urlJoin(
        storageUrl,
        'webclip',
        generateDatePathForToday(),
        generateUuid(),
        '#it'
      )
    );
    const a = this.ns.rdf('type');
    const BookmarkAction = this.ns.schema('BookmarkAction');
    const document = it.doc();
    const pageUrl = sym(page.url);
    const WebPage = this.ns.schema('WebPage');

    const about: Statement[] = relatedStatements(this.store, pageUrl, document);

    const insertions = [
      st(it, a, BookmarkAction, document),
      st(it, this.ns.schema('startTime'), schemaDateTime(now()), document),
      st(it, this.ns.schema('object'), pageUrl, document),
      st(pageUrl, a, WebPage, document),
      st(pageUrl, this.ns.schema('url'), pageUrl, document),
      st(pageUrl, this.ns.schema('name'), lit(page.name), document),
    ];
    if (about.length > 0) {
      insertions.push(
        st(pageUrl, this.ns.schema('about'), about[0].subject, document)
      );
      insertions.push(...about);
    }
    return this.updater.update([], insertions);
  }
}

function schemaDateTime(date: Date) {
  return lit(date.toISOString(), null, sym('http://schema.org/DateTime'));
}
