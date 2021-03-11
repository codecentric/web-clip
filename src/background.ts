import { MessageType } from './messages';
import Tab = chrome.tabs.Tab;

chrome.browserAction.onClicked.addListener(function (tab) {
  onClick(tab);
});

function onClick(tab: Tab) {
  chrome.tabs.sendMessage(tab.id, { type: MessageType.ACTIVATE }, function () {
    return null;
  });
}
