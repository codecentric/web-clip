import { activateWebClipForTab } from './background/activate';
import { createMessageHandler } from './background/createMessageHandler';
import { sendMessageToActiveTab } from './background/sendMessageToActiveTab';
import { MessageType } from './messages';
import { Session } from './solid-client-authn-chrome-ext/Session';

const session = new Session();

let messageHandler = createMessageHandler(session);

chrome.browserAction.onClicked.addListener(function (tab) {
  activateWebClipForTab(tab, session.info);
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  messageHandler.handleMessage(request, sender).then(sendResponse);
  return true; // indicate async response
});

session.onLogin(() => {
  messageHandler = createMessageHandler(session);

  sendMessageToActiveTab({
    type: MessageType.LOGGED_IN,
    payload: session.info,
  });
});

session.onLogout(() => {
  messageHandler = createMessageHandler(session);
});
