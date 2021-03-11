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
} from '@inrupt/solid-client-authn-browser';

export class SolidApi {
  private readonly store: IndexedFormula;
  private readonly fetcher: Fetcher;
  private readonly updater: UpdateManager;
  private readonly ns: Record<string, (alias: string) => NamedNode>;

  constructor() {
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

  bookmark(page: PageMetaData): void {
    console.log('bookmark', page);
  }
}
