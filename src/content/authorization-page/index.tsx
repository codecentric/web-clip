import {
  getDefaultSession,
  handleIncomingRedirect,
} from '@inrupt/solid-client-authn-browser';
import React from 'react';
import ReactDOM from 'react-dom';
import { load as loadOptions } from '../../options/optionsStorageApi';
import { AuthorizationPage } from './AuthorizationPage';

async function handleRedirectAfterLogin() {
  await handleIncomingRedirect();
  return getDefaultSession();
}

export async function renderAuthorizationPage(
  extensionId: string,
  root: HTMLElement,
  container: HTMLElement
) {
  const session = await handleRedirectAfterLogin();

  const { providerUrl } = await loadOptions();

  console.log(
    'This is the WebClip authorization page for extension id',
    extensionId
  );
  document.body.replaceChildren(root);
  ReactDOM.render(
    <AuthorizationPage
      session={session}
      providerUrl={providerUrl}
      extensionId={extensionId}
    />,
    container
  );
}
