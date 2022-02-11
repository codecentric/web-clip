import { activateWebClipForTab } from './background/activate';
import { login } from './background/api';
import { MessageType } from './messages';

chrome.browserAction.onClicked.addListener(function (tab) {
  activateWebClipForTab(tab);
});

chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  if (request.type === MessageType.LOGIN) {
    await login();
    sendResponse();
  }
});
