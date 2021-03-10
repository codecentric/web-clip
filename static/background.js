import {types} from "../src/app/messages";

chrome.browserAction.onClicked.addListener(function (tab) {
  onClick(tab);
});

function onClick(tab) {
  chrome.tabs.sendMessage(tab.id, {type: types.ACTIVATE}, function (response) {});
}

