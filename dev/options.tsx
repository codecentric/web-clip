import {
  getDefaultSession,
  handleIncomingRedirect,
  Session,
} from '@inrupt/solid-client-authn-browser';
import React from 'react';
import ReactDOM from 'react-dom';

import 'style-loader!../src/assets/content.css';
import { OptionsPage } from '../src/options/OptionsPage';
import { Options } from '../src/options/optionsStorageApi';
import { Session as ChromeExtensionSession } from '../src/solid-client-authn-chrome-ext/Session';

let inMemoryStorage = {
  providerUrl: '',
  trustedApp: false,
};

chrome.runtime = {
  id: 'fake-extension-id',
  onMessage: {
    addListener: () => {
      return;
    },
  },
} as unknown as typeof chrome.runtime;

chrome.storage = {
  sync: {
    get: (defaultOptions: Options, callback: (options: Options) => void) => {
      callback(inMemoryStorage);
    },
    set: (options: Options, callback: (options: Options) => void) => {
      inMemoryStorage = {
        ...inMemoryStorage,
        ...options,
      };
      callback(inMemoryStorage);
    },
  },
} as unknown as typeof chrome.storage;

chrome.identity = {
  getRedirectURL: () => window.location.href,
} as unknown as typeof chrome.identity;

chrome.extension = {
  getURL: (path: string) => `chrome-extension://fake-extension-id${path}`,
} as unknown as typeof chrome.extension;

const root = document.getElementById('root');

async function handleRedirectAfterLogin() {
  await handleIncomingRedirect();
  return getDefaultSession();
}

handleRedirectAfterLogin().then((session: Session) => {
  console.log({ session });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: this dev environment is no chrome extension, so we use regular browser session here
  renderApp(session);
});

function renderApp(session: ChromeExtensionSession) {
  ReactDOM.render(<OptionsPage session={session} />, root);
}
