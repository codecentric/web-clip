import {
  getDefaultSession,
  handleIncomingRedirect,
  Session,
} from '@inrupt/solid-client-authn-browser';
import { Fetcher, LiveStore, UpdateManager } from "rdflib";
import React from 'react';
import ReactDOM from 'react-dom';

import 'style-loader!../src/assets/content.css';
import { OptionsPage } from '../src/options/OptionsPage';
import { Options } from '../src/options/optionsStorageApi';
import { ProfileApi } from "../src/options/ProfileApi";
import { Session as ChromeExtensionSession } from '../src/solid-client-authn-chrome-ext/Session';

let inMemoryStorage = {
  providerUrl: '',
  trustedApp: false,
};

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
  const updater = new UpdateManager();
  const fetcher = new Fetcher(updater.store, { fetch: session.fetch });
  const profileApi = new ProfileApi(session, fetcher.store as LiveStore);
  ReactDOM.render(
    <OptionsPage
      profileApi={profileApi}
      session={session}
      redirectUrl={window.location.href}
      extensionUrl="chrome-extension://extension-id"
    />,
    root
  );
}
