import React from "react";
import ReactDOM from "react-dom";
import App from "../app/App";
import "./index.css";

window.onload = function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    console.log("active tab", tabs[0]);
    ReactDOM.render(<App tab={tabs[0]}/>, document.querySelector("#root"));
  });
}



