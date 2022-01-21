import {
  ILoginInputOptions,
  InMemoryStorage,
  ISessionInfo,
  logout,
} from '@inrupt/solid-client-authn-browser';
import ClientAuthentication from '@inrupt/solid-client-authn-browser/dist/ClientAuthentication';
import ClientRegistrar from '@inrupt/solid-client-authn-browser/dist/login/oidc/ClientRegistrar';
import IssuerConfigFetcher from '@inrupt/solid-client-authn-browser/dist/login/oidc/IssuerConfigFetcher';
import AuthorizationCodeWithPkceOidcHandler from '@inrupt/solid-client-authn-browser/dist/login/oidc/oidcHandlers/AuthorizationCodeWithPkceOidcHandler';
import OidcLoginHandler from '@inrupt/solid-client-authn-browser/dist/login/oidc/OidcLoginHandler';
import AggregateRedirectHandler from '@inrupt/solid-client-authn-browser/dist/login/oidc/redirectHandler/AggregateRedirectHandler';
import { AuthCodeRedirectHandler } from '@inrupt/solid-client-authn-browser/dist/login/oidc/redirectHandler/AuthCodeRedirectHandler';
import { ErrorOidcHandler } from '@inrupt/solid-client-authn-browser/dist/login/oidc/redirectHandler/ErrorOidcHandler';
import { FallbackRedirectHandler } from '@inrupt/solid-client-authn-browser/dist/login/oidc/redirectHandler/FallbackRedirectHandler';
import TokenRefresher from '@inrupt/solid-client-authn-browser/dist/login/oidc/refresh/TokenRefresher';
import GeneralLogoutHandler from '@inrupt/solid-client-authn-browser/dist/logout/GeneralLogoutHandler';
import { SessionInfoManager } from '@inrupt/solid-client-authn-browser/dist/sessionInfo/SessionInfoManager';
import BrowserStorage from '@inrupt/solid-client-authn-browser/dist/storage/BrowserStorage';
import StorageUtilityBrowser from '@inrupt/solid-client-authn-browser/dist/storage/StorageUtility';
import {
  IRedirector,
  IRedirectorOptions,
} from '@inrupt/solid-client-authn-core';
import React, { useState } from 'react';
import { useOptions } from './useOptions';

class ChromeExtensionRedirector implements IRedirector {
  constructor(
    private readonly redirectHandler: AggregateRedirectHandler,
    private readonly afterRedirect: (info: ISessionInfo) => void
  ) {}

  redirect(redirectUrl: string, options?: IRedirectorOptions) {
    chrome.identity.launchWebAuthFlow(
      {
        url: redirectUrl,
        interactive: true,
      },
      async (redirectUrl: string) => {
        console.log('auth callback', redirectUrl);
        // no real redirect happens in extension, so we can directly call the redirector from the callback
        const info = await this.redirectHandler.handle(redirectUrl, null);
        // pass the retrieved session info from the redirect handler
        this.afterRedirect(info);
        console.log({ info });
      }
    );
  }
}

export function getClientAuthentication(
  redirectCallback: (info: ISessionInfo) => void
): ClientAuthentication {
  const secureStorage = new InMemoryStorage();
  const insecureStorage = new BrowserStorage();

  const storageUtility = new StorageUtilityBrowser(
    secureStorage,
    insecureStorage
  );

  const issuerConfigFetcher = new IssuerConfigFetcher(storageUtility);
  const clientRegistrar = new ClientRegistrar(storageUtility);

  const sessionInfoManager = new SessionInfoManager(storageUtility);

  const tokenRefresher = new TokenRefresher(
    storageUtility,
    issuerConfigFetcher,
    clientRegistrar
  );

  // make new handler for redirect and login
  const redirectHandler = new AggregateRedirectHandler([
    new ErrorOidcHandler(),
    new AuthCodeRedirectHandler(
      storageUtility,
      sessionInfoManager,
      issuerConfigFetcher,
      clientRegistrar,
      tokenRefresher
    ),
    // This catch-all class will always be able to handle the
    // redirect IRI, so it must be registered last.
    new FallbackRedirectHandler(),
  ]);

  const loginHandler = new OidcLoginHandler(
    storageUtility,
    new AuthorizationCodeWithPkceOidcHandler(
      storageUtility,
      // custom redirector to honor chrome extension specific handling of auth flow
      new ChromeExtensionRedirector(redirectHandler, redirectCallback)
    ),
    issuerConfigFetcher,
    clientRegistrar
  );

  return new ClientAuthentication(
    loginHandler,
    redirectHandler,
    new GeneralLogoutHandler(sessionInfoManager),
    sessionInfoManager,
    issuerConfigFetcher
  );
}

class ChromeExtensionSession {
  private clientAuthentication: ClientAuthentication;
  public info: ISessionInfo = {
    isLoggedIn: false,
    sessionId: 'f5316878-09bc-4cbd-9bb5-493acbc0aab1', // just generate a random uuid
  };

  constructor() {
    this.clientAuthentication = getClientAuthentication(
      (info) => (this.info = info)
    );
  }

  async login(options: ILoginInputOptions) {
    await this.clientAuthentication.login(
      {
        sessionId: this.info.sessionId,
        ...options,
        // Defaults the token type to DPoP
        tokenType: options.tokenType ?? 'DPoP',
      },
      null
    );
  }

  async logout() {
    await this.clientAuthentication.logout(this.info.sessionId);
    this.info.isLoggedIn = false;
    this.info.webId = '';
  }
}

const session = new ChromeExtensionSession();

export const OptionsPage = () => {
  const { loading, providerUrl, setProviderUrl, save, saved } = useOptions();

  const [webId, setWebId] = useState('');

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <section>
      <h1>webclip options</h1>
      <button
        onClick={() => {
          session.login({
            redirectUrl: chrome.identity.getRedirectURL(),
            oidcIssuer: providerUrl,
            clientName: 'WebClip Options',
          });
        }}
      >
        LOGIN
      </button>
      <button onClick={() => setWebId(session.info.webId)}>Who am I</button>
      <div>{webId}</div>
      <button onClick={() => session.logout()}>LOGOUT</button>
      <p>
        Please configure the URL for your Solid pod provider, to enable webclip
        to save clips in your pod.
      </p>
      <p>
        For more information on how to create your own pod, please visit{' '}
        <a href="https://solidproject.org/users/get-a-pod">the Solid Project</a>{' '}
        or just create a pod on{' '}
        <a href="https://solidcommunity.net/register">solidcommunity.net</a>
      </p>
      <label>
        <p>Pod Provider URL</p>
        <input
          onChange={(e) => setProviderUrl(e.target.value)}
          value={providerUrl}
          type="url"
          required
        />
      </label>
      <button onClick={save}>Save</button>
      {saved && <p>URL was saved</p>}
    </section>
  );
};
