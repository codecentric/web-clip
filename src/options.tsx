import React from 'react';
import ReactDOM from 'react-dom';
import { OptionsPage } from './options/OptionsPage';

import 'style-loader!./assets/options.css';
import { Session } from './solid-client-authn-chrome-ext/Session';

console.log('You are in the options!');

const extensionUrl = chrome.extension.getURL('').slice(0, -1);

const session = new Session();

ReactDOM.render(
  <OptionsPage session={session} extensionUrl={extensionUrl} />,
  document.getElementById('root')
);
