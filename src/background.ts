import { SolidApi } from './api/SolidApi';
import { activateWebClipForTab } from './background/activate';
import { MessageHandler } from './background/MessageHandler';
import { sendMessageToActiveTab } from './background/sendMessageToActiveTab';
import { MessageType } from './messages';
import { Session } from './solid-client-authn-chrome-ext/Session';
import { Store } from './store/Store';

const session = new Session();

function createMessageHandler() {
  return new MessageHandler(
    new SolidApi(session, new Store(), chrome.identity.getRedirectURL())
  );
}

let messageHandler = createMessageHandler();

chrome.browserAction.onClicked.addListener(function (tab) {
  activateWebClipForTab(tab);
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  messageHandler.handleMessage(request, sender).then(sendResponse);
  return true; // indicate async response
});

session.onLogin(() => {
  messageHandler = createMessageHandler();

  sendMessageToActiveTab({
    type: MessageType.LOGGED_IN,
    payload: session.info,
  });
});

session.onLogout(() => {
  messageHandler = createMessageHandler();
});
