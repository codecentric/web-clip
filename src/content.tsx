import {
  getDefaultSession,
  handleIncomingRedirect,
  Session,
} from '@inrupt/solid-client-authn-browser';
import React from 'react';
import ReactDOM from 'react-dom';
import { ChromeMessageListener } from './content/ChromeMessageListener';
import { PageContent } from './content/PageContent';
import { WebClip } from './content/WebClip';
import { MessageType } from './messages';

import contentCss from './assets/content.css';

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

async function handleRedirectAfterLogin() {
  await handleIncomingRedirect();
  return getDefaultSession();
}

handleRedirectAfterLogin().then((session: Session) => {
  if (session.info.isLoggedIn) {
    renderApp(session);
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.type) {
    case MessageType.ACTIVATE:
      renderApp(getDefaultSession());
      break;
  }
  sendResponse();
});

function renderApp(session: Session) {
  ReactDOM.render(
    <WebClip
      chromeMessageListener={chromeMessageListener}
      close={unmountApp}
      legacySession={session}
    />,
    container
  );
}

function unmountApp() {
  ReactDOM.unmountComponentAtNode(container);
}
