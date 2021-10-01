import {
  getDefaultSession,
  handleIncomingRedirect,
  Session,
} from '@inrupt/solid-client-authn-browser';
import React from 'react';
import ReactDOM from 'react-dom';
import { PageContent } from '../src/content/PageContent';

import contentCss from '../src/assets/content.css';

import StorageChange = chrome.storage.StorageChange;
import AreaName = chrome.storage.AreaName;

chrome.storage = {
  onChanged: {
    addListener: (
      listener: (
        changes: { [p: string]: StorageChange },
        namespace: AreaName
      ) => void
    ): void => {
      listener(
        {
          providerUrl: {
            oldValue: '',
            newValue: 'https://solidcommunity.net',
          },
        },
        'sync'
      );
    },
  },
  sync: { get: (): null => null },
} as unknown as typeof chrome.storage;

async function handleRedirectAfterLogin() {
  await handleIncomingRedirect();
  return getDefaultSession();
}

handleRedirectAfterLogin().then((session: Session) => {
  renderApp(session);
});

const root = document.getElementById('webclip');
const shadowRoot = root.attachShadow({ mode: 'open' });
const container = document.createElement('div');
const styleTag = document.createElement('style');
styleTag.innerHTML = contentCss;
shadowRoot.appendChild(styleTag);
shadowRoot.appendChild(container);

function renderApp(session: Session) {
  ReactDOM.render(
    <PageContent
      close={() => alert('cannot close in dev mode')}
      sessionInfo={session.info}
    />,
    container
  );
}
