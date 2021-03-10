import React from "react";
import ReactDOM from 'react-dom'

import "./content.css";
import {types} from "../src/app/messages";
import {getDefaultSession, handleIncomingRedirect, login} from '@inrupt/solid-client-authn-browser'
import {PageContent} from "../src/content/PageContent";

const root = document.createElement("div")
document.body.appendChild(root);

async function handleRedirectAfterLogin() {
  await handleIncomingRedirect();
  return getDefaultSession();
}

handleRedirectAfterLogin().then((session) => {
  if (session.info.isLoggedIn) {
    ReactDOM.render(<PageContent session={session} />, root)
  }
})

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    switch (request.type) {
      case types.ACTIVATE:
          ReactDOM.render(<PageContent />, root)
        break;
      default:
        throw new Error('unknown message received');
    }
    sendResponse()
  }
);