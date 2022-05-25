import React from 'react';
import ReactDOM from 'react-dom';

import 'style-loader!./assets/options.css';
import { ChromeExtensionOptionsPage } from './options/ChromeExtensionOptionsPage';
import { Session } from './solid-client-authn-chrome-ext/Session';

console.log('You are in the options!');

const session = new Session();

ReactDOM.render(
  <ChromeExtensionOptionsPage session={session} />,
  document.getElementById('root')
);
