import React from 'react';
import ReactDOM from 'react-dom';

import './assets/content.css';
import {
  getDefaultSession,
  handleIncomingRedirect,
  login,
  Session,
} from '@inrupt/solid-client-authn-browser';
import { PageContent } from './content/PageContent';
import { MessageType } from './messages';

const root = document.createElement('div');
document.body.appendChild(root);

async function handleRedirectAfterLogin() {
  await handleIncomingRedirect();
  return getDefaultSession();
}

handleRedirectAfterLogin().then((session: Session) => {
  if (session.info.isLoggedIn) {
    ReactDOM.render(<PageContent sessionInfo={session.info} />, root);
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.type) {
    case MessageType.ACTIVATE:
      ReactDOM.render(
        <PageContent sessionInfo={getDefaultSession().info} />,
        root
      );
      break;
    default:
      throw new Error('unknown message received');
  }
  sendResponse();
});
