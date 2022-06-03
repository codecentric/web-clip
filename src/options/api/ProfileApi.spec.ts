import { when } from 'jest-when';
import { Fetcher, graph, LiveStore, UpdateManager } from 'rdflib';
import { Session } from '../../solid-client-authn-chrome-ext/Session';
import { thenSparqlUpdateIsSentToUrl } from '../../test/thenSparqlUpdateIsSentToUrl';
import { ProfileApi } from './ProfileApi';

describe('ProfileApi', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('hasGrantedAccessTo', () => {
    it('returns false if fetched user profile does not contain trusted app', async () => {
      const fetchMock = jest.fn();
      when(fetchMock)
        .calledWith('https://pod.test/alice', expect.anything())
        .mockResolvedValue(
          turtleResponse(`
          <https://pod.example/#me>
            <http://www.w3.org/2006/vcard/ns#fn> "Solid User" .
          `)
        );

      const session = {
        info: {
          webId: 'https://pod.test/alice#me',
        },
      } as Session;
      const updater = new UpdateManager();
      const fetcher = new Fetcher(updater.store, { fetch: fetchMock });
      const profileApi = new ProfileApi(session, fetcher.store as LiveStore);
      const result = await profileApi.canExtensionAccessPod(
        'chrome-extension://extension-id',
        'https://extension-id.chromiumapp.org'
      );
      expect(result).toBe(false);
    });

    it('returns true if fetched user profile contains trusted app', async () => {
      const session = {
        info: {
          webId: 'https://pod.test/alice#me',
        },
      } as Session;

      const fetchMock = jest.fn();
      when(fetchMock)
        .calledWith('https://pod.test/alice', expect.anything())
        .mockResolvedValue(
          turtleResponse(`
        @prefix acl: <http://www.w3.org/ns/auth/acl#> .
        <https://pod.test/alice#me> acl:trustedApp [
          acl:origin <chrome-extension://extension-id> ;
          acl:mode acl:Read, acl:Write, acl:Append ;
        ] .
        `)
        );

      const store = graph();
      new Fetcher(store, { fetch: fetchMock });
      const profileApi = new ProfileApi(session, store as LiveStore);
      const result = await profileApi.canExtensionAccessPod(
        'chrome-extension://extension-id',
        'https://extension-id.chromiumapp.org'
      );
      expect(result).toBe(true);
    });
  });

  describe('grantAccessTo', () => {
    it('adds extension URL as trusted ap', async () => {
      const fetchMock = jest.fn();
      when(fetchMock)
        .calledWith('https://pod.test/alice', expect.anything())
        .mockResolvedValue(turtleResponse(''));
      const session = {
        info: {
          webId: 'https://pod.test/alice#me',
        },
      } as Session;
      const updater = new UpdateManager();
      const fetcher = new Fetcher(updater.store, { fetch: fetchMock });
      const profileApi = new ProfileApi(session, fetcher.store as LiveStore);
      await profileApi.grantAccessTo('chrome://extension-id');
      thenSparqlUpdateIsSentToUrl(
        fetchMock,
        'https://pod.test/alice',
        `
      INSERT DATA {
        <https://pod.test/alice#me> <http://www.w3.org/ns/auth/acl#trustedApp> <https://pod.test/alice#trust-webclip> .
        <https://pod.test/alice#trust-webclip>
          <http://www.w3.org/ns/auth/acl#origin> <chrome://extension-id> ;
          <http://www.w3.org/ns/auth/acl#mode>
            <http://www.w3.org/ns/auth/acl#Read>,
            <http://www.w3.org/ns/auth/acl#Write>,
            <http://www.w3.org/ns/auth/acl#Append> ;
         .
      }`
      );
    });
  });
});

function turtleResponse(bodyText: string) {
  return {
    ok: true,
    headers: new Headers({
      'Content-Type': 'text/turtle',
      'wac-allow': 'user="read write append control",public=""',
      'ms-author-via': 'SPARQL',
    }),
    status: 200,
    statusText: 'OK',
    text: async () => bodyText,
  };
}
