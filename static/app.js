import React from "react";
import ReactDOM from "react-dom";
import Popup from "../app/App";
import "./index.css";

window.onload = function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    ReactDOM.render(<Popup tab={tabs[0]}/>, document.querySelector("#root"));
  });
}



