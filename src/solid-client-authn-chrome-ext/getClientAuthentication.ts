/*
 * Copyright 2022 Inrupt Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
 * Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { InMemoryStorage } from '@inrupt/solid-client-authn-browser';
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
  ChromeExtensionRedirector,
  RedirectInfo,
} from './ChromeExtensionRedirector';

/**
 *
 * This is basically a copy of the getClientAuthenticationWithDependencies of solid-client-authn-js by Inrupt Inc.,
 * provided under the license at the top of this file.
 *
 * original code see https://github.com/inrupt/solid-client-authn-js/blob/main/packages/node/src/dependencies.ts#L108
 *
 * This functions creates a slightly customized version of the ClientAuthentication, that uses a
 * ChromeExtensionRedirector instead of the default one and is therefore able to handle redirects in chrome
 * extensions
 *
 * @param redirectCallback
 */
export function getClientAuthentication(
  redirectCallback: (info: RedirectInfo, error?: Error) => void
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
