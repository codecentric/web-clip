import ReactDOM from "react-dom";
import React from "react";

import "./content.css";
import {PageContent} from "../src/content/PageContent";
import {types} from "../src/app/messages";
import {login, logout} from '@inrupt/solid-client-authn-browser'

async function loginWithRedirect() {
  await login({
    oidcIssuer: "https://angelo.veltens.org", // TODO: read from plugin configuration?
    redirectUrl: window.location.href,
  });
}



chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.type === types.LOGIN) {
      loginWithRedirect().then(() => console.log("logged in"));
      sendResponse("logged in");
    } else if (request.type === types.LOGOUT) {
      logout().then(() => console.log("logged out"))
      sendResponse("logged out");
    }
  }
);

const root = document.createElement("div")
root.id = "webtrack";
document.body.appendChild(root);

chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name === "communication-port");
  ReactDOM.render(<PageContent port={port}/>, document.querySelector("#webtrack"));
  port.onMessage.addListener(function(msg) {
    console.log("listener in content.js", msg);
  });
});

