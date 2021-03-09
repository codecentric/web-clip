import React from "react";

import "./content.css";
import {types} from "../src/app/messages";
import {getDefaultSession, handleIncomingRedirect, login} from '@inrupt/solid-client-authn-browser'

async function loginWithRedirect() {
  await login({
    oidcIssuer: "https://angelo.veltens.org", // TODO: read from plugin configuration?
    redirectUrl: window.location.href,
  });
}

const root = document.createElement("div")
root.id = "webtrack";
document.body.appendChild(root);

async function handleRedirectAfterLogin() {
  await handleIncomingRedirect();
  return getDefaultSession();
}

const promise = handleRedirectAfterLogin()

chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name === "communication-port");

  promise.then((session) => {
    console.log("send session to app", session)
    port.postMessage({type: "SESSION", payload: session});
  });

  port.onMessage.addListener(function(request) {
    console.log("received in content.js", request.type, {request});
    if (request.type === types.LOGIN) {
      loginWithRedirect().then(() => console.log("logged in"));
    }
  });
});

