import {
  fetch as authenticatedFetch,
  login,
  Session,
} from '@inrupt/solid-client-authn-browser';
import * as rdf from 'rdflib';
import {
  Fetcher,
  IndexedFormula,
  NamedNode,
  st,
  sym,
  UpdateManager,
} from 'rdflib';
import solidNamespace from 'solid-namespace';
import { PageMetaData } from '../content/usePage';

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

  constructor(sessionInfo: SessionInfo, store: IndexedFormula) {
    this.sessionInfo = sessionInfo;
    this.me = sessionInfo.isLoggedIn ? sym(sessionInfo.webId) : null;
    this.store = store;
    this.fetcher = new Fetcher(this.store, { fetch: authenticatedFetch });
    this.updater = new UpdateManager(this.store);
    this.ns = solidNamespace(rdf);
  }

  login() {
    return login({
      oidcIssuer: 'https://solidcommunity.net', // TODO: read from plugin configuration?
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

  bookmark(page: PageMetaData) {
    const bookmarkUri = sym(
      'https://storage.example/webclip/2021/03/12/ee4fc42e-9d84-46f5-a3c1-3f9ef0f6faea#it'
    );
    return this.updater.update(
      [],
      [st(bookmarkUri, bookmarkUri, bookmarkUri, bookmarkUri)]
    );
  }
}
