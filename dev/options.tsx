import React from 'react';
import ReactDOM from 'react-dom';
import { OptionsPage } from '../src/options/OptionsPage';

import 'style-loader!../src/assets/content.css';
import { Options } from '../src/options/optionsStorageApi';

let inMemoryStorage = {
  providerUrl: '',
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

ReactDOM.render(
  <OptionsPage extensionUrl="chrome-extension://extension-id" />,
  root
);
