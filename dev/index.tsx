import {
  getDefaultSession,
  handleIncomingRedirect,
  Session,
} from '@inrupt/solid-client-authn-browser';
import React from 'react';
import ReactDOM from 'react-dom';

import contentCss from '../src/assets/content.css';
import { createMessageHandler } from '../src/background/createMessageHandler';
import { MessageHandler } from '../src/background/MessageHandler';
import { PageContent } from '../src/content/PageContent';

let handler: MessageHandler;

chrome.runtime = {
  onMessage: () => {
    return '';
  },
  sendMessage: async (message: any, sendResponse: any) => {
    const result = await handler.handleMessage(message, null);
    sendResponse(result);
  },
  openOptionsPage: () => (window.location.href = '/options.html'),
} as unknown as typeof chrome.runtime;

chrome.identity = {
  getRedirectURL: () => window.location.href,
} as unknown as typeof chrome.identity;

async function handleRedirectAfterLogin() {
  await handleIncomingRedirect();
  return getDefaultSession();
}

const providerUrl = 'http://localhost:3000';

handleRedirectAfterLogin().then((session: Session) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: this dev environment is no chrome extension, so we use regular browser session here
  handler = createMessageHandler(session, providerUrl);
  renderApp(session);
});

const root = document.getElementById('webclip');
const shadowRoot = root.attachShadow({ mode: 'open' });
const container = document.createElement('div');
const styleTag = document.createElement('style');
styleTag.innerHTML = contentCss;
shadowRoot.appendChild(styleTag);
shadowRoot.appendChild(container);

function renderApp(session: Session) {
  ReactDOM.render(
    <PageContent
      close={() => {
        ReactDOM.unmountComponentAtNode(container);
        console.log('reload the page to re-open WebClip in dev mode');
      }}
      sessionInfo={session.info}
      providerUrl={providerUrl}
    />,
    container
  );
}
