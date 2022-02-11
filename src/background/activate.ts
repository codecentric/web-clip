import { MessageType } from '../messages';
import Tab = chrome.tabs.Tab;

export function activateWebClipForTab(tab: Tab) {
  chrome.tabs.sendMessage(tab.id, { type: MessageType.ACTIVATE }, function () {
    return null;
  });
}
