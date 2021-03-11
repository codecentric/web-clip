import {
  Fetcher,
  IndexedFormula,
  UpdateManager,
  graph,
  NamedNode,
  sym,
} from 'rdflib';
import * as rdf from 'rdflib';
import solidNamespace from 'solid-namespace';
import { PageMetaData } from '../content/usePage';
import {
  fetch as authenticatedFetch,
  login,
  Session,
} from '@inrupt/solid-client-authn-browser';

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

  constructor(sessionInfo: SessionInfo) {
    this.sessionInfo = sessionInfo;
    this.me = sessionInfo.isLoggedIn ? sym(sessionInfo.webId) : null;
    this.store = graph();
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

  bookmark(page: PageMetaData): void {
    console.log('bookmark', page);
  }
}
