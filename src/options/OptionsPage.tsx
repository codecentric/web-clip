import {
  InMemoryStorage,
  IStorage,
  login,
  logout,
  Session,
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
import React from 'react';
import { useOptions } from './useOptions';

class ChromeRedirector implements IRedirector {
  constructor(private readonly redirectHandler: AggregateRedirectHandler) {}

  redirect(redirectUrl: string, options?: IRedirectorOptions) {
    chrome.identity.launchWebAuthFlow(
      {
        url: redirectUrl,
        interactive: true,
      },
      async (redirectUrl: string) => {
        console.log('auth callback', redirectUrl);
        const info = await this.redirectHandler.handle(redirectUrl, null);
        console.log({ info });
      }
    );
  }
}

export function getClientAuthenticationWithDependencies(dependencies: {
  secureStorage?: IStorage;
  insecureStorage?: IStorage;
}): ClientAuthentication {
  const inMemoryStorage = new InMemoryStorage();
  const secureStorage = dependencies.secureStorage || inMemoryStorage;
  const insecureStorage = dependencies.insecureStorage || new BrowserStorage();

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
      new ChromeRedirector(redirectHandler)
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

export const OptionsPage = () => {
  const { loading, providerUrl, setProviderUrl, save, saved } = useOptions();

  if (loading) {
    return <p>Loading...</p>;
  }
  const clientAuth = getClientAuthenticationWithDependencies({});

  const session = new Session({
    clientAuthentication: clientAuth,
  });

  return (
    <section>
      <h1>webclip options</h1>
      <button
        onClick={() => {
          session.login({
            redirectUrl: chrome.identity.getRedirectURL(),
            oidcIssuer: providerUrl,
            clientName: '...',
          });
        }}
      >
        LOGIN
      </button>
      <button onClick={() => alert(session.info.webId)}>Who am I</button>
      <button onClick={() => logout()}>LOGOUT</button>
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
