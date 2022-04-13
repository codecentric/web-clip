import { ISessionInfo } from '@inrupt/solid-client-authn-browser';
import React from 'react';
import ReactDOM from 'react-dom';

import contentCss from './assets/content.css';
import { ChromeMessageListener } from './content/ChromeMessageListener';
import { WebClip } from './content/WebClip';
import { MessageType } from './messages';

const root = document.createElement('div');
root.id = 'webclip';
document.body.appendChild(root);
const shadowRoot = root.attachShadow({ mode: 'open' });
const container = document.createElement('div');
const styleTag = document.createElement('style');
styleTag.innerHTML = contentCss;
shadowRoot.appendChild(styleTag);
shadowRoot.appendChild(container);

const chromeMessageListener = new ChromeMessageListener();

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.type) {
    case MessageType.ACTIVATE: {
      const { providerUrl, ...sessionInfo } = request.payload;
      renderApp(sessionInfo, providerUrl);
      break;
    }
  }
  sendResponse();
});

function renderApp(sessionInfo: ISessionInfo, providerUrl: string) {
  ReactDOM.render(
    <WebClip
      chromeMessageListener={chromeMessageListener}
      close={unmountApp}
      sessionInfo={sessionInfo}
      providerUrl={providerUrl}
    />,
    container
  );
}

function unmountApp() {
  ReactDOM.unmountComponentAtNode(container);
}
