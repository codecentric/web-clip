import {
  Fetcher,
  IndexedFormula,
  UpdateManager,
  graph,
  NamedNode,
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

interface Profile {
  name: string;
}

export class SolidApi {
  private readonly sessionInfo: SessionInfo;
  private readonly store: IndexedFormula;
  private readonly fetcher: Fetcher;
  private readonly updater: UpdateManager;
  private readonly ns: Record<string, (alias: string) => NamedNode>;

  constructor(sessionInfo: SessionInfo) {
    this.sessionInfo = sessionInfo;
    this.store = graph();
    this.fetcher = new Fetcher(this.store, { fetch: authenticatedFetch });
    this.updater = new UpdateManager(this.store);
    this.ns = solidNamespace(rdf);
  }

  login() {
    return login({
      oidcIssuer: 'https://solidcommunity.net', // TODO: read from plugin configuration?
      redirectUrl: window.location.href,
    })
      .then(() => this.fetcher.load('https://mypod/profile'))
      .catch((e) => console.log(e)); //?
  }

  getProfile(): Profile {
    return { name: 'Solid User' };
  }

  bookmark(page: PageMetaData): void {
    console.log('bookmark', page);
  }
}
