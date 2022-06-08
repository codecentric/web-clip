import { Session } from '@inrupt/solid-client-authn-browser';
import React from 'react';
import ReactDOM from 'react-dom';
import { ExtensionUrl } from '../../chrome/urls';
import { load as loadOptions } from '../../options/optionsStorageApi';
import { AuthorizationPage } from './AuthorizationPage';

async function handleRedirectAfterLogin() {
  const session = new Session({
    sessionInfo: {
      sessionId: 'webclip-auth-session',
      isLoggedIn: false,
    },
  });
  await session.handleIncomingRedirect();
  return session;
}

export async function renderAuthorizationPage(
  extensionUrl: ExtensionUrl,
  root: HTMLElement,
  container: HTMLElement
) {
  const session = await handleRedirectAfterLogin();

  const { providerUrl } = await loadOptions();

  console.log(
    'This is the WebClip authorization page for extension',
    extensionUrl
  );
  document.body.replaceChildren(root);
  ReactDOM.render(
    <AuthorizationPage
      session={session}
      providerUrl={providerUrl}
      extensionUrl={extensionUrl}
    />,
    container
  );
}
