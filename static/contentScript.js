import {
  login,
  handleIncomingRedirect,
  getDefaultSession,
  fetch
} from "@inrupt/solid-client-authn-browser";
import ReactDOM from "react-dom";
import App from "../app/App";
import React from "react";

import "./content.css";
import {Login} from "../app/Login";

console.log("content script active")



const root = document.createElement("div")
root.id = "webtrack";
document.body.appendChild(root);

ReactDOM.render(<Login />, document.querySelector("#webtrack"));
