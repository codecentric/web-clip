import {
  ILoginInputOptions,
  InMemoryStorage,
  ISessionInfo,
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

export class ChromeExtensionRedirector implements IRedirector {
  constructor(
    private readonly redirectHandler: AggregateRedirectHandler,
    private readonly afterRedirect: (
      info: ISessionInfo & { fetch: typeof fetch }
    ) => void
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

export type RedirectInfo = ISessionInfo & { fetch: typeof fetch };

export function getClientAuthentication(
  redirectCallback: (info: RedirectInfo) => void
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

export class ChromeExtensionSession {
  private clientAuthentication: ClientAuthentication;
  public fetch: typeof fetch = window.fetch.bind(window);
  public info: ISessionInfo = {
    isLoggedIn: false,
    sessionId: '690a9751-1dc4-46bc-a775-ec12eb5b06ec', // just generate a random uuid
  };

  constructor() {
    this.clientAuthentication = getClientAuthentication((info) => {
      this.info = info;
      this.fetch = info.fetch;
    });
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
    this.fetch = window.fetch.bind(window);
  }
}
