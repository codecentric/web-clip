import {
  getDefaultSession,
  handleIncomingRedirect,
  Session,
} from '@inrupt/solid-client-authn-browser';
import React from 'react';
import ReactDOM from 'react-dom';
import { PageContent } from '../src/content/PageContent';

import '../src/assets/content.css';
import StorageChange = chrome.storage.StorageChange;
import AreaName = chrome.storage.AreaName;

chrome.storage = ({
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
} as unknown) as typeof chrome.storage;

async function handleRedirectAfterLogin() {
  await handleIncomingRedirect();
  return getDefaultSession();
}

handleRedirectAfterLogin().then((session: Session) => {
  renderApp(session);
});

function renderApp(session: Session) {
  ReactDOM.render(
    <PageContent
      close={() => alert('cannot close in dev mode')}
      sessionInfo={session.info}
    />,
    document.getElementById('webclip')
  );
}
