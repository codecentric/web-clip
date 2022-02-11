import { activateWebClipForTab } from './background/activate';

chrome.browserAction.onClicked.addListener(function (tab) {
  activateWebClipForTab(tab);
});
