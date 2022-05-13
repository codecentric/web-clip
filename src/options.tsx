import { Fetcher, graph, LiveStore, UpdateManager } from 'rdflib';
import React from 'react';
import ReactDOM from 'react-dom';

import 'style-loader!./assets/options.css';
import { OptionsPage } from './options/OptionsPage';
import { ProfileApi } from './options/api/ProfileApi';
import { Session } from './solid-client-authn-chrome-ext/Session';

console.log('You are in the options!');

const extensionUrl = chrome.extension.getURL('').slice(0, -1);

const session = new Session();
const store = graph();
new UpdateManager(store);
new Fetcher(store, { fetch: session.fetch });
const profileApi = new ProfileApi(session, store as LiveStore);

ReactDOM.render(
  <OptionsPage
    session={session}
    redirectUrl={chrome.identity.getRedirectURL()}
    extensionUrl={extensionUrl}
    profileApi={profileApi}
  />,
  document.getElementById('root')
);
