import {
  getDefaultSession,
  handleIncomingRedirect,
  Session,
} from '@inrupt/solid-client-authn-browser';
import React from 'react';
import ReactDOM from 'react-dom';

import './assets/content.css';
import { PageContent } from './content/PageContent';
import { MessageType } from './messages';

const root = document.createElement('div');
root.id = 'webtrack';
document.body.appendChild(root);

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
    default:
      throw new Error('unknown message received');
  }
  sendResponse();
});

function renderApp(session: Session) {
  ReactDOM.render(<PageContent sessionInfo={session.info} />, root);
}
