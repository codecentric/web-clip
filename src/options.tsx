import React from 'react';
import ReactDOM from 'react-dom';
import { OptionsPage } from './options/OptionsPage';

import './assets/options.css';

console.log('You are in the options!');

const extensionUrl = chrome.extension.getURL('').slice(0, -1);

ReactDOM.render(
  <OptionsPage extensionUrl={extensionUrl} />,
  document.getElementById('root')
);
